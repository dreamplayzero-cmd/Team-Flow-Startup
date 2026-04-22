# core/collectors/naver_collector.py
import os
import json
import requests
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from data.db_manager import DatabaseManager

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = logging.getLogger(__name__)

class NaverCollector:
    """네이버 데이터랩(검색어 트렌드) API를 통해 수집하는 클래스"""
    
    URL = "https://openapi.naver.com/v1/datalab/search"
    
    def __init__(self):
        self.client_id = os.getenv("NAVER_CLIENT_ID")
        self.client_secret = os.getenv("NAVER_CLIENT_SECRET")
        self.db = DatabaseManager()

    def get_search_trend(self, area_code, group_name, keywords):
        """
        특정 키워드 그룹의 검색 트렌드 수집
        :param area_code: DB와 매칭되는 지역 코드 (Foreign Key)
        :param group_name: 그룹 이름 (예: '성수 카페')
        :param keywords: 관련 키워드 리스트 (최대 20개)
        """
        if not self.client_id or not self.client_secret:
            logger.error("Naver API credentials missing in .env")
            return None

        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

        body = {
            "startDate": start_date,
            "endDate": end_date,
            "timeUnit": "date",
            "keywordGroups": [
                {
                    "groupName": group_name,
                    "keywords": keywords[:20]
                }
            ]
        }

        headers = {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(self.URL, headers=headers, data=json.dumps(body))
            response.raise_for_status()
            data = response.json()
            
            if "results" in data:
                result = data["results"][0]
                self._process_and_save(area_code, result, group_name)
                return result
            return None
        except Exception as e:
            logger.error(f"Naver API call failed for {group_name}: {e}")
            return None

    def _process_and_save(self, area_code, result, group_name):
        """API 결과 가공 및 DB 저장
        WHY: 기존 마지막 1개 포인트만 저장하던 방식에서
             30일 평균(avg_ratio)과 증가율(growth_rate)을 함께 저장하는 방식으로 교체.
             단일 스냅샷보다 트렌드 방향성이 스코어링에 훨씬 유용함.
        """
        data_points = result.get('data', [])
        if not data_points:
            logger.warning(f"No data points for {group_name}")
            return

        ratios = [dp.get('ratio', 0) for dp in data_points if dp.get('ratio') is not None]
        if not ratios:
            return

        # 1. 30일 전체 평균 비율 계산 (신뢰성이 높은 수치)
        avg_ratio = sum(ratios) / len(ratios)

        # 2. 증가율 계산: 전반부(15일) 평균 vs 후반부(15일) 평균 비교
        #    WHY: 단순 최신값보다 추세선 기울기가 상권 확장/위축 판단에 유리
        mid = len(ratios) // 2
        first_half_avg = sum(ratios[:mid]) / max(mid, 1)
        second_half_avg = sum(ratios[mid:]) / max(len(ratios) - mid, 1)
        if first_half_avg > 0:
            growth_rate = round((second_half_avg - first_half_avg) / first_half_avg * 100, 2)
        else:
            growth_rate = 0.0

        # 3. search_volume은 avg_ratio를 기준으로 저장 (스코어링에서 바로 사용)
        #    INSERT OR REPLACE: UNIQUE(area_code, keyword, target_month) 제약으로 중복 방지
        insert_query = """
        INSERT OR REPLACE INTO keyword_trends
            (area_code, keyword, search_volume, avg_ratio, growth_rate, search_platform, target_month, is_mock, data_quality)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        save_data = (
            area_code,
            group_name,
            round(avg_ratio, 2),         # search_volume = avg_ratio (0~100 범위)
            round(avg_ratio, 2),         # avg_ratio
            growth_rate,                  # growth_rate (%)
            "Naver",
            datetime.now().strftime("%Y-%m-%d"),
            0,                            # is_mock=0 (실제 API 데이터)
            "HIGH"                        # data_quality='HIGH'
        )
        self.db.execute_query(insert_query, save_data)
        logger.info(
            f"[INFO] [naver_collector] [_process_and_save] - "
            f"{group_name} | avg_ratio={avg_ratio:.1f} | growth={growth_rate:+.1f}%"
        )
