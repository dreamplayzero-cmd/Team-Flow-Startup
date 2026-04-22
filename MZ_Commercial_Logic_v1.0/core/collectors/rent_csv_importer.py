# core/collectors/rent_csv_importer.py
"""
임대료 데이터 수동 CSV 적재 모듈 (B방식 — 추천 방식)
WHY: 한국부동산원 상업용부동산 임대동향조사 API는
     '구 단위' 평균값만 제공하며, area_code 매핑 작업이 복잡함.
     수동 CSV 방식은:
     1. 한국부동산원 R-ONE 또는 서울시 우리마을가게 통계에서
        상권별 임대료 엑셀/CSV를 다운로드
     2. 지정된 형식으로 저장
     3. 이 모듈로 DB 이식
     → 데이터 정확도 최고, 준비 시간 15분 내외

[사용 CSV 형식] — 관리자가 만들어서 업로드하는 형식
컬럼: area_name, floor_type, avg_rent_10k, avg_deposit_10k, vacancy_rate, reference_quarter
예시: 한남동,1F,450,3000,0.05,2025Q4
"""
import os
import logging
import pandas as pd
from datetime import datetime
from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

logger = logging.getLogger(__name__)

# ── 기본 임대료 추정치 (데이터 없을 때 Fallback)
# WHY: 한국부동산원 2024년 기준 주요 상권 평균 1층 임대료 (전용 33㎡)
RENT_ESTIMATES_FALLBACK = {
    "한남동":   {"avg_rent_10k": 480, "avg_deposit_10k": 5000, "vacancy_rate": 0.04, "source": "ESTIMATE"},
    "이태원":   {"avg_rent_10k": 350, "avg_deposit_10k": 3500, "vacancy_rate": 0.08, "source": "ESTIMATE"},
    "성수동":   {"avg_rent_10k": 420, "avg_deposit_10k": 4000, "vacancy_rate": 0.05, "source": "ESTIMATE"},
    "연남동":   {"avg_rent_10k": 280, "avg_deposit_10k": 2500, "vacancy_rate": 0.06, "source": "ESTIMATE"},
    "망원동":   {"avg_rent_10k": 220, "avg_deposit_10k": 2000, "vacancy_rate": 0.07, "source": "ESTIMATE"},
    "가로수길": {"avg_rent_10k": 510, "avg_deposit_10k": 5500, "vacancy_rate": 0.09, "source": "ESTIMATE"},
    "샤로수길": {"avg_rent_10k": 180, "avg_deposit_10k": 1500, "vacancy_rate": 0.10, "source": "ESTIMATE"},
}


def import_rent_from_csv(csv_path: str, status_callback=None) -> int:
    """
    임대료 CSV 파일을 읽어 area_rent_info 테이블에 적재
    :param csv_path: CSV 파일 경로
    :param status_callback: 진행 상황 콜백 함수
    :return: 적재된 행 수
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {csv_path}")

    db = DatabaseManager()

    if status_callback:
        status_callback("임대료 CSV 파일 로딩 중...")

    # 인코딩 자동 감지
    try:
        df = pd.read_csv(csv_path, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding='cp949')

    # 필수 컬럼 검증
    required_cols = {'area_name', 'avg_rent_10k'}
    if not required_cols.issubset(set(df.columns)):
        raise ValueError(
            f"필수 컬럼 부족: {required_cols - set(df.columns)}\n"
            f"CSV 형식: area_name, floor_type, avg_rent_10k, avg_deposit_10k, vacancy_rate, reference_quarter"
        )

    # area_name → area_code 매핑
    area_name_to_code = {name: info['code'] for name, info in AREA_MAP.items()}

    insert_query = """
    INSERT OR REPLACE INTO area_rent_info
        (area_code, area_name, floor_type, avg_rent_10k, avg_deposit_10k,
         vacancy_rate, source, reference_quarter, is_mock, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    records = []
    skipped = []
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for _, row in df.iterrows():
        area_name = str(row.get('area_name', '')).strip()
        area_code = area_name_to_code.get(area_name)

        if not area_code:
            skipped.append(area_name)
            continue

        records.append((
            area_code,
            area_name,
            str(row.get('floor_type', '1F')),
            int(row.get('avg_rent_10k', 0)),
            int(row.get('avg_deposit_10k', 0)),
            float(row.get('vacancy_rate', 0.0)),
            'MANUAL',   # 수동 CSV 업로드 출처
            str(row.get('reference_quarter', '')),
            0,          # is_mock=0 (실제 데이터)
            now_str,
        ))

    if skipped:
        logger.warning(
            f"[WARNING] [rent_csv_importer] - "
            f"매핑 실패 지역 {len(skipped)}개: {skipped}"
        )

    if records:
        success = db.execute_many(insert_query, records)
        if status_callback:
            status_callback(f"임대료 데이터 {len(records)}건 DB 적재 완료!")
        logger.info(
            f"[INFO] [rent_csv_importer] - "
            f"임대료 CSV 적재 완료: {len(records)}건 (건너뜀: {len(skipped)}건)"
        )
        return len(records) if success else 0

    raise ValueError("적재할 유효한 데이터가 없습니다.")


def seed_rent_estimates(status_callback=None) -> int:
    """
    CSV 없이 내장 추정치(RENT_ESTIMATES_FALLBACK)로 임대료 DB를 초기화
    WHY: 관리자가 CSV를 아직 준비하지 않은 초기 상태에서도
         자본금 vs 임대료 비교 로직이 동작하도록 기본값 시드.
         is_mock=1로 마킹되어 사용자에게 '추정치' 표시됨.
    :return: 적재된 행 수
    """
    db = DatabaseManager()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    insert_query = """
    INSERT OR IGNORE INTO area_rent_info
        (area_code, area_name, floor_type, avg_rent_10k, avg_deposit_10k,
         vacancy_rate, source, reference_quarter, is_mock, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    records = []
    for area_name, info in AREA_MAP.items():
        estimate = RENT_ESTIMATES_FALLBACK.get(area_name)
        if not estimate:
            continue
        records.append((
            info['code'],
            area_name,
            '1F',
            estimate['avg_rent_10k'],
            estimate['avg_deposit_10k'],
            estimate['vacancy_rate'],
            estimate['source'],   # 'ESTIMATE'
            '2024Q4',             # 추정 기준 분기
            1,                    # is_mock=1 (추정치)
            now_str,
        ))

    if records:
        db.execute_many(insert_query, records)
        if status_callback:
            status_callback(f"기본 임대료 추정치 {len(records)}개 지역 초기화 완료")
        logger.info(
            f"[INFO] [rent_csv_importer] [seed_rent_estimates] - "
            f"임대료 추정치 시드 완료: {len(records)}건 (is_mock=1)"
        )
        return len(records)
    return 0
