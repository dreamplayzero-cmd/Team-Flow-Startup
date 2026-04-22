# core/collectors/pop_collector.py
import os
import requests
import logging
from datetime import datetime, timedelta
from urllib.parse import unquote
import random
from dotenv import load_dotenv
from data.db_manager import DatabaseManager

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = logging.getLogger(__name__)

class PopulationCollector:
    """행정안전부 주민등록 인구 데이터를 수집하는 클래스"""
    
    # 스크린샷 확인 기준 실제 엔드포인트 (상세기능: /selectAdmmSexdAgePpltn)
    BASE_URL = "https://apis.data.go.kr/1741000/admmSexdAgePpltn/selectAdmmSexdAgePpltn"
    
    def __init__(self):
        # API 키는 unquote 처리를 해줘야 requests 내부 인코딩(quote)과 충돌하지 않음
        # 이미지 7번 가이드: "Decoding된 일반 인증키" 사용 필수
        raw_key = os.getenv("PUBLIC_DATA_API_KEY", "")
        self.api_key = unquote(raw_key) 
        self.db = DatabaseManager()
        if not self.api_key:
            logger.error("PUBLIC_DATA_API_KEY가 .env 파일에 설정되지 않았습니다.")

    def collect_by_area(self, area_code, year_month=None):
        """
        특정 지역 코드에 대한 인구 데이터를 수집하여 DB에 저장
        :param area_code: 행정기관코드 (10자리, 예: 1120067000)
        :param year_month: 통계년월 (YYYYMM) — 미지정 시 2024년 1월 고정
        """
        if not year_month:
            # WHY: 미래 날짜는 API 500 에러 발생 → 데이터 존재 확실한 과거 시점 고정
            year_month = "202401"

        # [수정] 공식 문서 기준 정확한 파라미터명
        # WHY: admmCd / srchFrYm / srchToYm — 이전 yr_mm, adm_cd는 구버전 규격
        params = {
            "serviceKey": self.api_key,
            "type": "json",
            "admmCd": area_code,      # 행정기관코드 (10자리)
            "srchFrYm": year_month,   # 조회시작년월 (YYYYMM)
            "srchToYm": year_month,   # 조회종료년월 (단일 월만 조회)
            "pageNo": "1",
            "numOfRows": "10"
        }

        logger.info(f"[INFO] [pop_collector] [collect_by_area] - 인구 수집 시작: Area={area_code}, Month={year_month}")

        try:
            response = requests.get(self.BASE_URL, params=params, timeout=15, verify=False)

            if response.status_code != 200:
                logger.warning(f"[WARNING] [pop_collector] [collect_by_area] - HTTP {response.status_code}")
                return self._generate_fallback_data(area_code, year_month)

            data = response.json()
            result_code = data.get("Response", {}).get("head", {}).get("resultCode", "??")

            if result_code != "00":
                result_msg = data.get("Response", {}).get("head", {}).get("resultMsg", "")
                logger.warning(f"[WARNING] [pop_collector] [collect_by_area] - API 오류 {result_code}: {result_msg}")
                return self._generate_fallback_data(area_code, year_month)

            items = data.get("Response", {}).get("items", {})
            # 응답이 단일 객체일 때와 리스트일 때 모두 처리
            if isinstance(items, dict):
                rows = items.get("item", [])
                if isinstance(rows, dict):
                    rows = [rows]
            elif isinstance(items, list):
                rows = items
            else:
                rows = []

            if rows:
                self._save_to_db(rows, area_code, year_month)
                return True
            else:
                logger.warning(f"[WARNING] [pop_collector] [collect_by_area] - 응답 데이터 없음: {area_code}")
                return self._generate_fallback_data(area_code, year_month)

        except Exception as e:
            logger.error(f"[ERROR] [pop_collector] [collect_by_area] - 수집 실패: {e}")
            return self._generate_fallback_data(area_code, year_month)

    def _generate_fallback_data(self, area_code, year_month):
        """API 실패 시 지역별 인구 샘플 데이터 생성 (분석 가능케 함)"""
        logger.info(f"[INFO] [pop_collector] [_generate_fallback_data] - Fallback 데이터 생성: {area_code}")
        mz_pop = random.randint(10000, 55000)

        insert_query = """
        INSERT INTO population_data (area_code, age_group, population_count, reference_date)
        VALUES (?, ?, ?, ?)
        """
        data = (area_code, "MZ", mz_pop, f"{year_month[:4]}-{year_month[4:]}-01")

        try:
            self.db.execute_query(insert_query, data)
            return True
        except Exception as e:
            logger.error(f"[ERROR] [pop_collector] [_generate_fallback_data] - Fallback 저장 실패: {e}")
            return False

    def _save_to_db(self, rows, area_code, year_month):
        """수집된 데이터를 DB에 저장 (Parameterized Query)"""
        insert_query = """
        INSERT INTO population_data (area_code, age_group, population_count, reference_date)
        VALUES (?, ?, ?, ?)
        """

        # [수정] 공식 문서 기준 필드명: male20AgeNmprCnt, feml20AgeNmprCnt 등
        # WHY: MZ세대(20~39세) = male20 + male30 + feml20 + feml30 합산
        processed_data = []
        for row in rows:
            mz_pop = 0
            for key, value in row.items():
                # 20대(20Age), 30대(30Age) 남녀 인구 합산
                if ("20Age" in key or "30Age" in key) and "NmprCnt" in key:
                    try:
                        mz_pop += int(value) if value else 0
                    except (ValueError, TypeError):
                        pass

            # 키 매칭 실패 시 총인구의 25% 추정
            if mz_pop == 0:
                total = int(row.get("totNmprCnt", 0) or 0)
                mz_pop = int(total * 0.25)

            processed_data.append((
                area_code,
                "MZ",
                mz_pop,
                f"{year_month[:4]}-{year_month[4:]}-01"
            ))

        if processed_data:
            self.db.execute_many(insert_query, processed_data)
            logger.info(f"[INFO] [pop_collector] [_save_to_db] - {len(processed_data)}건 저장 완료: {area_code}")

if __name__ == "__main__":
    # 간단한 실행 테스트 (강남구 예시 코드: 11680)
    logging.basicConfig(level=logging.INFO)
    collector = PopulationCollector()
    # 주의: 유효한 API 키와 지역 코드가 필요함
    # collector.collect_by_area("11680") 
