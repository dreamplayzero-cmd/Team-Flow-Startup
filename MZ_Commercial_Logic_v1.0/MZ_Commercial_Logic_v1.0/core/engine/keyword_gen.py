# core/engine/keyword_gen.py
import logging
from config.settings import AREA_MAP

logger = logging.getLogger(__name__)

class KeywordGenerator:
    """지역, 업종, 니즈를 조합하여 분석용 키워드를 자동 생성하는 클래스"""
    
    def __init__(self):
        # WHY: settings.py AREA_MAP 단일 진실 공급원에서 동적 로드 — 지역 추가 시 자동 반영
        self.regions = list(AREA_MAP.keys())
        self.categories = [
            "카페", "디저트", "브런치", "파스타", "고기집",
            "술집", "와인바", "치킨", "분식", "베이커리",
            "버거", "샐러드"
        ]
        self.needs = [
            "맛집", "핫플", "데이트", "분위기", "가성비",
            "조용한", "혼밥", "추천", "신상", "줄서기"
        ]

    def generate(self, limit=300):
        """키워드 조합 생성"""
        keywords = []
        for region in self.regions:
            for category in self.categories:
                for need in self.needs:
                    # '지역 업종 니즈' 형태로 조합
                    keyword = f"{region} {category} {need}"
                    keywords.append({
                        "region": region,
                        "category": category,
                        "need": need,
                        "keyword": keyword
                    })
        
        logger.info(f"Total combinations generated: {len(keywords)}")
        
        # 상위 N개만 반환 (현재는 단순 슬라이싱, 추후 우선순위 로직 추가 가능)
        return keywords[:limit]

if __name__ == "__main__":
    gen = KeywordGenerator()
    kws = gen.generate(limit=10)
    for k in kws:
        print(k['keyword'])
