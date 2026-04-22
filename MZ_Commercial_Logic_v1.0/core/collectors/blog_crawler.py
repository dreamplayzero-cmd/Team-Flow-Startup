# core/collectors/blog_crawler.py
import requests
from bs4 import BeautifulSoup
import logging
import re
from datetime import datetime
from data.db_manager import DatabaseManager

# 로깅 설정
logger = logging.getLogger(__name__)

class BlogCrawler:
    """네이버 블로그를 크롤링하여 상권 트렌드를 분석하는 클래스"""
    
    SEARCH_URL = "https://search.naver.com/search.naver"
    
    def __init__(self):
        self.db = DatabaseManager()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def collect_trends(self, area_code, area_name, keyword_suffix="맛집"):
        """
        상권명과 키워드를 조합하여 블로그 언급량 및 감성 분석
        :param area_code: DB 지역 코드
        :param area_name: 상권명 (예: '한남동')
        :param keyword_suffix: 검색 접미사
        """
        query = f"{area_name} {keyword_suffix}"
        params = {
            "where": "blog",
            "query": query,
            "sm": "tab_opt"
        }

        logger.info(f"Blog crawling 시작: Query='{query}'")
        
        try:
            response = requests.get(self.SEARCH_URL, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 검색 결과 개수 추출 (추정치)
            # Naver 검색창 하단의 '건수' 텍스트 등을 파싱 (사이트 구조 변경에 취약할 수 있음)
            # 여기서는 간단히 첫 페이지의 블로그 제목과 요약 내용을 가져와 감성 분석 수행
            
            blog_items = soup.select(".api_ani_send") # 네이버 블로그 검색 결과 아이템 클래스 (변경 가능성 있음)
            mention_count = len(blog_items)
            
            texts = []
            for item in blog_items:
                title = item.select_one(".api_txt_lines.dsc_txt_title")
                content = item.select_one(".api_txt_lines.dsc_txt")
                if title and content:
                    texts.append(title.get_text() + " " + content.get_text())
            
            sentiment_score = self._analyze_sentiment(texts)
            
            self._save_to_db(area_code, query, mention_count, sentiment_score)
            return True
            
        except Exception as e:
            logger.error(f"Failed to crawl blogs for {query}: {e}")
            return False

    def _analyze_sentiment(self, texts):
        """간이 감성 분석 로직 (키워드 매칭 방식)"""
        positive_words = ["좋아요", "추천", "맛있어요", "최고", "핫플", "친절", "분위기"]
        negative_words = ["별로", "비추", "아쉬워요", "불친절", "별점 낮음", "비싸요"]
        
        if not texts:
            return 0.5 # 데이터 없으면 중간값
            
        pos_count = 0
        neg_count = 0
        
        all_text = " ".join(texts)
        for word in positive_words:
            pos_count += len(re.findall(word, all_text))
        for word in negative_words:
            neg_count += len(re.findall(word, all_text))
            
        total = pos_count + neg_count
        if total == 0:
            return 0.5
            
        return round(pos_count / total, 2)

    def _save_to_db(self, area_code, query, mention_count, sentiment_score):
        """분석된 트렌드 데이터를 DB에 저장"""
        
        insert_query = """
        INSERT INTO blog_analysis (area_code, keyword, mention_count, sentiment_score, analysis_date)
        VALUES (?, ?, ?, ?, ?)
        """
        data = (area_code, query, mention_count, sentiment_score, datetime.now().strftime("%Y-%m-%d"))
        self.db.execute_query(insert_query, data)
        logger.info(f"Saved blog analysis for {area_code}: Score={sentiment_score}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    crawler = BlogCrawler()
    # crawler.collect_trends("강남역", "MZ 핫플")
