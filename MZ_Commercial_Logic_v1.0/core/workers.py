# core/workers.py
import logging
from PySide6.QtCore import QThread, Signal

logger = logging.getLogger(__name__)

class DataSyncWorker(QThread):
    """
    백그라운드에서 데이터를 수집하는 워커 스레드.
    UI 스레드 멈춤 현상(Freezing) 방지를 목적으로 함.
    WHY: PySide6 UI 스레드에서 직접 API 호출 시 앱이 완전 멈춤.
    """
    progress = Signal(int)   # 진행도 (0~100)
    status   = Signal(str)   # 현재 상태 메시지
    finished = Signal(bool)  # 완료 여부 (성공=True / 실패=False)

    def __init__(self, mode="manual"):
        super().__init__()
        self.mode = mode  # 'manual' 또는 'auto'

    def run(self):
        try:
            self.status.emit("수집 엔진 초기화 중...")
            self.progress.emit(5)

            # WHY: 지연 임포트(Lazy Import) — 앱 초기 구동속도 보호
            from core.collectors.main_collector import FullDataCollector
            collector = FullDataCollector()

            self.status.emit("인구 데이터 (행안부) 수집 준비...")
            self.progress.emit(15)

            self.status.emit("상가/블로그/검색 트렌드 통합 수집 시작...")
            self.progress.emit(30)

            # 실제 수집 실행 (지역당 5개 키워드 수집 — API 쿼터 안전 모드)
            # WHY: limit_per_area=5 → 네이버 API 일일 25,000호출 한도 내 안전 유지
            collector.run_all(limit_per_area=5)

            self.status.emit("수집 데이터 DB 반영 중...")
            self.progress.emit(90)

            self.status.emit("✅ 모든 데이터 동기화 완료!")
            self.progress.emit(100)
            self.finished.emit(True)

        except Exception as e:
            logger.error(f"[ERROR] [DataSyncWorker] [run] - 수집 중 오류: {e}")
            self.status.emit(f"❌ 오류 발생: {str(e)[:60]}")
            self.finished.emit(False)

class CsvImportWorker(QThread):
    """
    대용량 CSV 기반 상가 데이터 업로드를 전담하는 워커 스레드.
    완료 시 삽입된 개수 또는 실패 메시지를 리턴합니다.
    """
    status = Signal(str)
    finished = Signal(bool, int, str) # success, insert_count, error_message

    def __init__(self, csv_path):
        super().__init__()
        self.csv_path = csv_path

    def run(self):
        try:
            from core.collectors.csv_importer import import_store_data
            
            def status_update(msg):
                self.status.emit(msg)
                
            inserted_count = import_store_data(self.csv_path, status_callback=status_update)
            self.finished.emit(True, inserted_count, "")
        except Exception as e:
            logger.error(f"CsvImportWorker 오류: {e}")
            self.finished.emit(False, 0, str(e))

