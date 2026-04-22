"""
CSV 상가 데이터 DB 임포트 스크립트
공공데이터포털 상가 CSV 파일에서 master_areas에 있는 지역의 상가만 추출하여 DB에 저장
실행: python tests/import_store_csv.py
"""
import sys
import os
from pathlib import Path
import pandas as pd
import logging

sys.path.append(str(Path(__file__).resolve().parent.parent))

from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

CSV_PATH = r"C:\Users\JM2\Desktop\소상공인시장진흥공단_상가(상권)정보_20251231\소상공인시장진흥공단_상가(상권)정보_서울_202512.csv"

def run_import():
    if not os.path.exists(CSV_PATH):
        logger.error(f"CSV 파일을 찾을 수 없습니다: {CSV_PATH}")
        return

    db = DatabaseManager()
    
    # DB에 등록된 지역 코드 목록 가져오기
    valid_areas = db.execute_query("SELECT area_code, area_name FROM master_areas")
    if not valid_areas:
        logger.error("master_areas에 등록된 지역이 없습니다.")
        return
        
    area_codes = [area[0] for area in valid_areas]
    area_names = {area[0]: area[1] for area in valid_areas}
    
    logger.info(f"타겟 지역 목록 ({len(area_codes)}개): {', '.join(area_names.values())}")
    logger.info("대용량 CSV 파일 로딩 중... (몇 초 정도 소요됩니다)")

    try:
        # UTF-8 파일 읽기, 용량이 크면 chunk를 쓰는 것도 좋지만 300MB는 pandas로 한 번에 처리 가능
        try:
            df = pd.read_csv(CSV_PATH, encoding='utf-8', low_memory=False)
        except Exception:
            df = pd.read_csv(CSV_PATH, encoding='cp949', low_memory=False)
            
        logger.info(f"전체 상가 데이터: {len(df):,}건 로드 완료")
        
        # 행정동코드를 문자열로 변환하고 8자리 기준으로 매칭
        if '행정동코드' in df.columns:
            df['행정동코드'] = df['행정동코드'].astype(str).str.strip()
            df['match_code'] = df['행정동코드'].str[:8]
        else:
            logger.error("CSV 파일에 '행정동코드' 컬럼이 없습니다.")
            return

        # master_areas의 10자리 코드들을 8자리로 변환하여 매핑용 딕셔너리 생성
        area_codes_8_to_10 = {str(code)[:8]: str(code) for code in area_codes if str(code).strip()}
        
        filtered_df = df[df['match_code'].isin(area_codes_8_to_10.keys())].copy()
        
        # DB에 저장할 때에는 다시 원래 10자리 కో드를 쓰도록 치환
        filtered_df['DB_area_code'] = filtered_df['match_code'].map(area_codes_8_to_10)

        logger.info(f"타겟 지역 내 상가 데이터: {len(filtered_df):,}건 추출 완료")
        
        if len(filtered_df) == 0:
            logger.warning("타겟 지역의 상가 데이터가 하나도 없습니다. 지역 코드를 확인하세요.")
            # 추가 확인: 행정동명으로 필터링 테스트
            sample = df[df['행정동명'].str.contains('성수|상암|합정', na=False, case=False)]
            if not sample.empty:
                logger.info(f"참고: '성수/상암/합정' 이름으로 검색된 샘플의 행정동코드: {sample['행정동코드'].iloc[0]}")
            return

        # DB에 저장할 형태로 데이터 매핑
        insert_query = """
        INSERT OR REPLACE INTO store_info 
        (store_id, area_code, store_name, category_large, category_medium, category_small, address, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        records_to_insert = []
        for index, row in filtered_df.iterrows():
            store_id = str(row.get('상가업소번호', ''))
            area_code = str(row.get('DB_area_code', ''))  # 변환된 10자리 코드 적용
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
            
        logger.info("DB에 저장 중입니다...")
        
        # 청크 단위로 나누어 저장 (너무 한 번에 넣으면 SQLite 부하)
        chunk_size = 5000
        total_inserted = 0
        from sqlite3 import Error as SQLiteError
        
        for i in range(0, len(records_to_insert), chunk_size):
            chunk = records_to_insert[i:i + chunk_size]
            success = db.execute_many(insert_query, chunk)
            if success:
                total_inserted += len(chunk)
                logger.info(f"  {total_inserted}/{len(records_to_insert)}건 완료")
            else:
                logger.error(f"  {i} ~ {i+chunk_size} 구간 저장 실패")
                
        logger.info(f"완료! 총 {total_inserted:,}건의 상가 데이터가 DB에 적재되었습니다.")

    except Exception as e:
        logger.error(f"실행 중 예외 발생: {e}")

if __name__ == "__main__":
    run_import()
