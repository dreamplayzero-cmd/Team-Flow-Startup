import logging
import random
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SentimentConsultant:
    """MZ 감성 및 청년 창업가 정신을 기반으로 한 미래 상권 예측 모델"""

    @staticmethod
    def predict_future(area_name: str, scores: Dict[str, Any]) -> Dict[str, Any]:
        """
        현재 스코어를 기반으로 3년 및 5년 후의 미래 상권 상태를 예측합니다.
        
        [로직 기준]
        - MZ Sentiment (trend_score): 70점 이상일수록 바이럴 수명이 길고 고감성 유지.
        - Entrepreneur Vibe (pop_score + demand_score): 유동인구와 검색량이 받쳐줄수록 안정적 성장.
        - Rent Risk (competition_score): 경쟁이 심화될수록 임대료 상승 압박 및 젠트리피케이션 가속화.
        """
        trend = scores.get('trend_score', 50)
        pop = scores.get('pop_score', 50)
        demand = scores.get('demand_score', 50)
        comp = scores.get('competition_score', 50)
        
        # [GIS 1탄] SNS 밀도 전이 데이터 기반 표준화 로직
        # 상권 이동 예측 지수 (Standardized index)
        # SNS 데이터와 수요 데이터를 7:3 비율로 결합하여 밀도 전이량 산출
        move_index = (trend * 0.7 + demand * 0.3) 
        scores['move_index'] = round(move_index, 1)
        
        # 3년 후 예측
        prediction_3yr = SentimentConsultant._generate_3yr_prediction(area_name, trend, pop, demand, comp)
        
        # 5년 후 예측
        prediction_5yr = SentimentConsultant._generate_5yr_prediction(area_name, trend, pop, demand, comp)
        
        # 10년 후 예측 (추가)
        prediction_10yr = SentimentConsultant._generate_10yr_prediction(area_name, trend, pop, demand, comp)
        
        return {
            "prediction_3yr": prediction_3yr,
            "prediction_5yr": prediction_5yr,
            "prediction_10yr": prediction_10yr
        }

    @staticmethod
    def _generate_3yr_prediction(area_name, trend, pop, demand, comp):
        # 젠트리피케이션 지수 계산 (트렌드와 수요가 높고 경쟁이 심할수록 가속)
        gent_index = (trend * 0.4 + demand * 0.3 + (100 - comp) * 0.3)
        
        if gent_index > 75:
            state = "성숙기 - 감성 프리미엄 정점"
            comment = f"3년 후 {area_name}은 MZ세대의 감성 성지로 완전히 자리잡으며 임대료가 가파르게 상승할 것으로 보입니다. 초기 진입한 청년 사장님들의 독창적인 브랜딩이 거대 자본과 경쟁하게 되는 시기입니다."
            image_prompt = f"futuristic trendy glass storefront in {area_name}, bustling with stylish Gen Z, golden hour lighting"
        elif gent_index > 50:
            state = "성장기 - 바이럴 확장 구간"
            comment = f"현재의 트렌드가 3년 후에도 꾸준히 이어지며, '상권의 확장'이 일어날 전망입니다. 청년 창업가들에게는 가장 수익성이 극대화되는 황금기가 될 것입니다."
            image_prompt = f"modern cafe street in {area_name}, minimal design, plants and wood textures, young crowd"
        else:
            state = "정체기 - 본질 강화 필요"
            comment = f"감성 소비가 한 차례 휩쓸고 간 뒤, 실질적인 맛과 서비스라는 본질이 더 중요해집니다. 반짝 유행보다는 단골 확보를 위한 커뮤니티 형성이 생존의 열쇠가 됩니다."
            image_prompt = f"cozy classic shop in {area_name}, warm interior, focus on craft and quality"

        return {
            "state": state,
            "comment": comment,
            "image_prompt": image_prompt,
            "gent_index": round(gent_index, 1)
        }

    @staticmethod
    def _generate_5yr_prediction(area_name, trend, pop, demand, comp):
        # 5년 후는 인구 구조와 장기 트렌드 영향력 확대
        vibe_stability = (pop * 0.5 + trend * 0.5)
        
        if vibe_stability > 80:
            state = "글로벌 랜드마크화"
            comment = f"5년 후 {area_name}은 단순한 지역 상권을 넘어 전 세계가 주목하는 K-감성의 중심지가 됩니다. 임대료는 매우 높지만, 이를 상쇄할 만큼의 강력한 브랜드 파워를 가진 청년 기업가들이 시장을 주도할 것입니다."
        elif vibe_stability > 60:
            state = "안정적 정착기"
            comment = f"뜨내기 상권에서 벗어나 지역 주민과 MZ세대가 공존하는 안정된 생태계를 구축합니다. 'MZ 사장'들의 감성이 지역 정체성으로 굳어지며 지속 가능한 창업 환경이 조성됩니다."
        else:
            state = "상권 재편기"
            comment = f"상권의 주도권이 다른 지역으로 이동할 가능성이 있습니다. 현재의 감성을 유지하기보다는 새로운 비즈니스 모델로의 과감한 피벗(Pivot)이 필요한 시기가 될 것입니다."

        return {
            "state": state,
            "comment": comment,
            "image_prompt": f"high-tech futuristic commercial district in {area_name}, neon signs and green architecture, professional tech-savvy crowd",
            "vibe_stability": round(vibe_stability, 1)
        }

    @staticmethod
    def _generate_10yr_prediction(area_name, trend, pop, demand, comp):
        # 10년 후는 상권의 완전한 변모 혹은 쇠퇴를 결정짓는 시기
        # 누적된 인구 데이터와 원천 트렌드 기반
        future_vibe = (pop * 0.6 + demand * 0.4)
        
        if future_vibe > 85:
            state = "스마트 시티 코어"
            comment = f"10년 후 {area_name}은 AI와 로봇 기술이 접목된 스마트 창업의 메카가 됩니다. 전통적인 매장의 개념이 사라지고, 디지털과 오프라인이 완벽히 융합된 초감성 경험을 제공하는 공간으로 거듭납니다."
        elif future_vibe > 65:
            state = "전통과 혁신의 공존"
            comment = f"10년의 세월을 견딘 명소들이 살아남아 노포의 감성을 유지하면서도, 새로운 혁신 기술이 어우러진 독특한 지역 문화를 형성합니다. 가장 안정적인 수익 모델을 가진 '마스터 클럽' 지역이 됩니다."
        else:
            state = "뉴 패러다임 전환기"
            comment = f"기존의 상권 공식이 완전히 파괴됩니다. 메타버스와 배달 위주의 '버추얼 상권'으로 변모하거나, 아예 새로운 세대의 감성에 맞게 대규모 재개발이 일어나는 시기입니다."

        return {
            "state": state,
            "comment": comment,
            "image_prompt": f"cyberpunk style futuristic street in {area_name}, floating holographic displays, flying delivery drones, extreme architectural design",
            "future_vibe": round(future_vibe, 1)
        }
