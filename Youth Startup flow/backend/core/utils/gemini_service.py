import google.generativeai as genai
import logging
import os
import json
from config.settings import GEMINI_API_KEY, GEMINI_MODEL_NAME, DATA_DIR, GEMINI_MAX_CALLS, GEMINI_LIMIT_ENABLED

logger = logging.getLogger(__name__)

class GeminiService:
    """Google Gemini 1.5 Pro를 이용한 창업 인사이트 생성 서비스"""
    
    def __init__(self):
        if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_ACTUAL_API_KEY":
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel(GEMINI_MODEL_NAME)
            self.enabled = True
        else:
            logger.warning("GEMINI_API_KEY가 설정되지 않았습니다. AI 기능을 사용할 수 없습니다.")
            self.enabled = False
        
        # 사용량 추적 파일 설정
        self.usage_file = os.path.join(DATA_DIR, "ai_usage.json")
        self._ensure_usage_file()

    def _ensure_usage_file(self):
        """사용량 추적 파일이 없으면 생성"""
        if not os.path.exists(self.usage_file):
            try:
                os.makedirs(os.path.dirname(self.usage_file), exist_ok=True)
                with open(self.usage_file, 'w', encoding='utf-8') as f:
                    json.dump({"total_calls": 0}, f)
            except Exception as e:
                logger.error(f"사용량 추적 파일 생성 실패: {e}")

    def _get_call_count(self):
        """현재까지의 총 호출 횟수 반환"""
        try:
            if os.path.exists(self.usage_file):
                with open(self.usage_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get("total_calls", 0)
        except:
            pass
        return 0

    def _increment_call_count(self):
        """호출 횟수 1 증가"""
        try:
            count = self._get_call_count()
            with open(self.usage_file, 'w', encoding='utf-8') as f:
                json.dump({"total_calls": count + 1}, f)
        except Exception as e:
            logger.error(f"사용량 업데이트 실패: {e}")

    def _is_limit_exceeded(self):
        """제한 횟수를 초과했는지 확인"""
        if not GEMINI_LIMIT_ENABLED:
            return False
        return self._get_call_count() >= GEMINI_MAX_CALLS

    def generate_persona_insight(self, persona_name: str, description: str):
        """선택된 페르소나에 대한 전문적인 창업자 프로파일링 인사이트 생성"""
        if not self.enabled:
            return f"{persona_name}은(는) {description} 성향을 가진 창업자입니다. (AI 분석을 보려면 API 키를 설정해주세요)"

        if self._is_limit_exceeded():
            return "팀 프로젝트 AI 분석 한도를 모두 사용했습니다."

        self._increment_call_count()

        prompt = f"""
        당신은 상권 분석 및 창업 컨설팅 전문가입니다. 
        '{persona_name}'이라는 페르소나를 가진 예비 창업자가 있습니다.
        
        [페르소나 설명]
        {description}
        
        위 페르소나의 특성을 기반으로 다음 내용을 포함한 3~4문장의 전문적인 분석 리포트를 작성해 주세요:
        1. 이 창업자의 강점 및 비즈니스적 가치.
        2. 타겟 고객(MZ세대 등)과의 감성적 연결 고리.
        3. 성공적인 브랜딩을 위한 핵심 조언.
        
        답변은 친절하면서도 전문적인 컨설턴트 톤으로 작성해 주세요. 한국어로 답변하세요.
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API 호출 실패: {e}")
            return f"{persona_name} 페르소나에 대한 심층 분석을 준비 중입니다. ({description})"

    def generate_chat_response(self, message: str, history: list = None):
        """사용자의 질문에 대해 창업 컨설턴트로서의 답변 생성"""
        try:
            if not self.enabled:
                return "현재 컨설팅 엔진이 오프라인 상태입니다. 나중에 다시 시도해 주세요. (API 키 확인 필요)"

            if self._is_limit_exceeded():
                return "오늘의 무료 컨설팅 한도를 모두 사용했습니다. 전문가 1:1 상담을 예약해 보세요."

            self._increment_call_count()

            # 시스템 프롬프트 설정
            system_prompt = f"""
            당신은 'The Sovereign Insight Engine'의 수석 창업 컨설턴트 'Flow AI'입니다. 
            사용자는 소상공인 또는 예비 창업자입니다. 
            당신의 목표는 사용자에게 전문적이고 신뢰감 있는 비즈니스 인사이트를 제공하는 것입니다.
            
            [가이드라인]
            1. 톤앤매너: 정중하면서도 압도적인 전문성을 보여주는 'Sovereign' 톤을 유지하세요.
            2. 전문성: 상권 분석, GIS 데이터, MZ세대 트렌드, 마케팅 전략 등에 대해 구체적으로 답변하세요.
            3. 비즈니스 모델: 웹 버전(29,000원)의 가치를 은근히 강조하며, 전문가 리포트의 중요성을 언급하세요.
            4. 짧고 명확하게: 사용자가 읽기 편하도록 핵심 위주로 2~4문장으로 답변하세요.
            5. 한국어로 답변하세요.
            
            사용자 질문: {message}
            """

            # 대화 기록 구성 대신 단순 생성으로 변경하여 안정성 확보
            response = self.model.generate_content(system_prompt)
            
            if response and response.text:
                return response.text.strip()
            else:
                return "AI로부터 유효한 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요."
                
        except Exception as e:
            logger.error(f"Gemini Chat 상세 오류: {str(e)}")
            return f"컨설팅 엔진 내부 오류가 발생했습니다: {str(e)}"

    def generate_area_report(self, area_name: str, scores: dict, founder_info: dict):
        """상권 데이터와 창업자 조건을 분석하여 제미나이 고도화 리포트 생성 (젠트리피케이션 포함)"""
        if not self.enabled:
            return "AI 분석 리포트를 생성할 수 없습니다. (API 키 확인 필요)"

        if self._is_limit_exceeded():
            return f"안내: 팀 프로젝트 AI 분석 한도({GEMINI_MAX_CALLS}회)를 모두 사용했습니다. 관리자에게 문의하세요."

        self._increment_call_count()

        prompt = f"""
        당신은 상권 분석 및 부동산 전략 전문가입니다. 
        다음은 '{area_name}' 지역에 대한 실제 빅데이터 분석 수치와 창업자의 조건입니다.
        
        [창업자 조건]
        - 업종: {founder_info.get('industry')}
        - 타겟: {founder_info.get('target')}
        - 예산: {founder_info.get('capital')}만원
        
        [빅데이터 분석 점수 (100점 만점)]
        - 인구 점수: {scores.get('pop_score')}
        - 수요 점수: {scores.get('demand_score')}
        - 트렌드 점수(MZ 감성): {scores.get('trend_score')}
        - 경쟁 점수(집적 이익): {scores.get('competition_score')}
        - 예상 임대료: 월 {scores.get('rent_10k')}만원
        
        위 데이터를 바탕으로 다음 4가지 항목에 대해 전문적이고 통찰력 있는 '고도화 프리미엄 리포트'를 작성해 주세요:
        
        1. **젠트리피케이션 위험도**: 현재 트렌드와 임대료를 고려할 때 상권 쇠퇴 또는 임대료 폭등 가능성은 어느 정도인가?
        2. **MZ세대 공략 포인트**: 이 지역 MZ세대의 소비 패턴과 이 업종이 어떻게 결합될 때 시너지가 나는가?
        3. **3~5년 후 미래 시나리오**: 이 상권은 앞으로 어떻게 변화할 것인가?
        4. **전략적 한 줄 평**: 이 창업자에게 전달할 가장 핵심적인 비즈니스 조언.
        
        사용자가 보기 편하도록 적절한 소제목과 불렛 포인트를 사용하고, 전문 컨설턴트 톤으로 한국어로 작성하세요.
        마지막에 "--- (AI Specialized Insight) ---" 문구를 포함해 주세요.
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini Area Report 생성 실패: {e}")
            return f"{area_name} 상권에 대한 AI 심층 분석을 수동으로 생성 중입니다. 데이터 지표를 참조해 주세요."

# 싱글톤 인스턴스
gemini_service = GeminiService()
