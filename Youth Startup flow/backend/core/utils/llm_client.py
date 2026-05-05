import requests
import json
import logging

logger = logging.getLogger(__name__)

class LLMClient:
    """LM Studio(Local LLM)와 통신하는 전용 클라이언트"""
    
    def __init__(self, host="localhost", port=1234):
        self.url = f"http://{host}:{port}/v1/chat/completions"
        self.model = "gemma4"  # 사용자의 모델명에 맞춰 수정 가능

    def get_ai_insight(self, area_name, scores, founder_data, context_snippets=""):
        """
        상권 분석 데이터와 실제 블로그 여론(context)을 기반으로 정밀 인사이트를 가져옵니다.
        """
        context_str = f"\n[실제 블로그 여론 요약]\n{context_snippets}" if context_snippets else ""
        
        prompt = f"""
        당신은 상권 분석 전문가입니다. 아래의 수치 데이터와 실시간 블로그 여론을 기반으로 '{area_name}' 지역에 대한 창업 인사이트를 요약해 주세요.
        
        [수치 데이터]
        - 지역: {area_name} / 업종: {founder_data.get('industry', '정보 없음')}
        - 최종 성공률: {scores.get('final_score')}% / 인구: {scores.get('pop_score')} / 검색량: {scores.get('demand_score')}
        - 트렌드(블로그): {scores.get('trend_score')} / 경쟁정도: {scores.get('competition_score')}
        - 기대월세: {scores.get('rent_10k', '정보 없음')}만원
        {context_str}

        [답변 가이드]
        1. 단순 수치 나열이 아닌, 블로그 여론에서 나타난 구체적인 특징(주차, 친절도, 맛, 분위기 등)을 언급해 주세요.
        2. 창업자가 이 지역에서 주의해야 할 점과 기회 요인을 각각 1문장씩 포함해 총 3~4문장으로 작성해 주세요.
        3. 전문적이면서도 신뢰감 있는 컨설턴트의 톤을 유지해 주세요.
        """

        headers = {"Content-Type": "application/json"}
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        try:
            response = requests.post(self.url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            logger.warning(f"AI Insight 생성 실패 (LM Studio 확인 필요): {e}")
            return "현재 AI 분석 기능을 사용할 수 없습니다. 로컬 LLM 서버 상태를 확인해 주세요."
