# core/collectors/store_collector.py
import os
import requests
import logging
from urllib.parse import unquote
import random
from dotenv import load_dotenv
from data.db_manager import DatabaseManager

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = logging.getLogger(__name__)

class StoreCollector:
    """소상공인시장진흥공단 상가 정보를 수집하는 클래스"""
    
    # 가이드에 명시된 ODCloud 기반 최신 API 엔드포인트
    BASE_URL = "https://api.odcloud.kr/api/15083033/v1/uddi:bb89aa82-09a4-4d4d-91d9-9d6681bb09a7"
    
    def __init__(self):
        # API 키 인코딩 충돌 방지 (Decoding Key 사용 권장)
        raw_key = os.getenv("PUBLIC_DATA_API_KEY", "")
        self.api_key = unquote(raw_key)
        self.db = DatabaseManager()

    def collect_by_dong(self, adong_cd):
        """
        특정 행정동 코드(10자리)에 대한 상가 정보를 수집하여 DB에 저장
        :param adong_cd: 행정동 코드 (예: 1168064000)
        """
        # ODCloud 규격 파라미터 (page, perPage 사용)
        params = {
            "serviceKey": self.api_key,
            "page": 1,
            "perPage": 1000,
            "returnType": "json",
            "cond[행정동코드::EQ]": adong_cd  # ODCloud 특유의 필터링 문법
        }

        logger.info(f"Store data(ODCloud) 수집 시작: AdongCode={adong_cd}")
        
        try:
            # ODCloud는 때로 Header에 Authorization을 요구하기도 함 (가이드 이미지 8번 참고)
            headers = {
                "accept": "application/json",
                "Authorization": f"Infuser {self.api_key}"
            }
            
            response = requests.get(self.BASE_URL, params=params, headers=headers, timeout=20)
            
            if response.status_code == 403:
                logger.error("ODCloud 403 Forbidden: API 키 권한 또는 인코딩 문제")
                return self._generate_fallback_data(adong_cd)

            response.raise_for_status()
            data = response.json()
            
            # ODCloud 응답 구조: data 필드에 리스트 존재
            if "data" in data and data["data"]:
                items = data["data"]
                self._save_to_db(items, adong_cd)
                return True
            else:
                logger.warning(f"No store data found for {adong_cd} in ODCloud response")
                return self._generate_fallback_data(adong_cd)
                
        except Exception as e:
            logger.error(f"Failed to collect store data: {e}. Running Fallback Strategy...")
            return self._generate_fallback_data(adong_cd)

    def _generate_fallback_data(self, adong_cd):
        """API 실패 시 지역별 샘플 상가 데이터 생성"""
        logger.info(f"Generating fallback store data for {adong_cd}")
        categories = [
            ("음식", "커피점/카페", "카페"),
            ("음식", "한식", "갈비/삼겹살"),
            ("소매", "의복의류", "캐주얼패션"),
            ("생활서비스", "이/미용", "여성미용실")
        ]
        
        fallback_items = []
        for i in range(20): # 최소 20개 매장 생성
            cat_l, cat_m, cat_s = random.choice(categories)
            fallback_items.append({
                'bno': f"F_{adong_cd}_{i}",
                'bizesNm': f"샘플_{cat_s}_{i}",
                'indsLclsNm': cat_l,
                'indsMclsNm': cat_m,
                'indsSclsNm': cat_s,
                'lnoAdr': f"서울특별시 특정구 특정동 {i}번지",
                'lat': 37.5 + random.uniform(0.01, 0.05),
                'lon': 127.0 + random.uniform(0.01, 0.05)
            })
            
        self._save_to_db(fallback_items, adong_cd, is_mock=1, data_quality="LOW")
        return True

    def _save_to_db(self, rows, adong_cd, is_mock=0, data_quality="HIGH"):
        """수집된 데이터를 DB에 저장 (Parameterized Query)
        WHY: is_mock 파라미터로 실제/Fallback 데이터 구분 가능
        """
        insert_query = """
        INSERT OR REPLACE INTO store_info (
            store_id, area_code, store_name,
            category_large, category_medium, category_small,
            address, latitude, longitude, is_mock, data_quality
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        processed_data = []
        for row in rows:
            # 영문 필드명과 한글 필드명을 모두 고려한 유연한 추출
            store_id = row.get('상가업소번호') or row.get('bno')
            store_name = row.get('상호명') or row.get('bizesNm')
            cat_l = row.get('상권업종대분류명') or row.get('indsLclsNm')
            cat_m = row.get('상권업종중분류명') or row.get('indsMclsNm')
            cat_s = row.get('상권업종소분류명') or row.get('indsSclsNm')
            addr = row.get('도로명주소') or row.get('rdnmAdr') or row.get('lnoAdr')
            lat = row.get('위도') or row.get('lat') or 0
            lon = row.get('경도') or row.get('lon') or 0

            processed_data.append((
                str(store_id),
                adong_cd,
                store_name,
                cat_l,
                cat_m,
                cat_s,
                addr,
                float(lat),
                float(lon),
                is_mock,
                data_quality
            ))
            
        if processed_data:
            self.db.execute_many(insert_query, processed_data)
            mock_label = "FALLBACK" if is_mock else "REAL"
            logger.info(
                f"[INFO] [store_collector] [_save_to_db] - "
                f"{len(processed_data)}건 저장 ({mock_label}): {adong_cd}"
            )

if __name__ == "__main__":
    # 실행 테스트
    logging.basicConfig(level=logging.INFO)
    collector = StoreCollector()
    # collector.collect_by_dong("1168064000") # 강남구 역삼1동 예시
