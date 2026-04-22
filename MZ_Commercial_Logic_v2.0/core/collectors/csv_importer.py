import sys
from pathlib import Path
import os
import pandas as pd
import logging
from sqlite3 import Error as SQLiteError

sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from data.db_manager import DatabaseManager

logger = logging.getLogger(__name__)

def import_store_data(csv_path, status_callback=None):
    """
    지정된 CSV 파일에서 상가 데이터를 읽고, 
    master_areas에 등록된 지역 코드에 해당하는 상가들만 DB에 적재합니다.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {csv_path}")

    db = DatabaseManager()
    
    if status_callback: status_callback("DB 타겟 지역 조회 중...")
    valid_areas = db.execute_query("SELECT area_code, area_name FROM master_areas")
    if not valid_areas:
        raise ValueError("master_areas에 등록된 지역 목록이 없습니다.")
        
    area_codes = [area[0] for area in valid_areas]
    
    if status_callback: status_callback("대용량 CSV 파일 로딩 중... (최대 10초 소요)")
    try:
        df = pd.read_csv(csv_path, encoding='utf-8', low_memory=False)
    except Exception:
        df = pd.read_csv(csv_path, encoding='cp949', low_memory=False)
        
    if '행정동코드' not in df.columns:
        raise ValueError("CSV 파일에 '행정동코드' 컬럼이 존재하지 않습니다. 올바른 파일인지 확인하세요.")

    if status_callback: status_callback("지역 기반 상가 데이터 매칭 중...")
    
    df['행정동코드'] = df['행정동코드'].astype(str).str.strip()
    df['match_code'] = df['행정동코드'].str[:8]
    
    area_codes_8_to_10 = {str(code)[:8]: str(code) for code in area_codes if str(code).strip()}
    
    filtered_df = df[df['match_code'].isin(area_codes_8_to_10.keys())].copy()
    filtered_df['DB_area_code'] = filtered_df['match_code'].map(area_codes_8_to_10)

    if len(filtered_df) == 0:
        raise ValueError("매칭된 타겟 지역 상가가 0건입니다.")

    if status_callback: status_callback(f"총 {len(filtered_df):,}건 추출. DB 적재 준비...")

    insert_query = """
    INSERT OR REPLACE INTO store_info 
    (store_id, area_code, store_name, category_large, category_medium, category_small, address, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    records_to_insert = []
    for index, row in filtered_df.iterrows():
        store_id = str(row.get('상가업소번호', ''))
        area_code = str(row.get('DB_area_code', ''))
        store_name = str(row.get('상호명', ''))
        cat_large = str(row.get('상권업종대분류명', ''))
        cat_medium = str(row.get('상권업종중분류명', ''))
        cat_small = str(row.get('상권업종소분류명', ''))
        address = str(row.get('도로명주소', ''))
        try:
            lat = float(row.get('위도', 0.0))
            lon = float(row.get('경도', 0.0))
        except ValueError:
            lat, lon = 0.0, 0.0
            
        records_to_insert.append((
            store_id, area_code, store_name, cat_large, cat_medium, cat_small, address, lat, lon
        ))
        
    chunk_size = 5000
    total_inserted = 0
    total_chunks = (len(records_to_insert) // chunk_size) + 1
    
    for i in range(0, len(records_to_insert), chunk_size):
        chunk = records_to_insert[i:i + chunk_size]
        success = db.execute_many(insert_query, chunk)
        if success:
            total_inserted += len(chunk)
            if status_callback: status_callback(f"DB 저장 진행 중... ({total_inserted:,} / {len(records_to_insert):,}건)")
        else:
            logger.error(f"  {i} ~ {i+chunk_size} 구간 저장 실패")
            
    if status_callback: status_callback(f"완료! 총 {total_inserted:,}건 적재 성공.")
    return total_inserted
