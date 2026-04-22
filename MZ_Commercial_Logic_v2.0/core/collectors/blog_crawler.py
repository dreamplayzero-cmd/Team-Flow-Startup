# core/collectors/blog_crawler.py
"""
WHY: 기존 HTML 스크래핑(BeautifulSoup) 방식 → 네이버 블로그 공식 검색 API로 완전 교체.
     이유 3가지:
     1. HTML 구조 변경 시 즉시 break 되는 취약성 제거
     2. 네이버 이용약관 준수 (합법적 데이터 수집)
     3. 공식 API는 postdate, title, description 구조화 데이터 제공 → 품질 향상
"""
import os
import re
import requests
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from data.db_manager import DatabaseManager

load_dotenv()
logger = logging.getLogger(__name__)


# =====================================================================
# [감성 사전] 확장 버전 (7개 → 30개 이상)
# WHY: 기존 7개 긍정어/6개 부정어로는 상권 분위기 파악이 불가능.
#      한국 음식/카페 리뷰에서 실제로 자주 쓰이는 표현들로 확장.
# =====================================================================
POSITIVE_WORDS = [
    # 맛/품질
    "맛있", "맛집", "최고", "훌륭", "완벽", "대박", "굿",
    # 감성/분위기
    "핫플", "분위기", "감성", "힙", "예쁜", "인스타",
    # 추천/재방문
    "추천", "재방문", "또올", "단골", "찐맛집",
    # 서비스
    "친절", "서비스", "깔끔", "청결",
    # 가성비
    "가성비", "합리", "만족",
    # 트렌드
    "줄서", "오픈런", "신상", "핫한",
]

NEGATIVE_WORDS = [
    # 맛/품질 불만
    "별로", "실망", "최악", "맛없", "형편없",
    # 서비스 불만
    "불친절", "불쾌", "무뚝뚝",
    # 가격 불만
    "비싸", "바가지", "과하",
    # 위생/시설 불만
    "더럽", "불결", "좁은", "시끄",
    # 재방문 거부
    "비추", "안와", "폐업", "사기",
]

# 부정어 수식어: 이 단어 뒤에 긍정어가 오면 부정으로 처리
NEGATION_WORDS = ["안", "못", "별로", "전혀", "결코", "절대"]


class BlogCrawler:
    """
    네이버 블로그 공식 검색 API를 활용한 상권 트렌드 분석 클래스
    WHY: 공식 API 사용으로 안정성 확보 + postdate 필터링으로 최신성 보장
    """

    BLOG_SEARCH_URL = "https://openapi.naver.com/v1/search/blog"
    MAX_DISPLAY = 100   # 한 번에 최대 100건 수집
    RECENT_MONTHS = 6   # 최근 6개월 이내 글만 분석

    def __init__(self):
        self.client_id = os.getenv("NAVER_CLIENT_ID")
        self.client_secret = os.getenv("NAVER_CLIENT_SECRET")
        self.db = DatabaseManager()

        if not self.client_id or not self.client_secret:
            logger.error("[ERROR] [blog_crawler] [__init__] - NAVER_CLIENT_ID/SECRET이 .env에 없음")

    def collect_trends(self, area_code, area_name, keyword_suffix="맛집"):
        """
        상권명 + 키워드를 조합하여 블로그 언급량 및 감성 분석 수행
        :param area_code: DB 지역 코드
        :param area_name: 상권명 (예: '한남동')
        :param keyword_suffix: 검색 접미사 (예: '카페', '맛집')
        :return: True(성공) / False(실패)
        """
        if not self.client_id:
            logger.warning("[WARNING] [blog_crawler] [collect_trends] - API 키 없어 Fallback 실행")
            return self._save_fallback(area_code, f"{area_name} {keyword_suffix}")

        query = f"{area_name} {keyword_suffix}"
        logger.info(f"[INFO] [blog_crawler] [collect_trends] - Blog API 수집 시작: '{query}'")

        try:
            headers = {
                "X-Naver-Client-Id": self.client_id,
                "X-Naver-Client-Secret": self.client_secret,
            }
            params = {
                "query": query,
                "display": self.MAX_DISPLAY,
                "sort": "date",   # WHY: 최신순 정렬로 시의성 확보
            }

            response = requests.get(
                self.BLOG_SEARCH_URL,
                headers=headers,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            items = data.get("items", [])
            if not items:
                logger.warning(f"[WARNING] [blog_crawler] [collect_trends] - 결과 없음: '{query}'")
                return self._save_fallback(area_code, query)

            # 최근 N개월 이내 글만 필터링
            cutoff_date = datetime.now() - timedelta(days=self.RECENT_MONTHS * 30)
            filtered_items = self._filter_recent(items, cutoff_date)

            if not filtered_items:
                logger.warning(f"[WARNING] [blog_crawler] [collect_trends] - 최근 {self.RECENT_MONTHS}개월 내 글 없음: '{query}'")
                filtered_items = items[:30]  # 필터링 결과 없으면 최신 30개 사용

            mention_count = len(filtered_items)

            # 감성 분석 (고도화 버전)
            texts = [
                self._clean_html(item.get("title", "")) + " " +
                self._clean_html(item.get("description", ""))
                for item in filtered_items
            ]
            sentiment_score, pos_count, neg_count = self._analyze_sentiment(texts)

            # DB 저장 (LLM용 snippet 포함)
            snippet_text = "\n".join(texts[:10])  # 상위 10개 글 요약만 전달
            self._save_to_db(
                area_code, query, mention_count,
                sentiment_score, pos_count, neg_count,
                snippet_text=snippet_text,
                is_mock=0, data_quality="HIGH"
            )
            logger.info(
                f"[INFO] [blog_crawler] [collect_trends] - "
                f"'{query}' | 수집={mention_count}건 | 감성={sentiment_score:.2f} "
                f"(긍정={pos_count}, 부정={neg_count})"
            )
            return True

        except requests.RequestException as e:
            logger.error(f"[ERROR] [blog_crawler] [collect_trends] - API 요청 실패: {e}")
            return self._save_fallback(area_code, query)
        except Exception as e:
            logger.error(f"[ERROR] [blog_crawler] [collect_trends] - 예상치 못한 오류: {e}")
            return self._save_fallback(area_code, query)

    def _filter_recent(self, items, cutoff_date):
        """
        postdate(YYYYMMDD) 기준으로 최신 글만 필터링
        WHY: 오래된 글(2~3년 전)이 섞이면 현재 상권 분위기가 왜곡됨
        """
        recent = []
        for item in items:
            postdate_str = item.get("postdate", "")
            try:
                post_dt = datetime.strptime(postdate_str, "%Y%m%d")
                if post_dt >= cutoff_date:
                    recent.append(item)
            except (ValueError, TypeError):
                recent.append(item)  # 날짜 파싱 실패 시 포함
        return recent

    def _analyze_sentiment(self, texts):
        """
        고도화된 감성 분석 로직
        WHY: 기존 단순 단어 카운트 방식에서 부정어 수식어 처리 추가.
             '안 맛있어', '추천 안 함' 같은 패턴을 부정으로 정확히 분류.
        :return: (sentiment_score, pos_count, neg_count)
        """
        if not texts:
            return 0.5, 0, 0

        all_text = " ".join(texts)
        # HTML 태그 제거
        all_text = re.sub(r'<[^>]+>', '', all_text)

        pos_count = 0
        neg_count = 0

        # 1. 명시적 부정어 카운트
        for word in NEGATIVE_WORDS:
            neg_count += len(re.findall(word, all_text))

        # 2. 긍정어 카운트 (단, 앞에 부정어 수식어가 있으면 부정으로 처리)
        for word in POSITIVE_WORDS:
            matches = list(re.finditer(word, all_text))
            for match in matches:
                start = max(0, match.start() - 8)  # 앞 8글자 체크
                prefix = all_text[start:match.start()]
                if any(neg in prefix for neg in NEGATION_WORDS):
                    neg_count += 1   # '안 맛있', '별로 추천' → 부정 처리
                else:
                    pos_count += 1

        total = pos_count + neg_count
        if total == 0:
            return 0.5, 0, 0

        score = round(pos_count / total, 3)
        return score, pos_count, neg_count

    @staticmethod
    def _clean_html(text):
        """네이버 API 응답의 HTML 태그(<b>, </b>) 제거"""
        return re.sub(r'<[^>]+>', '', text)

    def _save_to_db(self, area_code, query, mention_count,
                    sentiment_score, pos_count, neg_count,
                    snippet_text='', is_mock=0, data_quality="UNKNOWN"):
        """분석된 트렌드 데이터를 DB에 저장 (중복 방지: INSERT OR REPLACE)"""
        insert_query = """
        INSERT OR REPLACE INTO blog_analysis
            (area_code, keyword, mention_count, sentiment_score,
             positive_count, negative_count, snippet_text, analysis_date, is_mock, data_quality)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        data = (
            area_code, query, mention_count, sentiment_score,
            pos_count, neg_count, snippet_text,
            datetime.now().strftime("%Y-%m-%d"),
            is_mock, data_quality
        )
        self.db.execute_query(insert_query, data)
        logger.info(
            f"[INFO] [blog_crawler] [_save_to_db] - "
            f"저장 완료: {area_code} | is_mock={is_mock} | quality={data_quality}"
        )

    def _save_fallback(self, area_code, query):
        """API 실패 시 중립 Fallback 데이터 저장 (is_mock=1 마킹)"""
        logger.warning(
            f"[WARNING] [blog_crawler] [_save_fallback] - "
            f"Fallback 저장 (is_mock=1): '{query}'"
        )
        self._save_to_db(
            area_code, query,
            mention_count=0,
            sentiment_score=0.5,
            pos_count=0,
            neg_count=0,
            is_mock=1,
            data_quality="LOW"
        )
        return False


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    crawler = BlogCrawler()
    # 테스트 예시
    # crawler.collect_trends("1120067000", "성수동", "카페")
