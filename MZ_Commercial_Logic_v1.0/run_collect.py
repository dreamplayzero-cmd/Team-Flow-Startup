import sys
import logging
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

# logs 디렉토리 자동 생성 (WHY: FileHandler 실패 방지)
Path("logs").mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('logs/collect.log', encoding='utf-8', mode='a')
    ]
)
logger = logging.getLogger(__name__)

from config.settings import AREA_MAP

def run():
    logger.info("=" * 60)
    logger.info("  MZ 상권분석 데이터 수집 시작")
    logger.info(f"  대상 지역 수: {len(AREA_MAP)}개")
    logger.info("=" * 60)

    # --- 1. 행안부 인구 데이터 수집 ---
    logger.info("\n[1/4] 행안부 인구 데이터 수집 중...")
    from core.collectors.pop_collector import PopulationCollector
    pop = PopulationCollector()
    pop_ok = 0
    for area_name, info in AREA_MAP.items():
        code = info['code']
        success = pop.collect_by_area(code)
        logger.info(f"  [{'OK' if success else 'FALLBACK'}] {area_name} ({code})")
        if success:
            pop_ok += 1
    logger.info(f"  => 인구 수집 완료: {pop_ok}/{len(AREA_MAP)}개")

    # --- 2. 네이버 검색 트렌드 수집 ---
    logger.info("\n[2/4] 네이버 검색 트렌드 수집 중...")
    from core.collectors.naver_collector import NaverCollector
    naver = NaverCollector()
    naver_ok = 0
    for area_name, info in AREA_MAP.items():
        code = info['code']
        keywords = [
            f"{area_name} 카페", f"{area_name} 맛집",
            f"{area_name} 핫플", f"{area_name} 음식점", f"{area_name} 분위기",
        ]
        try:
            # WHY: get_search_trend(area_code, group_name, keywords)
            result = naver.get_search_trend(code, f"{area_name} 트렌드", keywords)
            status = "OK" if result else "FALLBACK"
        except Exception as e:
            logger.warning(f"  [WARN] {area_name}: {e}")
            status = "ERROR"
        logger.info(f"  [{status}] {area_name} ({code})")
        if status == "OK":
            naver_ok += 1
    logger.info(f"  => 트렌드 수집 완료: {naver_ok}/{len(AREA_MAP)}개")

    # --- 3. 블로그 감성 분석 (기존 4번) ---
    logger.info("\n[3/3] 블로그 감성 데이터 수집 중...")
    from core.collectors.blog_crawler import BlogCrawler
    blog = BlogCrawler()
    blog_ok = 0
    for area_name, info in AREA_MAP.items():
        code = info['code']
        try:
            # WHY: collect_trends(area_code, area_name, keyword_suffix)
            success = blog.collect_trends(code, area_name, "맛집")
            status = "OK" if success else "FALLBACK"
        except Exception as e:
            logger.warning(f"  [WARN] {area_name}: {e}")
            status = "ERROR"
        logger.info(f"  [{status}] {area_name} ({code})")
        if status == "OK":
            blog_ok += 1
    logger.info(f"  => 블로그 수집 완료: {blog_ok}/{len(AREA_MAP)}개")

    # --- 최종 요약 ---
    logger.info("\n" + "=" * 60)
    logger.info("  자동 수집 완료 (상가 데이터는 수동 CSV 임포트 필요)")
    logger.info(f"  인구     : {pop_ok}/{len(AREA_MAP)}")
    logger.info(f"  트렌드   : {naver_ok}/{len(AREA_MAP)}")
    logger.info(f"  블로그   : {blog_ok}/{len(AREA_MAP)}")
    logger.info("  logs/collect.log 에서 상세 로그 확인 가능")
    logger.info("=" * 60)

if __name__ == "__main__":
    run()
