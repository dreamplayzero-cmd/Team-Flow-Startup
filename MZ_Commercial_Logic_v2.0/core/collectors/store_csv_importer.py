# core/collectors/csv_importer.py
"""
소상공인 상가 데이터 수동 CSV 적재 모듈 (개선 v2)
WHY: 소상공인 ODCloud API가 403 Forbidden으로 자동 수집 불가.
     수동 CSV 업로드가 현재 가장 신뢰할 수 있는 상가 데이터 수집 방법.
     개선 사항:
     1. is_mock=0, data_quality='HIGH' 마킹 (실제 데이터임을 명시)
     2. 진행률 콜백에 퍼센트(%) 정보 추가
     3. 인코딩 자동 감지 강화
"""
import sys
import os
import logging
import pandas as pd
from pathlib import Path
from datetime import datetime

sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

logger = logging.getLogger(__name__)


def import_store_data(csv_path: str, status_callback=None) -> int:
    """
    지정된 CSV 파일에서 상가 데이터를 읽고,
    master_areas에 등록된 지역 코드에 해당하는 상가들만 DB에 적재.
    :param csv_path: 소상공인진흥공단 전국 상가 CSV 파일 경로
    :param status_callback: 진행 상황 콜백 함수 (UI 업데이트용)
    :return: 적재된 총 건수
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {csv_path}")

    db = DatabaseManager()

    if status_callback:
        status_callback("DB 타겟 지역 조회 중...")

    valid_areas = db.execute_query("SELECT area_code, area_name FROM master_areas")
    if not valid_areas:
        raise ValueError("master_areas에 등록된 지역 목록이 없습니다.")

    area_codes = [row['area_code'] for row in valid_areas]

    if status_callback:
        status_callback("대용량 CSV 파일 로딩 중... (수백 MB 파일은 30초 이상 소요)")

    try:
        df = pd.read_csv(csv_path, encoding='utf-8', low_memory=False)
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding='cp949', low_memory=False)

    if '행정동코드' not in df.columns:
        raise ValueError("CSV 파일에 '행정동코드' 컬럼이 없습니다. 소상공인 공식 CSV인지 확인하세요.")

    if status_callback:
        status_callback(f"전체 {len(df):,}건 로드 완료. 타겟 지역 매칭 중...")

    # 8자리 앞자리 매칭 (10자리 area_code 중 앞 8자리로 필터링)
    df['행정동코드'] = df['행정동코드'].astype(str).str.strip()
    df['match_code'] = df['행정동코드'].str[:8]
    area_codes_8_to_10 = {str(code)[:8]: str(code) for code in area_codes if str(code).strip()}

    filtered_df = df[df['match_code'].isin(area_codes_8_to_10.keys())].copy()
    filtered_df['DB_area_code'] = filtered_df['match_code'].map(area_codes_8_to_10)

    if len(filtered_df) == 0:
        raise ValueError(
            f"매칭된 타겟 지역 상가가 0건입니다.\n"
            f"타겟 지역: {list(area_codes_8_to_10.keys())}\n"
            f"CSV 코드 샘플: {df['행정동코드'].head(5).tolist()}"
        )

    if status_callback:
        status_callback(f"타겟 지역 {len(filtered_df):,}건 추출 완료. DB 적재 시작...")

    # is_mock=0, data_quality='HIGH' 포함 (실제 소상공인 데이터)
    insert_query = """
    INSERT OR REPLACE INTO store_info
    (store_id, area_code, store_name, category_large, category_medium,
     category_small, address, latitude, longitude, is_mock, data_quality)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    records_to_insert = []
    for _, row in filtered_df.iterrows():
        try:
            lat = float(row.get('위도', 0.0) or 0.0)
            lon = float(row.get('경도', 0.0) or 0.0)
        except (ValueError, TypeError):
            lat, lon = 0.0, 0.0

        records_to_insert.append((
            str(row.get('상가업소번호', '')),
            str(row.get('DB_area_code', '')),
            str(row.get('상호명', '')),
            str(row.get('상권업종대분류명', '')),
            str(row.get('상권업종중분류명', '')),
            str(row.get('상권업종소분류명', '')),
            str(row.get('도로명주소', '')),
            lat,
            lon,
            0,       # is_mock=0 (실제 소상공인 CSV 데이터)
            'HIGH',  # data_quality='HIGH'
        ))

    chunk_size = 5000
    total_inserted = 0
    total = len(records_to_insert)

    for i in range(0, total, chunk_size):
        chunk = records_to_insert[i:i + chunk_size]
        success = db.execute_many(insert_query, chunk)
        if success:
            total_inserted += len(chunk)
            pct = int(total_inserted / total * 100)
            if status_callback:
                status_callback(f"DB 저장 중... {total_inserted:,} / {total:,}건 ({pct}%)")
        else:
            logger.error(
                f"[ERROR] [csv_importer] [import_store_data] - "
                f"청크 {i}~{i+chunk_size} 저장 실패"
            )

    logger.info(
        f"[INFO] [csv_importer] [import_store_data] - "
        f"상가 CSV 적재 완료: {total_inserted:,}건 / is_mock=0 / quality=HIGH"
    )
    if status_callback:
        status_callback(f"✅ 완료! 총 {total_inserted:,}건 적재 성공.")
    return total_inserted
