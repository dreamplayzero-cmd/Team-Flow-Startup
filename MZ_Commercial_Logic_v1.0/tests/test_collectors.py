# tests/test_collectors.py
import sys
from pathlib import Path
import logging

# 프로젝트 루트를 path에 추가
sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

from core.collectors.pop_collector import PopulationCollector
from core.collectors.store_collector import StoreCollector
from core.collectors.blog_crawler import BlogCrawler
from core.collectors.naver_collector import NaverCollector
from data.db_manager import DatabaseManager

# 로깅 설정
logging.basicConfig(level=logging.ERROR) # 상세 로그는 무시하고 요약만 출력
logger = logging.getLogger(__name__)

def run_integration_test():
    print("\n" + "="*50)
    print("      MZ Commercial Area App Integration Test")
    print("="*50)
    
    TEST_ADONG_CD = "1120067000" 
    TEST_AREA_NAME = "성수동"
    
    db = DatabaseManager()
    
    # Master Area 등록
    db.execute_query(
        "INSERT OR REPLACE INTO master_areas (area_code, area_name, province, city, district) VALUES (?, ?, ?, ?, ?)",
        (TEST_ADONG_CD, TEST_AREA_NAME, "서울특별시", "성동구", TEST_AREA_NAME)
    )

    results = {}

    # 2. 행안부 인구 데이터 테스트
    print(f"\n[1/4] Collecting Population Data... (Code: {TEST_ADONG_CD})")
    pop_collector = PopulationCollector()
    results['Population'] = pop_collector.collect_by_area(TEST_ADONG_CD, "202401")

    # 3. 소상공인 상가 정보 테스트
    print(f"[2/4] Collecting Store Info...")
    store_collector = StoreCollector()
    results['StoreInfo'] = store_collector.collect_by_dong(TEST_ADONG_CD)

    # 4. 블로그 크롤러 테스트
    print(f"[3/4] Crawling Blog Trends... (Area: {TEST_AREA_NAME})")
    blog_crawler = BlogCrawler()
    results['BlogTrend'] = blog_crawler.collect_trends(TEST_ADONG_CD, TEST_AREA_NAME, "맛집")

    # 5. 네이버 검색 API 테스트
    print(f"[4/4] Collecting Naver Search Trends...")
    naver_collector = NaverCollector()
    results['SearchTrend'] = naver_collector.get_search_trend(
        TEST_ADONG_CD,
        f"{TEST_AREA_NAME} 카페",
        [f"{TEST_AREA_NAME} 카페", f"{TEST_AREA_NAME} 핫플"]
    )

    # 6. 결과 요약
    print("\n" + "="*50)
    print("                SUMMARY REPORT")
    print("="*50)
    for name, success in results.items():
        status = "[SUCCESS]" if success else "[FAILED]"
        print(f" - {name.ljust(15)} : {status}")
    
    print("\n--- DB Storage Status ---")
    tables = {
        "population_data": "Population",
        "store_info": "Store",
        "blog_analysis": "Blog",
        "keyword_trends": "Search"
    }
    
    for table, label in tables.items():
        count_data = db.execute_query(f"SELECT COUNT(*) as cnt FROM {table}")
        count = count_data[0]['cnt'] if count_data else 0
        print(f" * {label.ljust(12)} : {count} rows")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_integration_test()
