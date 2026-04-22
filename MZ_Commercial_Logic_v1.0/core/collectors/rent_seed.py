# core/collectors/rent_seed.py
import logging
from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_rent_data():
    """상권별 현실적인 임대료 시드 데이터 주입"""
    db = DatabaseManager()
    
    # 지역별 평당/전용면적 기준 평균 월세 (만원 단위)
    # 성수, 한남 등은 고가 상권
    rent_map = {
        "성수동": 450,
        "한남동": 500,
        "가로수길": 480,
        "이태원": 350,
        "망원동": 220,
        "연남동": 280,
    }
    
    insert_q = """
    INSERT OR REPLACE INTO area_rent_info 
    (area_code, area_name, floor_type, avg_rent_10k, avg_deposit_10k, is_mock)
    VALUES (?, ?, ?, ?, ?, ?)
    """
    
    records = []
    for area_name, info in AREA_MAP.items():
        area_code = info['code']
        rent = rent_map.get(area_name, 200) # 기본 200만
        deposit = rent * 12 # 보통 1년치 월세 보증금 가정
        
        records.append((
            area_code, area_name, '1F', rent, deposit, 1 # is_mock=1
        ))
    
    if records:
        db.execute_many(insert_q, records)
        logger.info(f"Successfully seeded {len(records)} rent records.")

if __name__ == "__main__":
    seed_rent_data()
