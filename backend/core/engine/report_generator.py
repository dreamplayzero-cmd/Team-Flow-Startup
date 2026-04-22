# core/engine/report_generator.py
import random

class ReportGenerator:
    """지역, 업종, 창업자 조건에 다이나믹하게 반응하는 초정밀 텍스트 생성기"""

    @staticmethod
    def generate(scores, founder_info, area_name="해당 상권"):
        prob = scores.get('final_score', 0)
        ind = founder_info.get('industry', '선택 업종')
        tgt = founder_info.get('target', '전 고객층')
        opt = founder_info.get('op_type', '홀 운영')
        bgt = founder_info.get('capital', '0')

        # 1. 뼈대가 되는 종합 리포트 멘트 생성
        intro_variations = [
            f"<b>📊 AI 종합 상권 분석 컨설팅</b><br><br>입력하신 프로파일(<b>{bgt}만 원 예산의 {opt}형 {ind}</b>)을 토대로 <b>{tgt}</b> 타겟 시장 진입 전략을 분석한 결과입니다.<br>",
            f"<b>🎯 심층 비즈니스 리포트</b><br><br><b>{area_name}</b> 지역 내에서 <b>{ind}</b> 업종으로 <b>{opt}</b> 전략을 전개할 때의 AI 예측 리포트입니다.<br>",
            f"<b>💡 창업 성공률 시뮬레이션</b><br><br>자본금 <b>{bgt}만 원</b>으로 <b>{area_name}</b>에 <b>{ind}</b> 매장을 오픈했을 때의 빅데이터 스코어링 결과입니다.<br>"
        ]
        
        report_text = random.choice(intro_variations)
        report_text += f"<br>이 모델은 현재 <b><span style='color:#38BDF8; font-size:18px;'>{prob}%</span></b> 의 예측 성공률을 보입니다.<br>"
        
        # [신규] 수익성 데이터 요약
        rent = scores.get('rent_10k', '정보 없음')
        bep = scores.get('bep_period', '계산 중')
        report_text += f"💰 <b>예상 월세:</b> {rent}만 원 / ⏳ <b>예상 원금 회수:</b> {bep}<br><br>"

        # 2. 종합 의견 (종합 코멘트 방대화)
        if prob >= 80:
            if opt == "배달 중심":
                report_text += f"💡 <b>종합 의견:</b> 매우 훌륭한 전략입니다. {area_name}의 배달 수요와 {ind} 업종의 마진율이 폭발적인 시너지를 낼 것으로 보입니다."
            else:
                report_text += f"💡 <b>종합 의견:</b> 강력히 추천하는 시장입니다. 빵빵한 유동인구와 {tgt}층의 수요가 겹쳐 {opt}형 핫플레이스로 자리잡을 잠재력이 엄청납니다."
        elif prob >= 50:
            if "성수" in area_name or "한남" in area_name:
                report_text += f"💡 <b>종합 의견:</b> 성공 잠재력은 있으나, {area_name} 특유의 높은 임대료와 젠트리피케이션을 버틸 수 있는 '확실한 감성(브랜딩)'이 요구됩니다."
            else:
                report_text += f"💡 <b>종합 의견:</b> 안정적인 진입은 가능합니다. 다만 {ind}의 특성상 {tgt} 고객들의 충성도를 높이기 위한 강력한 시그니처 메뉴가 생존의 핵심 열쇠입니다."
        else:
            if "카페" in ind or "디저트" in ind:
                report_text += f"💡 <b>종합 의견:</b> 경고! {area_name}에서 {ind} 창업은 현재 레드오션의 끝판왕입니다. 예산({bgt}만원)이 순식간에 녹아내릴 위험이 매우 높습니다."
            else:
                report_text += f"💡 <b>종합 의견:</b> 진입 보류를 권장합니다. 타겟 수요({tgt})와 해당 상권의 성격이 맞지 않거나, 턱없이 부족한 검색량/유동인구로 폐업 리스크가 높습니다."

        # 3. 장점 텍스트 모음 (동적 풀)
        reasons = []
        if scores['pop_score'] > 70:
            reasons.append(random.choice([
                f"{area_name} 특유의 풍부한 기저 유동인구로 워크인 고객 확보 유리",
                f"{tgt}층의 발길이 끊이지 않는 거대 배후 수요망 존재",
                "물리적인 유동인구 밀도가 높아 오픈 초기 바이럴에 매우 유리함"
            ]))
        if scores['demand_score'] > 70:
            reasons.append(random.choice([
                f"최근 3개월간 <b>{area_name} {ind}</b> 관련 네이버 검색량 폭발적 증가",
                f"타 지역 대비 <b>{ind}</b> 카테고리에 대한 온라인 목적성 대기 수요 막강",
                "마케팅 효율이 극대화될 수 있는 '검색-방문' 전환율 우수 지역"
            ]))
        if scores['competition_score'] > 70:
            reasons.append(random.choice([
                f"현재 {area_name} 내 {ind} 매장 공급이 현저히 부족하여 독점 수혜 가능",
                "경쟁 매장 밀집도가 낮아 출혈 경쟁 없이 여유로운 시장 안착 전망 (블루오션)",
                f"경쟁자의 부재로 <b>{opt}</b> 상권 점유율을 빠르게 훔쳐올 수 있는 구조"
            ]))
        if scores['trend_score'] > 70:
            reasons.append(random.choice([
                "각종 SNS 및 블로그에서 극도로 긍정적인 '감성 핫플' 리뷰 릴레이 중",
                "소비자 여론 지수가 매우 높아 인증샷 및 자발적 인스타 바이럴 형성 기대",
                "최신 트렌드 세터들이 모여드는 힙(Hip)한 상권 특성 보유"
            ]))
            
        reasons.extend(scores.get('bonus_logs', []))
        pros = "<br><br>".join(f"✅ {r}" for r in reasons) if reasons else "데이터 기준의 뚜렷한 강점을 도출하는 중입니다."

        # 4. 단점 텍스트 모음 (동적 풀)
        con_reasons = []
        if scores['competition_score'] < 30:
            con_reasons.append(random.choice([
                f"🚨 <b>{ind}</b> 가게가 한 집 걸러 한 집 있는 핏빛 레드오션 타운",
                f"{area_name} 내 거대 프랜차이즈와의 전면전 불가피 (제살깎기 경쟁 우려)",
                "동일 파이를 나누어 먹어야 하므로 1인당 객단가 하락 리스크 존재"
            ]))
        if scores['demand_score'] < 30:
            con_reasons.append(random.choice([
                f"사람들이 이 동네에 <b>{ind}</b>을(를) 먹으러 일부러 찾아오지는 않는 상권",
                f"<b>{area_name} {ind}</b> 키워드 검색 생태계가 거의 전멸된 상태",
                "목적 방문객이 없어 100% 지나가는 사람들에게 간판만으로 의존해야 함"
            ]))
        if scores['pop_score'] < 30:
            con_reasons.append(random.choice([
                f"{tgt} 등 주요 배후 수요층의 물리적 거주/근무 인구 절대적 열세",
                "주말 또는 특정 시간대에만 반짝하고 죽어버리는 극단적 공동화 현상 리스크",
                f"배달/홀 무관하게 <b>{area_name}</b> 자체의 인구 풀(Pool)이 극도로 적음"
            ]))

        con_reasons.extend(scores.get('penalty_logs', []))
        cons = "<br><br>".join(f"🚨 {r}" for r in con_reasons) if con_reasons else "뚜렷한 초기 진입 장벽이나 상권 자체의 치명적 리스크는 발견되지 않음."

        return report_text, pros, cons
