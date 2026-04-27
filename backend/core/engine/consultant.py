import logging
import random
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SentimentConsultant:
    """MZ 감성 및 청년 창업가 정신을 기반으로 한 미래 상권 예측 모델"""

    @staticmethod
    def predict_future(area_name: str, scores: Dict[str, Any]) -> Dict[str, Any]:
        """
        현재 스코어를 기반으로 1년 및 3년 후의 미래 상권 상태를 예측합니다.
        
        [로직 기준]
        - MZ Sentiment (trend_score): 70점 이상일수록 바이럴 수명이 길고 고감성 유지.
        - Entrepreneur Vibe (pop_score + demand_score): 유동인구와 검색량이 받쳐줄수록 안정적 성장.
        - Rent Risk (competition_score): 경쟁이 심화될수록 임대료 상승 압박 및 젠트리피케이션 가속화.
        """
        trend = scores.get('trend_score', 50)
        pop = scores.get('pop_score', 50)
        demand = scores.get('demand_score', 50)
        comp = scores.get('competition_score', 50)
        
        # 상권 이동 예측 지수 (Standardized index)
        move_index = (trend * 0.7 + demand * 0.3) 
        scores['move_index'] = round(move_index, 1)
        
        # 현재 상태 진단
        prediction_current = SentimentConsultant._generate_current_prediction(area_name, trend, pop, demand, comp)
        
        # 1년 후 예측
        prediction_1yr = SentimentConsultant._generate_1yr_prediction(area_name, trend, pop, demand, comp)
        
        # 3년 후 예측
        prediction_3yr = SentimentConsultant._generate_3yr_prediction(area_name, trend, pop, demand, comp)
        
        return {
            "prediction_current": prediction_current,
            "prediction_1yr": prediction_1yr,
            "prediction_3yr": prediction_3yr
        }

    @staticmethod
    def _generate_current_prediction(area_name, trend, pop, demand, comp):
        current_index = (trend * 0.4 + pop * 0.3 + demand * 0.3)
        if current_index > 75:
            state = "핫플레이스 절정기"
            comment = f"현재 {area_name}은 MZ세대의 핵심 목적지입니다. SNS 해시태그 확산이 빠르며 유동인구 밀집도가 최고조에 달해 있습니다."
        elif current_index > 50:
            state = "성장하는 신흥 상권"
            comment = f"최근 {area_name}에 새로운 매장들이 유입되며 검색량이 꾸준히 증가하고 있습니다. 감성형 창업자들의 선점 효과가 좋습니다."
        else:
            state = "상권 정체기"
            comment = f"현재 {area_name}은 다소 소외되어 있으며 기존 고객층 중심으로 소비가 일어나는 폐쇄적 상권입니다."
            
        return {
            "state": state,
            "comment": comment,
            "image_prompt": f"current trendy street in {area_name}, sunny day, young adults walking",
            "index": round(current_index, 1)
        }

    @staticmethod
    def _generate_1yr_prediction(area_name, trend, pop, demand, comp):
        # 1년 후는 현재 트렌드의 단기 연장 및 경쟁 심화 정도
        short_term_vibe = (trend * 0.5 + demand * 0.3 - (comp - 50) * 0.2)
        
        if short_term_vibe > 70:
            state = "수익 극대화 구간"
            comment = f"1년 뒤 {area_name}은 경쟁이 적절히 유지되면서 매출이 극대화되는 황금기를 맞이할 것입니다. 상권 확장이 주변 골목으로 이어집니다."
        elif short_term_vibe > 40:
            state = "경쟁 심화 시작"
            comment = f"트렌드에 편승한 유사 매장이 1년 내 다수 진입하여 경쟁 강도가 높아질 것입니다. 차별화된 시그니처 메뉴가 생존 필수 요건입니다."
        else:
            state = "초기 젠트리피케이션"
            comment = f"임대료 상승 대비 유입 인구 증가폭이 둔화되어 단기적인 수익성 악화가 우려됩니다. 고정비 최소화 전략이 필요합니다."

        return {
            "state": state,
            "comment": comment,
            "image_prompt": f"modern cafe street in {area_name}, minimal design, plants and wood textures, young crowd",
            "vibe_index": round(short_term_vibe, 1)
        }

    @staticmethod
    def _generate_3yr_prediction(area_name, trend, pop, demand, comp):
        # 3년 후 젠트리피케이션 지수 계산 (트렌드와 수요가 높고 경쟁이 심할수록 가속)
        gent_index = (trend * 0.4 + demand * 0.3 + (100 - comp) * 0.3)
        
        if gent_index > 75:
            state = "성숙기 - 감성 프리미엄 정점"
            comment = f"3년 후 {area_name}은 MZ세대의 감성 성지로 완전히 자리잡으며 임대료가 가파르게 상승할 것으로 보입니다. 독창적인 브랜딩이 거대 자본과 경쟁하게 되는 시기입니다."
            image_prompt = f"futuristic trendy glass storefront in {area_name}, bustling with stylish Gen Z, golden hour lighting"
        elif gent_index > 50:
            state = "글로벌 랜드마크화"
            comment = f"지역 상권을 넘어 전 세계가 주목하는 K-감성의 중심지가 됩니다. 안정된 생태계를 구축하며 지속 가능한 창업 환경이 조성됩니다."
            image_prompt = f"high-tech futuristic commercial district in {area_name}, neon signs and green architecture, professional tech-savvy crowd"
        else:
            state = "뉴 패러다임 전환기"
            comment = f"감성 소비가 한 차례 휩쓸고 간 뒤, 실질적인 맛과 서비스라는 본질이 더 중요해집니다. 상권의 주도권이 새로운 비즈니스 모델로 이동할 가능성이 있습니다."
            image_prompt = f"cozy classic shop in {area_name}, warm interior, focus on craft and quality"

        return {
            "state": state,
            "comment": comment,
            "image_prompt": image_prompt,
            "gent_index": round(gent_index, 1)
        }
