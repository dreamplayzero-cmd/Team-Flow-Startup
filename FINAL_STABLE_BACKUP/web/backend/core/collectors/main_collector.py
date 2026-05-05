# core/collectors/main_collector.py
import logging
import time
import sys
import random
from pathlib import Path

# 프로젝트 루트를 path에 추가하여 모듈 참조 해결
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from core.collectors.pop_collector import PopulationCollector
from core.collectors.store_collector import StoreCollector
from core.collectors.blog_crawler import BlogCrawler
from core.collectors.naver_collector import NaverCollector
from core.engine.keyword_gen import KeywordGenerator
from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] [%(module)s] - %(message)s')
logger = logging.getLogger(__name__)

class FullDataCollector:
    """안전하고 영리하게(Safe & Smart) 대량의 데이터를 수집하는 마스터 엔진"""
    
    def __init__(self):
        self.db = DatabaseManager()
        self.pop_col = PopulationCollector()
        self.store_col = StoreCollector()
        self.blog_col = BlogCrawler()
        self.naver_col = NaverCollector()
        self.kw_gen = KeywordGenerator()
        
        self.target_areas = [
            (info['code'], info['province'], info['city'], info['district'], name)
            for name, info in AREA_MAP.items()
        ]
        self._init_master_areas()

    def _init_master_areas(self):
        """대상 지역을 마스터 테이블에 선등록 (Foreign Key 제약 해결)"""
        logger.info("Initializing master areas...")
        query = """
        INSERT OR REPLACE INTO master_areas (area_code, area_name, province, city, district)
        VALUES (?, ?, ?, ?, ?)
        """
        data = [(code, area_name, p, c, d) for code, p, c, d, area_name in self.target_areas]
        self.db.execute_many(query, data)

    def run_all(self, limit_per_area=20):
        """
        데이터 일괄 수집 시작
        :param limit_per_area: 각 지역당 수집할 키워드 조합 수 (API 할당량 고려)
        """
        logger.info(f"=== [Safe-Mode] {len(self.target_areas)}개 상권 통합 수집 시작 ===")
        
        # 전체 키워드 생성 및 셔플링
        all_keywords = self.kw_gen.generate(limit=500)
        random.shuffle(all_keywords)
        
        for code, province, city, district, area_name in self.target_areas:
            logger.info(f"\n >>> [{area_name}] 데이터 로딩 중...")
            
            # 1. 인구 데이터 (MZ 인구)
            self.pop_col.collect_by_area(code, "202401")
            
            # 2. 상가 정보 
            self.store_col.collect_by_dong(code)
            
            # 3. 블로그 여론 및 네이버 검색 트렌드 (통합)
            count = 0
            # 키워드 딕셔너리에서 'keyword' 값을 추출하여 필터링
            area_specific_keywords = [kw['keyword'] for kw in all_keywords if area_name in kw['keyword']]
            random.shuffle(area_specific_keywords)
            
            for kw in area_specific_keywords:
                if count >= limit_per_area: break
                
                logger.info(f"   - 키워드 분석 중: {kw}")
                
                # 블로그 크롤링 (차단 주의)
                self.blog_col.collect_trends(code, area_name, kw.replace(area_name, "").strip())
                
                # 네이버 검색 트렌드 (API)
                self.naver_col.get_search_trend(code, kw, [kw, f"{kw} 추천", f"{kw} 핫플"])
                
                count += 1
                
                # [중요] Dynamic Sleep: 1.5 ~ 3.5초 사이 랜덤 대기 (기계적 패턴 회피)
                wait_time = random.uniform(1.5, 3.5)
                time.sleep(wait_time)

        logger.info("\n=== [Safe-Mode] 모든 수집 프로세스가 완료되었습니다 ===")

    def run_pop(self):
        logger.info(f"=== 인구 데이터 단독 수집 시작 ===")
        for code, _, _, _, area_name in self.target_areas:
            logger.info(f"[{area_name}] 인구 데이터 수집 중...")
            self.pop_col.collect_by_area(code, "202401")
        logger.info("=== 인구 데이터 단독 수집 완료 ===")

    def run_store(self):
        logger.info(f"=== 상가 데이터 단독 수집 시작 ===")
        for code, _, _, _, area_name in self.target_areas:
            logger.info(f"[{area_name}] 상가 데이터 수집 중...")
            self.store_col.collect_by_dong(code)
        logger.info("=== 상가 데이터 단독 수집 완료 ===")

    def run_blog(self, limit_per_area=5):
        logger.info(f"=== 블로그 감성 단독 수집 시작 ===")
        all_keywords = self.kw_gen.generate(limit=200)
        for code, _, _, _, area_name in self.target_areas:
            logger.info(f"[{area_name}] 블로그 감성 수집 중...")
            area_kws = [kw['keyword'] for kw in all_keywords if area_name in kw['keyword']]
            random.shuffle(area_kws)
            for kw in area_kws[:limit_per_area]:
                self.blog_col.collect_trends(code, area_name, kw.replace(area_name, "").strip())
                time.sleep(random.uniform(1.0, 2.0))
        logger.info("=== 블로그 감성 단독 수집 완료 ===")

    def run_naver(self, limit_per_area=5):
        logger.info(f"=== 네이버 검색 트렌드 단독 수집 시작 ===")
        all_keywords = self.kw_gen.generate(limit=200)
        for code, _, _, _, area_name in self.target_areas:
            logger.info(f"[{area_name}] 검색 트렌드 수집 중...")
            area_kws = [kw['keyword'] for kw in all_keywords if area_name in kw['keyword']]
            random.shuffle(area_kws)
            for kw in area_kws[:limit_per_area]:
                self.naver_col.get_search_trend(code, kw, [kw, f"{kw} 추천", f"{kw} 핫플"])
                time.sleep(random.uniform(1.0, 2.0))
        logger.info("=== 네이버 검색 트렌드 단독 수집 완료 ===")

if __name__ == "__main__":
    collector = FullDataCollector()
    collector.run_all(limit_per_area=10)
