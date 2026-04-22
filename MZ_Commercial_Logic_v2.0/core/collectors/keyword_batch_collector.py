# core/collectors/keyword_batch_collector.py
"""
WHY: 네이버 DataLab API의 레이트 리밋(분당 호출 수 제한) 때문에
     720개 키워드를 한 번에 수집하는 것은 불가능.
     이 모듈은 다음 전략으로 문제를 해결함:
     1. 키워드를 우선순위별로 청크 분할
     2. 청크 간 딜레이(rate limit 준수)
     3. QThread 기반 백그라운드 실행 (UI 프리징 방지)
     4. 이미 수집된 키워드는 건너뜀 (중복 API 호출 방지)
     5. 진행 상황 실시간 신호(signal) 보고
"""
import logging
import time
from datetime import datetime

from PySide6.QtCore import QThread, Signal
from core.collectors.naver_collector import NaverCollector
from core.engine.keyword_gen import KeywordGenerator
from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

logger = logging.getLogger(__name__)


class KeywordBatchCollector(QThread):
    """
    720개 키워드 조합을 배치 단위로 분산 수집하는 백그라운드 워커
    WHY: QThread 사용 → UI 스레드 차단(Freezing) 없이 장시간 API 호출 가능.
         청크 단위(5개씩) + 딜레이(1.2초)로 API 레이트 리밋 준수.
    """

    # ── Qt 시그널 정의 ──
    # progress: (현재 완료 수, 전체 수, 현재 키워드명)
    progress = Signal(int, int, str)
    # finished: (성공 수, 실패 수, 건너뜀 수)
    finished = Signal(int, int, int)
    # error: 오류 메시지
    error = Signal(str)

    # API 호출 간격 (초): 네이버 DataLab 권장 레이트 리밋 준수
    RATE_LIMIT_DELAY = 1.2

    # 한 번의 배치에서 수집할 최대 키워드 그룹 수
    # (무한 실행 방지: QTimer 12시간 주기로 나눠 수집)
    DEFAULT_CHUNK_SIZE = 20

    def __init__(self, chunk_size=DEFAULT_CHUNK_SIZE, parent=None):
        super().__init__(parent)
        self.chunk_size = chunk_size
        self.naver = NaverCollector()
        self.db = DatabaseManager()
        self._is_running = True

    def stop(self):
        """외부에서 수집 중단 요청"""
        self._is_running = False
        logger.info("[INFO] [keyword_batch_collector] [stop] - 배치 수집 중단 요청")

    def run(self):
        """
        배치 수집 메인 로직
        WHY: 이미 수집된 (area_code, keyword, target_month) 조합은 DB에서
             조회하여 건너뜀 → 불필요한 API 호출 제거
        """
        logger.info("[INFO] [keyword_batch_collector] [run] - 키워드 배치 수집 시작")

        try:
            # 1. 수집 대상 키워드 목록 생성 (우선순위 적용)
            pending_jobs = self._build_priority_queue()
            total = len(pending_jobs)

            if total == 0:
                logger.info("[INFO] [keyword_batch_collector] [run] - 수집할 신규 키워드 없음 (모두 완료)")
                self.finished.emit(0, 0, 0)
                return

            # 2. chunk_size만큼만 이번 배치에서 처리
            batch = pending_jobs[:self.chunk_size]
            success_count = 0
            fail_count = 0
            skip_count = total - len(pending_jobs)  # 이미 건너뛴 수

            logger.info(
                f"[INFO] [keyword_batch_collector] [run] - "
                f"이번 배치: {len(batch)}개 / 전체 대기: {total}개"
            )

            for idx, job in enumerate(batch):
                if not self._is_running:
                    logger.info("[INFO] [keyword_batch_collector] [run] - 사용자 중단 요청으로 종료")
                    break

                area_code = job['area_code']
                area_name = job['area_name']
                category = job['category']
                need = job['need']
                group_name = f"{area_name} {category} {need}"

                # 진행 상황 보고 (UI 업데이트용)
                self.progress.emit(idx + 1, len(batch), group_name)

                # API 호출: 그룹명과 연관 키워드 목록
                keywords = self._build_keyword_variants(area_name, category, need)
                result = self.naver.get_search_trend(area_code, group_name, keywords)

                if result:
                    success_count += 1
                    logger.info(
                        f"[INFO] [keyword_batch_collector] [run] - "
                        f"[{idx+1}/{len(batch)}] ✅ {group_name}"
                    )
                else:
                    fail_count += 1
                    logger.warning(
                        f"[WARNING] [keyword_batch_collector] [run] - "
                        f"[{idx+1}/{len(batch)}] ❌ {group_name}"
                    )

                # 레이트 리밋 준수 (마지막 호출 후에는 딜레이 불필요)
                if idx < len(batch) - 1:
                    time.sleep(self.RATE_LIMIT_DELAY)

            logger.info(
                f"[INFO] [keyword_batch_collector] [run] - "
                f"배치 완료: 성공={success_count}, 실패={fail_count}, 건너뜀={skip_count}"
            )
            self.finished.emit(success_count, fail_count, skip_count)

        except Exception as e:
            logger.error(f"[ERROR] [keyword_batch_collector] [run] - 배치 수집 실패: {e}")
            self.error.emit(str(e))

    def _build_priority_queue(self):
        """
        수집 우선순위가 높은 키워드 조합부터 정렬된 대기열 생성
        WHY: 이미 이번 달에 수집된 키워드는 건너뜀 (중복 API 호출 방지).
             우선순위: MZ 핵심 상권(한남, 성수) × 핵심 업종(카페, 디저트) 먼저.
        """
        gen = KeywordGenerator()
        all_combos = gen.generate(limit=720)  # 전체 720개 조합

        # 이미 수집된 (area_code, keyword, target_month) 조회
        current_month = datetime.now().strftime("%Y-%m")
        collected_query = """
            SELECT area_code, keyword
            FROM keyword_trends
            WHERE target_month LIKE ?
        """
        already_collected = set()
        results = self.db.execute_query(collected_query, (f"{current_month}%",))
        if results:
            for row in results:
                already_collected.add((row['area_code'], row['keyword']))

        # 미수집 항목만 필터링
        pending = []
        for combo in all_combos:
            area_name = combo['region']
            if area_name not in AREA_MAP:
                continue
            area_code = AREA_MAP[area_name]['code']
            group_name = combo['keyword']  # "지역 업종 니즈"

            if (area_code, group_name) not in already_collected:
                pending.append({
                    'area_code': area_code,
                    'area_name': area_name,
                    'category': combo['category'],
                    'need': combo['need'],
                    'group_name': group_name,
                    'priority': self._calc_priority(area_name, combo['category']),
                })

        # 우선순위 내림차순 정렬
        pending.sort(key=lambda x: x['priority'], reverse=True)
        logger.info(
            f"[INFO] [keyword_batch_collector] [_build_priority_queue] - "
            f"수집 대기: {len(pending)}개 / 이미 완료: {len(already_collected)}개"
        )
        return pending

    @staticmethod
    def _calc_priority(area_name, category):
        """
        키워드 수집 우선순위 계산 (높을수록 먼저 수집)
        WHY: 한정된 API 호출 횟수를 핵심 상권 × 핵심 업종에 먼저 소비.
             창업자가 가장 많이 조회하는 조합을 먼저 채워놓음.
        """
        priority = 0
        # 핵심 상권 우선
        priority_areas = {"한남동": 10, "성수동": 10, "이태원": 8, "연남동": 6, "가로수길": 6, "망원동": 4}
        priority += priority_areas.get(area_name, 0)
        # 핵심 업종 우선
        priority_categories = {"카페": 5, "디저트": 5, "브런치": 4, "술집": 4, "와인바": 3}
        priority += priority_categories.get(category, 1)
        return priority

    @staticmethod
    def _build_keyword_variants(area_name, category, need):
        """
        한 그룹에 전달할 키워드 변형 리스트 생성 (최대 5개)
        WHY: DataLab API는 그룹당 최대 20개 키워드 지원.
             동의어/축약어를 함께 보내면 검색량 누락을 줄일 수 있음.
        """
        variants = [
            f"{area_name} {category}",
            f"{area_name} {category} {need}",
        ]
        # 지역명 축약어 추가 (예: 이태원동 → 이태원)
        if len(area_name) > 3:
            variants.append(f"{area_name[:2]} {category}")

        # 니즈 동의어 추가
        need_synonyms = {
            "맛집": ["맛집추천", "맛있는"],
            "핫플": ["핫플레이스", "인스타"],
            "데이트": ["커플", "데이트코스"],
            "가성비": ["저렴한", "합리적인"],
        }
        if need in need_synonyms:
            variants.extend(need_synonyms[need])

        return variants[:5]  # 최대 5개로 제한


def get_collection_status(db=None):
    """
    현재 키워드 수집 진행 현황 조회 (관리자 대시보드용)
    :return: dict {total_target, collected, pending, coverage_pct}
    """
    if db is None:
        db = DatabaseManager()

    gen = KeywordGenerator()
    total_target = len(gen.generate(limit=720))

    current_month = datetime.now().strftime("%Y-%m")
    result = db.execute_query(
        "SELECT COUNT(DISTINCT keyword || area_code) as cnt FROM keyword_trends WHERE target_month LIKE ?",
        (f"{current_month}%",)
    )
    collected = result[0]['cnt'] if result and result[0]['cnt'] else 0

    return {
        "total_target": total_target,
        "collected": collected,
        "pending": max(0, total_target - collected),
        "coverage_pct": round(collected / total_target * 100, 1) if total_target > 0 else 0,
    }
