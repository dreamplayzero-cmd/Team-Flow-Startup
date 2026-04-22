# core/workers.py
"""
백그라운드 QThread 워커 모음 (v2 — 4대 데이터 소스 독립 워커)

WHY: 기존 DataSyncWorker는 4개 수집을 하나의 스레드에서 순차 실행했음.
     한 소스가 실패하면 나머지도 멈추는 문제가 있었음.
     개선: 각 데이터 소스마다 독립 워커로 분리하여
     개별 실행/재시도/상태 추적이 가능하도록 설계.

워커 목록:
 - DataSyncWorker       : 4대 전체 API 자동 수집 (기존 호환)
 - PopCsvImportWorker   : 인구 데이터 CSV 수동 적재
 - StoreCsvImportWorker : 상가 데이터 CSV 수동 적재 (기존 CsvImportWorker 대체)
 - BlogCsvImportWorker  : 블로그 분석 CSV 수동 적재
 - NaverCsvImportWorker : 검색 트렌드 CSV 수동 적재
 - RentCsvImportWorker  : 임대료 CSV 수동 적재 (신규)
 - RentSeedWorker       : 임대료 기본 추정치 시드 (신규)
"""
import logging
from PySide6.QtCore import QThread, Signal

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# [1] 4대 데이터 API 자동 수집 워커
# ─────────────────────────────────────────────
class DataSyncWorker(QThread):
    """
    백그라운드에서 4대 데이터를 자동 수집하는 통합 워커 스레드.
    WHY: PySide6 UI 스레드에서 직접 API 호출 시 앱이 완전 멈춤(Freezing) 발생.
    """
    progress = Signal(int)   # 진행도 (0~100)
    status   = Signal(str)   # 현재 상태 메시지
    finished = Signal(bool)  # 완료 여부

    def __init__(self, mode="manual"):
        super().__init__()
        self.mode = mode

    def run(self):
        try:
            self.status.emit("수집 엔진 초기화 중...")
            self.progress.emit(5)

            # WHY: 지연 임포트(Lazy Import) — 앱 초기 구동 속도 보호
            from core.collectors.main_collector import FullDataCollector
            collector = FullDataCollector()

            self.status.emit("[1/4] 인구 데이터 (행안부 API) 수집 중...")
            self.progress.emit(20)

            self.status.emit("[2/4] 상가 데이터 수집 시도 중... (Fallback 대기)")
            self.progress.emit(40)

            self.status.emit("[3/4] 블로그 감성 & [4/4] 네이버 검색 트렌드 수집 중...")
            self.progress.emit(60)

            # 실제 수집 실행 (지역당 5개 키워드 — API 쿼터 안전 모드)
            collector.run_all(limit_per_area=5)

            self.status.emit("수집 데이터 DB 반영 완료")
            self.progress.emit(100)
            self.finished.emit(True)

        except Exception as e:
            logger.error(f"[ERROR] [DataSyncWorker] [run] - 수집 중 오류: {e}")
            self.status.emit(f"❌ 오류: {str(e)[:80]}")
            self.finished.emit(False)


# ─────────────────────────────────────────────
# [1-1] 개별 API 수집 워커들
# ─────────────────────────────────────────────
class PopApiWorker(QThread):
    status = Signal(str)
    finished = Signal(bool, int, str)
    def run(self):
        try:
            from core.collectors.main_collector import FullDataCollector
            self.status.emit("행안부 인구 API 수집 중...")
            FullDataCollector().run_pop()
            self.finished.emit(True, 0, "")
        except Exception as e:
            self.finished.emit(False, 0, str(e))

class StoreApiWorker(QThread):
    status = Signal(str)
    finished = Signal(bool, int, str)
    def run(self):
        try:
            from core.collectors.main_collector import FullDataCollector
            self.status.emit("소상공인 상가 API 수집 중...")
            FullDataCollector().run_store()
            self.finished.emit(True, 0, "")
        except Exception as e:
            self.finished.emit(False, 0, str(e))

class BlogApiWorker(QThread):
    status = Signal(str)
    finished = Signal(bool, int, str)
    def run(self):
        try:
            from core.collectors.main_collector import FullDataCollector
            self.status.emit("네이버 블로그 API 수집 중...")
            FullDataCollector().run_blog(limit_per_area=5)
            self.finished.emit(True, 0, "")
        except Exception as e:
            self.finished.emit(False, 0, str(e))

class NaverApiWorker(QThread):
    status = Signal(str)
    finished = Signal(bool, int, str)
    def run(self):
        try:
            from core.collectors.main_collector import FullDataCollector
            self.status.emit("네이버 DataLab API 수집 중...")
            FullDataCollector().run_naver(limit_per_area=5)
            self.finished.emit(True, 0, "")
        except Exception as e:
            self.finished.emit(False, 0, str(e))

# ─────────────────────────────────────────────
# [2] 상가 데이터 CSV 수동 적재 워커 (기존 CsvImportWorker 대체)
# ─────────────────────────────────────────────
class StoreCsvImportWorker(QThread):
    """
    소상공인진흥공단 상가 CSV → DB 적재 전담 워커.
    WHY: 290MB 대용량 CSV 처리는 UI 스레드에서 실행 불가.
         QThread로 백그라운드 처리.
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)  # success, insert_count, error_msg

    def __init__(self, csv_path: str):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            from core.collectors.store_csv_importer import import_store_data
            inserted = import_store_data(
                self.csv_path,
                status_callback=lambda msg: self.status.emit(msg)
            )
            self.finished.emit(True, inserted, "")
        except Exception as e:
            logger.error(f"[ERROR] [StoreCsvImportWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))


# 기존 코드 호환성 유지 (CsvImportWorker → StoreCsvImportWorker 별칭)
CsvImportWorker = StoreCsvImportWorker


# ─────────────────────────────────────────────
# [3] 인구 데이터 CSV 수동 적재 워커
# ─────────────────────────────────────────────
class PopCsvImportWorker(QThread):
    """
    인구 데이터 CSV → DB 적재 워커.
    WHY: 행안부 API가 정상이지만, 오프라인 환경이나
         과거 특정 기간 데이터가 필요할 때 CSV로 보완 가능.

    [CSV 형식]
    컬럼: area_name, age_group, population_count, reference_date
    예시: 한남동,MZ,45000,2025-02-01
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)

    def __init__(self, csv_path: str):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            import os
            import pandas as pd
            from data.db_manager import DatabaseManager
            from config.settings import AREA_MAP

            if not os.path.exists(self.csv_path):
                raise FileNotFoundError(f"파일 없음: {self.csv_path}")

            self.status.emit("인구 CSV 파일 로딩 중...")
            try:
                df = pd.read_csv(self.csv_path, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(self.csv_path, encoding='cp949')

            required = {'area_name', 'population_count'}
            if not required.issubset(set(df.columns)):
                raise ValueError(f"필수 컬럼 부족: {required - set(df.columns)}")

            db = DatabaseManager()
            area_map = {name: info['code'] for name, info in AREA_MAP.items()}

            insert_q = """
            INSERT OR IGNORE INTO population_data
                (area_code, age_group, population_count, reference_date, is_mock, data_quality)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            records = []
            for _, row in df.iterrows():
                code = area_map.get(str(row.get('area_name', '')).strip())
                if not code:
                    continue
                records.append((
                    code,
                    str(row.get('age_group', 'MZ')),
                    int(row.get('population_count', 0)),
                    str(row.get('reference_date', '2025-01-01')),
                    0,       # is_mock=0
                    'HIGH',  # data_quality='HIGH'
                ))

            if records:
                db.execute_many(insert_q, records)
                self.status.emit(f"인구 데이터 {len(records)}건 적재 완료")
                self.finished.emit(True, len(records), "")
            else:
                raise ValueError("적재 가능한 인구 데이터가 없습니다.")

        except Exception as e:
            logger.error(f"[ERROR] [PopCsvImportWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))


# ─────────────────────────────────────────────
# [4] 블로그 분석 CSV 수동 적재 워커
# ─────────────────────────────────────────────
class BlogCsvImportWorker(QThread):
    """
    블로그 감성 분석 결과 CSV → DB 적재 워커.
    WHY: 네이버 API 한도 초과 또는 수동 분석 결과를 직접 이식할 때 사용.

    [CSV 형식]
    컬럼: area_name, keyword, mention_count, sentiment_score, analysis_date
    예시: 성수동,성수동 카페 맛집,1200,0.78,2025-04-01
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)

    def __init__(self, csv_path: str):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            import os
            import pandas as pd
            from data.db_manager import DatabaseManager
            from config.settings import AREA_MAP

            if not os.path.exists(self.csv_path):
                raise FileNotFoundError(f"파일 없음: {self.csv_path}")

            self.status.emit("블로그 분석 CSV 로딩 중...")
            try:
                df = pd.read_csv(self.csv_path, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(self.csv_path, encoding='cp949')

            required = {'area_name', 'keyword', 'sentiment_score'}
            if not required.issubset(set(df.columns)):
                raise ValueError(f"필수 컬럼 부족: {required - set(df.columns)}")

            db = DatabaseManager()
            area_map = {name: info['code'] for name, info in AREA_MAP.items()}

            insert_q = """
            INSERT OR REPLACE INTO blog_analysis
                (area_code, keyword, mention_count, sentiment_score,
                 positive_count, negative_count, analysis_date, is_mock, data_quality)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            records = []
            from datetime import datetime
            today = datetime.now().strftime("%Y-%m-%d")

            for _, row in df.iterrows():
                code = area_map.get(str(row.get('area_name', '')).strip())
                if not code:
                    continue
                records.append((
                    code,
                    str(row.get('keyword', '')),
                    int(row.get('mention_count', 0)),
                    float(row.get('sentiment_score', 0.5)),
                    int(row.get('positive_count', 0)),
                    int(row.get('negative_count', 0)),
                    str(row.get('analysis_date', today)),
                    0,       # is_mock=0
                    'HIGH',
                ))

            if records:
                db.execute_many(insert_q, records)
                self.status.emit(f"블로그 분석 {len(records)}건 적재 완료")
                self.finished.emit(True, len(records), "")
            else:
                raise ValueError("적재 가능한 블로그 데이터가 없습니다.")

        except Exception as e:
            logger.error(f"[ERROR] [BlogCsvImportWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))


# ─────────────────────────────────────────────
# [5] 검색 트렌드 CSV 수동 적재 워커
# ─────────────────────────────────────────────
class NaverCsvImportWorker(QThread):
    """
    네이버 검색 트렌드 결과 CSV → DB 적재 워커.
    WHY: 네이버 DataLab API 한도 초과 시 수동으로 수집한 데이터를 이식.

    [CSV 형식]
    컬럼: area_name, keyword, avg_ratio, growth_rate, target_month
    예시: 한남동,한남동 카페 핫플,72.5,8.3,2025-04-01
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)

    def __init__(self, csv_path: str):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            import os
            import pandas as pd
            from data.db_manager import DatabaseManager
            from config.settings import AREA_MAP
            from datetime import datetime

            if not os.path.exists(self.csv_path):
                raise FileNotFoundError(f"파일 없음: {self.csv_path}")

            self.status.emit("검색 트렌드 CSV 로딩 중...")
            try:
                df = pd.read_csv(self.csv_path, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(self.csv_path, encoding='cp949')

            required = {'area_name', 'keyword', 'avg_ratio'}
            if not required.issubset(set(df.columns)):
                raise ValueError(f"필수 컬럼 부족: {required - set(df.columns)}")

            db = DatabaseManager()
            area_map = {name: info['code'] for name, info in AREA_MAP.items()}
            today = datetime.now().strftime("%Y-%m-%d")

            insert_q = """
            INSERT OR REPLACE INTO keyword_trends
                (area_code, keyword, search_volume, avg_ratio, growth_rate,
                 search_platform, target_month, is_mock, data_quality)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            records = []
            for _, row in df.iterrows():
                code = area_map.get(str(row.get('area_name', '')).strip())
                if not code:
                    continue
                avg_ratio = float(row.get('avg_ratio', 0))
                records.append((
                    code,
                    str(row.get('keyword', '')),
                    avg_ratio,
                    avg_ratio,
                    float(row.get('growth_rate', 0.0)),
                    'Naver',
                    str(row.get('target_month', today)),
                    0,
                    'HIGH',
                ))

            if records:
                db.execute_many(insert_q, records)
                self.status.emit(f"검색 트렌드 {len(records)}건 적재 완료")
                self.finished.emit(True, len(records), "")
            else:
                raise ValueError("적재 가능한 트렌드 데이터가 없습니다.")

        except Exception as e:
            logger.error(f"[ERROR] [NaverCsvImportWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))


# ─────────────────────────────────────────────
# [6] 임대료 CSV 수동 적재 워커 (신규)
# ─────────────────────────────────────────────
class RentCsvImportWorker(QThread):
    """
    임대료 CSV → area_rent_info DB 적재 워커.
    WHY: 한국부동산원 또는 서울시 임대료 데이터를
         수동으로 다운로드해 DB에 이식하는 B방식 구현.
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)

    def __init__(self, csv_path: str):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            from core.collectors.rent_csv_importer import import_rent_from_csv
            inserted = import_rent_from_csv(
                self.csv_path,
                status_callback=lambda msg: self.status.emit(msg)
            )
            self.finished.emit(True, inserted, "")
        except Exception as e:
            logger.error(f"[ERROR] [RentCsvImportWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))


# ─────────────────────────────────────────────
# [7] 임대료 기본 추정치 시드 워커 (신규)
# ─────────────────────────────────────────────
class RentSeedWorker(QThread):
    """
    CSV 없이 내장 추정치로 임대료 DB를 초기화하는 워커.
    WHY: 관리자가 임대료 CSV를 아직 준비 못 했을 때도
         자본금 vs 임대료 비교 로직이 동작하게 해주는 안전망.
    """
    status   = Signal(str)
    finished = Signal(bool, int, str)

    def run(self):
        try:
            from core.collectors.rent_csv_importer import seed_rent_estimates
            count = seed_rent_estimates(
                status_callback=lambda msg: self.status.emit(msg)
            )
            self.finished.emit(True, count, "")
        except Exception as e:
            logger.error(f"[ERROR] [RentSeedWorker] [run] - {e}")
            self.finished.emit(False, 0, str(e))
