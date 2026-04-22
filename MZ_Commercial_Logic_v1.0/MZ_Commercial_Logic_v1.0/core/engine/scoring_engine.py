# core/engine/scoring_engine.py
"""
MZ 상권분석 AI - 통합 스코어링 엔진 (고도화 v2)

[주요 개선사항]
1. 수요 점수 정규화 모수 수정: 50,000 → 100 (Naver ratio 특성 반영)
2. growth_rate 컬럼 활용: 마스터플랜 공식 (avg_ratio*0.6 + growth_rate*0.4) 반영
3. 하드코딩된 area_code → config/settings.AREA_MAP 통합 (단일 진실)
4. 각 점수에 confidence_level 반환 (is_mock 기반 신뢰도 지표)
5. 블로그 감성 분석: positive_count/negative_count 컬럼 활용
"""
import logging
import json
import os
from data.db_manager import DatabaseManager
from core.utils.llm_client import LLMClient
from config.settings import AREA_MAP

logger = logging.getLogger(__name__)


# =====================================================================
# [단일 진실 공급원] config/settings.AREA_MAP에서 동적으로 빌드
# WHY: scoring_engine.py에 하드코딩된 area_code가 settings.py와 이중 관리되던
#      문제를 해결. 지역 추가/삭제 시 settings.py 한 곳만 수정하면 됨.
# =====================================================================
def _build_area_attribute_map():
    """config/area_attributes.json에서 code → attribute 역매핑 딕셔너리 생성"""
    premium = set()
    night_bonus = set()
    night_penalty = set()

    # 파일 경로 설정 (절대 경로 대응)
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'area_attributes.json')
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            attr_data = json.load(f)
        
        premium_names = set(attr_data.get("PREMIUM_AREAS", []))
        night_bonus_names = set(attr_data.get("NIGHT_BONUS_AREAS", []))
        night_penalty_names = set(attr_data.get("NIGHT_PENALTY_AREAS", []))

        for name, info in AREA_MAP.items():
            code = info["code"]
            if name in premium_names:
                premium.add(code)
            if name in night_bonus_names:
                night_bonus.add(code)
            if name in night_penalty_names:
                night_penalty.add(code)
    except Exception as e:
        logger.error(f"[ERROR] [scoring_engine] [_build_area_attribute_map] - 설정 파일 로드 실패: {e}")

    return premium, night_bonus, night_penalty


PREMIUM_AREAS, NIGHT_BONUS_AREAS, NIGHT_PENALTY_AREAS = _build_area_attribute_map()


class ScoringEngine:
    """4가지 핵심 데이터(인구, 상가, 블로그, 검색)를 통합 분석하는 엔진"""

    def __init__(self):
        self.db = DatabaseManager()
        self.ai_client = LLMClient()

    def save_founder_input(self, area_code, data):
        """
        창업자 입력 조건을 DB 히스토리에 저장 (다중 지역 및 10가지 조건)
        """
        query = """
        INSERT INTO founder_inputs (
            user_id, area_code, industry_category, budget,
            age, gender, experience_years, target_audience,
            operation_type, target_time, memo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        user_id = "SessionUser"
        industry = data.get('industry', '')
        areas_str = ",".join(data.get('areas', []))

        try:
            budget = int(data.get('capital', '0'))
        except (ValueError, TypeError):
            budget = 0
        try:
            age = int(data.get('age', '0'))
        except (ValueError, TypeError):
            age = 0
        try:
            exp = int(data.get('experience', '0'))
        except (ValueError, TypeError):
            exp = 0

        memo = "DB 저장 완료 (자동)"
        params = (
            user_id, areas_str, industry, budget,
            age, data.get('gender', ''), exp, data.get('target', ''),
            data.get('op_type', ''), data.get('op_time', ''), memo
        )
        try:
            self.db.execute_query(query, params)
            logger.info(
                f"[INFO] [scoring_engine] [save_founder_input] - "
                f"방문 기록 저장 완료: Areas={areas_str}, Ind={industry}, Budget={budget}"
            )
        except Exception as e:
            logger.error(f"[ERROR] [scoring_engine] [save_founder_input] - 히스토리 저장 실패: {e}")

    def calculate_area_score(self, area_code, founder_data):
        """
        4대 데이터 기반 통합 점수 산출 (창업자 상세 조건 반영)
        :return: dict (final_score, 각 sub_score, confidence_levels, bonus_logs, penalty_logs)
        """
        industry_category = founder_data.get('industry', '')
        op_type = founder_data.get('op_type', '홀 중심')
        try:
            exp = int(founder_data.get('experience', '0'))
        except (ValueError, TypeError):
            exp = 0
        try:
            capital = int(founder_data.get('capital', '0'))
        except (ValueError, TypeError):
            capital = 0

        logger.info(
            f"[INFO] [scoring_engine] [calculate_area_score] - "
            f"Integrated Scoring 시작: Area={area_code}, Industry={industry_category}"
        )

        # ── 4대 개별 점수 계산 ──
        pop_score, pop_confidence = self._get_population_score(area_code)
        demand_score, demand_confidence = self._get_demand_score(area_code, founder_data)
        trend_score, trend_confidence = self._get_trend_score(area_code, industry_category)
        competition_score, comp_confidence = self._get_competition_score(area_code, industry_category)
        
        # ── 5. 임대료 정보 및 비용 점수 (추가) ──
        rent_10k, rent_confidence = self._get_rent_info(area_code)

        # ── 동적 가중치 (운영 형태 기반) ──
        w_pop, w_dem, w_tre, w_com = 0.25, 0.25, 0.25, 0.25
        if op_type == "배달 중심":
            w_pop, w_dem, w_tre, w_com = 0.10, 0.35, 0.20, 0.35
        elif op_type == "테이크아웃 중점":
            w_pop, w_dem, w_tre, w_com = 0.40, 0.15, 0.30, 0.15

        final_score = (
            (pop_score * w_pop) +
            (demand_score * w_dem) +
            (trend_score * w_tre) +
            (competition_score * w_com)
        )

        bonus_logs = []
        penalty_logs = []

        # [Rule 1] 생초보 + 핏빛 레드오션 페널티 / 베테랑 버프
        if exp < 1 and competition_score < 30:
            final_score -= 10.0
            penalty_logs.append("경력 부족 및 레드오션: 초보자가 살아남기 힘든 초경쟁 상태입니다 (-10점).")
        elif exp >= 3:
            final_score += 5.0
            bonus_logs.append("베테랑 보너스: 3년 이상 경력에 의한 운영 안정성 가산 (+5점).")

        # [Rule 2] 예산 파산 리스크 / 자본 여유 버프
        target_op_time = founder_data.get('op_time', '')
        if area_code in PREMIUM_AREAS and capital < 5000:
            if op_type not in ["배달 중심", "테이크아웃 중점"]:
                final_score -= 8.0
                penalty_logs.append(
                    "재무 위험: 1A급 상권 홀 매장 진입 시 해당 예산(5천만 이하)으로 임대료를 버티기 어렵습니다 (-8점)."
                )
        elif capital >= 10000:
            final_score += 3.0
            bonus_logs.append("자본 버퍼 넉넉함: 마케팅 및 위기 대응이 가능한 탄탄한 예산 (+3점).")

        # [Rule 3] 심야 영업 궁합
        if target_op_time == "심야 영업":
            if area_code in NIGHT_BONUS_AREAS:
                final_score += 5.0
                bonus_logs.append("황금 궁합: 유흥가 기반 상권과 심야 영업은 최상의 시너지입니다 (+5점).")
            elif area_code in NIGHT_PENALTY_AREAS:
                final_score -= 5.0
                penalty_logs.append("영업 궁합 미스: 주거지 기반 상권에서 심야 영업은 유동인구가 부족합니다 (-5점).")

        # [Rule 4] 젠트리피케이션 (상권 쇠퇴) 리스크
        if trend_score < 40 and demand_score < 50:
            final_score -= 10.0
            penalty_logs.append(
                "상권 쇠퇴 경고: 과거에 비해 검색량과 트렌드 지수가 모두 폭락 중인 위험 지역입니다 (-10점)."
            )

        # 최솟값·최댓값 보정
        final_score = max(min(final_score, 99.9), 1.0)

        # 전체 신뢰도 계산 (4개 중 HIGH가 몇 개인지)
        confidences = [pop_confidence, demand_confidence, trend_confidence, comp_confidence]
        high_count = confidences.count("HIGH")
        if high_count >= 3:
            overall_confidence = "HIGH"
        elif high_count >= 1:
            overall_confidence = "MEDIUM"
        else:
            overall_confidence = "LOW"

        return {
            "final_score": round(final_score, 1),
            "pop_score": round(pop_score, 1),
            "demand_score": round(demand_score, 1),
            "trend_score": round(trend_score, 1),
            "competition_score": round(competition_score, 1),
            "rent_10k": rent_10k,
            # 신뢰도 지표 (is_mock 기반)
            "pop_confidence": pop_confidence,
            "demand_confidence": demand_confidence,
            "trend_confidence": trend_confidence,
            "comp_confidence": comp_confidence,
            "rent_confidence": rent_confidence,
            "overall_confidence": overall_confidence,
            "bonus_logs": bonus_logs,
            "penalty_logs": penalty_logs,
        }

    # ──────────────────────────────────────────
    # 내부 점수 계산 메서드들
    # ──────────────────────────────────────────

    def _get_deterministic_mock(self, area_code, keyword, base, variance):
        """
        DB에 데이터가 없을 때 지역/업종별 고유의 예측 가상치 생성
        WHY: random() 대신 hashlib.md5 결정론적 값 사용 →
             같은 조건이면 항상 같은 Fallback 점수 보장 (재현성 확보)
        """
        import hashlib
        unique_str = f"{area_code}_{keyword}"
        h_val = int(hashlib.md5(unique_str.encode()).hexdigest(), 16)
        noise = (h_val % 100) / 100.0
        return base + (noise * variance)

    def _get_population_score(self, area_code):
        """
        [데이터 1] 행안부 인구 데이터 기반 점수
        :return: (score, confidence_level)
        """
        # is_mock=0(실제 데이터) 우선 조회
        query = """
            SELECT SUM(population_count) as total, MIN(is_mock) as quality_flag
            FROM population_data
            WHERE area_code = ?
        """
        result = self.db.execute_query(query, (area_code,))
        pop_count = result[0]['total'] if result[0]['total'] else 0
        is_mock = result[0]['quality_flag'] if result[0]['quality_flag'] is not None else 1

        if pop_count == 0:
            score = self._get_deterministic_mock(area_code, "pop", 40, 50)
            confidence = "LOW"
        else:
            # WHY: 서울 동 단위 인구는 보통 1~4만 명 수준. 
            #      기존 1만 명 기준은 모두 100점이 되어 변별력이 없었음 -> 5만 명 기준으로 상향 (서울 핫플 비교 가능)
            score = min((pop_count / 50000) * 100, 100)
            # 만약 20점 이하라면 하한선 20점으로 보정 (사람이 아예 없는 동네는 아니므로)
            score = max(score, 20.0)
            confidence = "HIGH" if is_mock == 0 else "MEDIUM"

        return score, confidence

    def _get_demand_score(self, area_code, founder_data):
        """
        [데이터 2] 네이버 검색 수요 점수 (고도화 v2)
        WHY: 기존 50,000 모수는 ratio(0~100) 특성상 항상 0.2점 이하를 반환하던 버그.
             avg_ratio(0~100)를 직접 사용 + growth_rate(%) 반영으로 마스터플랜 공식 구현.
             공식: Score = (avg_ratio * 0.6) + (growth_rate_bonus * 0.4)
        :return: (score, confidence_level)
        """
        industry_category = founder_data.get('industry', '')
        target = founder_data.get('target', '상관없음')
        op_time = founder_data.get('op_time', '상관없음')

        # avg_ratio, growth_rate 함께 조회 (신규 컬럼 활용)
        query = """
            SELECT keyword, search_volume, avg_ratio, growth_rate, is_mock
            FROM keyword_trends
            WHERE area_code = ? AND keyword LIKE ?
        """
        results = self.db.execute_query(query, (area_code, f"%{industry_category}%"))

        if not results:
            score = self._get_deterministic_mock(area_code, industry_category, 30, 60)
            return score, "LOW"

        # ── 고관여(High-Intent) 키워드 사전 구축 ──
        high_intent_words = []
        if target == "1020 학생":
            high_intent_words.extend(["가성비", "인스타", "디저트", "핫플", "줄서기"])
        elif target == "2030 MZ":
            high_intent_words.extend(["분위기", "데이트", "와인", "신상", "추천", "감성"])
        elif target in ("3040 직장인",) or op_time == "런치 타임 (직장인)":
            high_intent_words.extend(["회식", "점심", "혼밥", "프라이빗", "룸", "예약"])
        elif target == "가족단위":
            high_intent_words.extend(["주차", "가족", "아이", "단체"])
        if op_time == "심야 영업":
            high_intent_words.extend(["심야", "새벽", "늦게까지", "24시간"])

        weighted_ratios = []
        growth_rates = []
        has_real_data = False

        for row in results:
            # avg_ratio 컬럼이 있으면 우선 사용, 없으면 search_volume으로 대체
            avg_ratio = row['avg_ratio'] if row['avg_ratio'] else row['search_volume'] or 0
            growth_rate = row['growth_rate'] or 0.0
            kw = row['keyword']

            # is_mock 체크
            if row['is_mock'] == 0:
                has_real_data = True

            # 고관여 키워드면 1.5배 가중치 (기존 3배에서 조정: 과도한 왜곡 방지)
            # WHY: 3배는 avg_ratio=100일 때 300이 되어 다시 정규화 문제 발생.
            #      1.5배는 실질 가중치를 주되 스케일을 유지함.
            is_intent = any(word in kw for word in high_intent_words)
            multiplier = 1.5 if is_intent else 1.0

            weighted_ratios.append(avg_ratio * multiplier)
            growth_rates.append(growth_rate)

        if not weighted_ratios:
            score = self._get_deterministic_mock(area_code, f"{industry_category}_adv", 20, 50)
            return score, "LOW"

        # 평균 가중 ratio (0~100 범위 유지)
        avg_weighted_ratio = sum(weighted_ratios) / len(weighted_ratios)
        avg_weighted_ratio = min(avg_weighted_ratio, 100)  # 상한 100

        # 증가율 → 보너스 점수 (-20 ~ +20 범위로 제한)
        # WHY: growth_rate(%)를 직접 더하면 스케일이 폭발할 수 있음
        avg_growth = sum(growth_rates) / len(growth_rates) if growth_rates else 0
        growth_bonus = max(-20, min(20, avg_growth))  # -20 ~ +20 점 클리핑

        # 마스터플랜 공식: 검색량 0.6 + 증가율 0.4
        score = (avg_weighted_ratio * 0.6) + ((50 + growth_bonus) * 0.4)
        score = max(0, min(score, 100))

        confidence = "HIGH" if has_real_data else "MEDIUM"
        return score, confidence

    def _get_trend_score(self, area_code, industry_category):
        """
        [데이터 3] 블로그 감성 분석 점수
        WHY: positive_count/negative_count 컬럼 활용으로
             가중 평균 대신 전체 언급 기반 감성 점수 계산 가능.
        :return: (score, confidence_level)
        """
        query = """
            SELECT
                AVG(sentiment_score) as avg_sent,
                SUM(positive_count) as total_pos,
                SUM(negative_count) as total_neg,
                SUM(mention_count) as total_mentions,
                MIN(is_mock) as quality_flag
            FROM blog_analysis
            WHERE area_code = ?
        """
        result = self.db.execute_query(query, (area_code,))
        if result and result[0]:
            row = result[0]
            avg_sent = row['avg_sent'] if row['avg_sent'] is not None else 0
            total_pos = row['total_pos'] if row['total_pos'] is not None else 0
            total_neg = row['total_neg'] if row['total_neg'] is not None else 0
            is_mock = row['quality_flag']
        else:
            avg_sent = 0
            total_pos = 0
            total_neg = 0
            is_mock = 1

        if avg_sent == 0:
            score = self._get_deterministic_mock(area_code, f"{industry_category}_sent", 0.3, 0.6)
            return score * 100, "LOW"

        # 언급량이 충분하면 전체 카운트 기반 재계산 (더 정확)
        total_sentiment_refs = total_pos + total_neg
        if total_sentiment_refs > 10:
            refined_score = total_pos / total_sentiment_refs
            score = refined_score * 100
        else:
            score = avg_sent * 100

        confidence = "HIGH" if (is_mock == 0) else "MEDIUM"
        return score, confidence

    def _get_competition_score(self, area_code, industry_category):
        """
        [데이터 4] 상가 정보 기반 경쟁 및 집적 이익(Synergy) 점수
        WHY: 무조건적인 페널티가 아닌, '집적 이익' 법칙에 따른 최적 밀도 곡선 적용.
             특정 구간까지는 매장이 모여 있어야 상권 시너지가 발생함.
        :return: (score, confidence_level)
        """
        # [고도화] 서울 핫플레이스 특성 반영 (상한선 및 최적 밀도 상향)
        MAX_STORE_SATURATION = 500  # 500개 이상이면 완전 포화 (Selection Difficulty 상승)
        OPTIMAL_COUNT = 60         # 60개까지는 집적 이익(Synergy) 발생 구간
 
        query = """
            SELECT COUNT(*) as cnt, MIN(is_mock) as quality_flag
            FROM store_info
            WHERE area_code = ? AND category_medium LIKE ?
        """
        result = self.db.execute_query(query, (area_code, f"%{industry_category}%"))
        count = result[0]['cnt'] if result[0]['cnt'] else 0
        is_mock = result[0]['quality_flag'] if result[0]['quality_flag'] is not None else 1
 
        if count == 0:
            # 아예 없으면 데이터 신뢰도가 낮고 개척 리스크가 있음 (중간 점수)
            raw_count = self._get_deterministic_mock(
                area_code, f"{industry_category}_comp", 10, 100
            )
            count = raw_count
            confidence = "LOW"
        else:
            confidence = "HIGH" if is_mock == 0 else "MEDIUM"
 
        # [고도화 공식] 최적 밀도 시너지 곡선 (Bell Curve 형태)
        if count <= OPTIMAL_COUNT:
            # 시너지 상승 구간: 50점 -> 100점
            score = 50 + (count / OPTIMAL_COUNT) * 50
        else:
            # 과다 경쟁 하락 구간: 100점 -> 20점 (완전 망함은 아니므로 하한선 20)
            score = 100 - ((count - OPTIMAL_COUNT) / (MAX_STORE_SATURATION - OPTIMAL_COUNT)) * 80
            score = max(score, 20.0)
 
        score = max(0.0, min(100.0, score))
        return score, confidence

    def _get_rent_info(self, area_code):
        """
        [데이터 5] 상권별 평균 임대료 정보 조회 (area_rent_info 활용)
        """
        query = "SELECT avg_rent_10k, is_mock FROM area_rent_info WHERE area_code = ?"
        result = self.db.execute_query(query, (area_code,))
        
        if result:
            rent = result[0]['avg_rent_10k']
            conf = "HIGH" if result[0]['is_mock'] == 0 else "MEDIUM"
            return rent, conf
        else:
            # 데이터 없으면 기본 200만원 추정치
            return 200, "LOW"

    def calculate_bep(self, scores, founder_data):
        """
        수익 모델(BEP: 손익분기점) 시뮬레이션
        추정 매출 - (임대료 + 원가 + 인건비) 기반 회수 기간 계산
        """
        rent = scores.get('rent_10k', 200)
        capital = int(founder_data.get('capital', 5000))
        
        # 단순화된 BEP 모델 (향후 고도화 가능)
        # 추정 월 매출 = (인구점수 + 수요점수 + 트렌드점수)/3 * 가중치
        avg_base = (scores['pop_score'] + scores['demand_score'] + scores['trend_score']) / 3
        est_revenue = avg_base * 50  # 1점당 50만원 매출 가정 (80점 상권 = 4000만원 매출)
        
        # 운영비 (원가 35% + 인건비 20% + 기타 10% + 임대료)
        operating_cost = (est_revenue * 0.65) + rent
        monthly_profit = est_revenue - operating_cost
        
        if monthly_profit <= 0:
            return "회수 불투명 (영업 손실 예상)"
        
        months = capital / monthly_profit
        return f"약 {round(months, 1)}개월 (월 예상 수익: {int(monthly_profit)}만원)"

    def get_success_probability(self, scores, founder_info):
        """통합 결과를 초정밀 리포트 문구로 변환 (LLM 배제, 데이터 기반 논리 분석)"""
        from core.engine.report_generator import ReportGenerator

        area_name = founder_info.get('current_area_name', '해당 상권')
        
        # BEP 계산 추가
        scores['bep_period'] = self.calculate_bep(scores, founder_info)
        
        # ── [데이터 기반 전문 논리 분석 생성] ──
        # WHY: 사용자의 요청에 따라 LLM을 배제하고 100% 데이터 로직에 기반한 고난도 분석을 수행함.
        
        logic_insights = []
        p, d, t, c = scores['pop_score'], scores['demand_score'], scores['trend_score'], scores['competition_score']
        
        # 분석 1: 수요-공급 밸런스
        if d > 70 and c < 40:
            logic_insights.append("현재 수요(검색량)는 폭발적이나 경쟁점의 집적도가 낮아 '선점 효과'를 누릴 수 있는 골든타임입니다.")
        elif d < 40 and c > 70:
            logic_insights.append("공급 과잉 상태에서 배후 수요가 받쳐주지 못하고 있습니다. 폐쇄적인 기존 고객층을 뺏어와야 하는 어려운 싸움이 예상됩니다.")

        # 분석 2: 인구-트렌드 불일치
        if t > p + 25:
            logic_insights.append(f"{area_name}은 현재 '거품형 트렌드' 구간입니다. 뜨내기 손님은 많으나 실질 거주 인구가 적으므로, 단기 이슈업보다는 재방문을 유도하는 강력한 브랜딩이 생존의 핵심입니다.")
        elif p > t + 25:
            logic_insights.append("상권의 기초 체력(상주인구)은 튼튼하나 온라인 버즈량이 낮습니다. 공격적인 인스타그램/블로그 마케팅만 효율적으로 진행해도 매출이 급등할 수 있는 '저평가 우량 상권'입니다.")

        # 분석 3: 비용-수익 효율
        rent = scores.get('rent_10k', 200)
        if rent > 400 and p < 60:
            logic_insights.append("높은 임대료 대비 보행 인구의 밀도가 낮습니다. 인건비를 최소화하는 키오스크/셀프 시스템 도입이 필수적입니다.")

        final_insight = " ".join(logic_insights) if logic_insights else "전반적으로 안정적인 지표를 보이고 있습니다. 상권의 기본 법칙을 충실히 따르는 운영을 권장합니다."

        # 리포트 생성기 호출
        report_text, pros, cons = ReportGenerator.generate(scores, founder_info, area_name)

        # 최종 텍스트 조립
        report_text = f"{report_text}\n\n📊 **데이터 기반 전문 지표 분석:**\n{final_insight}"

        return {
            "area_name": area_name,
            "probability": scores['final_score'],
            "final_score": scores['final_score'],
            "pop_score": scores['pop_score'],
            "demand_score": scores['demand_score'],
            "trend_score": scores['trend_score'],
            "competition_score": scores['competition_score'],
            "comment": report_text,
            "pros": pros,
            "cons": cons,
            "overall_confidence": scores.get('overall_confidence', 'UNKNOWN'),
            "bep_period": scores['bep_period'],
            "rent_10k": scores.get('rent_10k', 0)
        }
