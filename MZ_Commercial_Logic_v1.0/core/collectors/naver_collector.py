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
        """API 결과 가공 및 DB 저장"""
        data_points = result.get('data', [])
        if not data_points:
            logger.warning(f"No data points for {group_name}")
            return

        latest_ratio = data_points[-1]['ratio']
        
        insert_query = """
        INSERT INTO keyword_trends (area_code, keyword, search_volume, search_platform, target_month)
        VALUES (?, ?, ?, ?, ?)
        """
        save_data = (area_code, group_name, int(latest_ratio), "Naver", datetime.now().strftime("%Y-%m-%d"))
        
        self.db.execute_query(insert_query, save_data)
        logger.info(f"Successfully saved Naver trend for {group_name} in {area_code}")
