# core/engine/scoring_engine.py
import logging
from data.db_manager import DatabaseManager
from core.engine.category_master import CategoryMaster

# 로깅 설정
logger = logging.getLogger(__name__)

class ScoringEngine:
    """4가지 핵심 데이터(인구, 상가, 블로그, 검색)를 통합 분석하는 엔진"""
    
    def __init__(self):
        self.db = DatabaseManager()

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
        
        # 다중 지역 코드를 콤마로 연결해서 문자열로 저장
        areas_str = ",".join(data.get('areas', []))
        
        # 숫자형 데이터 파싱
        try: budget = int(data.get('capital', '0'))
        except: budget = 0
        try: age = int(data.get('age', '0'))
        except: age = 0
        try: exp = int(data.get('experience', '0'))
        except: exp = 0
            
        memo = "DB 저장 완료 (자동)"
        
        params = (
            user_id, areas_str, industry, budget,
            age, data.get('gender', ''), exp, data.get('target', ''),
            data.get('op_type', ''), data.get('op_time', ''), memo
        )
        try:
            self.db.execute_query(query, params)
            logger.info(f"방문 기록 저장 완료: Areas={areas_str}, Ind={industry}, Budget={budget}")
        except Exception as e:
            logger.error(f"히스토리 저장 실패: {e}")

    def calculate_area_score(self, area_code, founder_data):
        """
        4대 데이터 기반 통합 점수 산출 (창업자 상세 조건 반영)
        """
        industry_category = founder_data.get('industry', '')
        op_type = founder_data.get('op_type', '홀 중심')
        try: exp = int(founder_data.get('experience', '0'))
        except: exp = 0
        try: capital = int(founder_data.get('capital', '0'))
        except: capital = 0

        logger.info(f"Integrated Scoring 시작: Area={area_code}, Industry={industry_category}")
        
        # 1. 인구 점수 (Population)
        pop_score = self._get_population_score(area_code)
        
        # 2. 수요 점수 (Naver Search - 고도화 연산 적용)
        demand_score = self._get_demand_score(area_code, founder_data)
        
        # 3. 트렌드 점수 (Blog Sentiment)
        trend_score = self._get_trend_score(area_code, industry_category)
        
        # 4. 경쟁 점수 (Store Info)
        competition_score = self._get_competition_score(area_code, industry_category)
        
        # --- 창업자 조건 기반 동적 가중치 (Dynamic Weights) ---
        w_pop, w_dem, w_tre, w_com = 0.25, 0.25, 0.25, 0.25
        if op_type == "배달 중심":
            w_pop, w_dem, w_tre, w_com = 0.10, 0.35, 0.20, 0.35
        elif op_type == "테이크아웃 중점":
            w_pop, w_dem, w_tre, w_com = 0.40, 0.15, 0.30, 0.15

        final_score = (pop_score * w_pop) + (demand_score * w_dem) + (trend_score * w_tre) + (competition_score * w_com)

        # 로그 저장을 위한 리스트
        bonus_logs = []
        penalty_logs = []

        # [Rule 1] 생초보 + 핏빛 레드오션 페널티
        if exp < 1 and competition_score < 30:
            final_score -= 10.0
            penalty_logs.append("경력 부족 및 레드오션: 초보자가 살아남기 힘든 초경쟁 상태입니다 (-10점).")
            
        elif exp >= 3: # 베테랑 보너스 (기존 유지)
            final_score += 5.0
            bonus_logs.append("베테랑 보너스: 3년 이상 경력에 의한 운영 안정성 가산 (+5점).")

        # [Rule 2] 예산 파산 리스크 (Rent vs Capital Mismatch)
        target_op_time = founder_data.get('op_time', '')
        # 핵심 3대 상권: 한남, 성수, 가로수길 (area_code 기준이거나 name 기준)
        # 1117068500: 한남동, 1120067000: 성수동, 1168051000: 가로수길
        premium_areas = ["1117068500", "1120067000", "1168051000"]
        if area_code in premium_areas and capital < 5000:
            if op_type not in ["배달 중심", "테이크아웃 중점"]:
                final_score -= 8.0
                penalty_logs.append("재무 위험: 1A급 상권 홀 매장 진입 시 해당 예산(5천만 이하)으로 임대료를 버티기 어렵습니다 (-8점).")
                
        elif capital >= 10000: # 예산 넉넉 보너스
            final_score += 3.0
            bonus_logs.append("자본 버퍼 넉넉함: 마케팅 및 위기 대응이 가능한 탄탄한 예산 (+3점).")

        # [Rule 3] 심야 영업 궁합 
        # 이태원(1117065000), 망원동(1144069000), 연남동(1144071000)
        night_bonus_areas = ["1117065000", "1117068500"] # 이태원, 한남
        night_penalty_areas = ["1144069000", "1144071000"] # 망원, 연남 (주거 베이스)
        
        if target_op_time == "심야 영업":
            if area_code in night_bonus_areas:
                final_score += 5.0
                bonus_logs.append("황금 궁합: 유흥가 기반 상권과 심야 영업은 최상의 시너지입니다 (+5점).")
            elif area_code in night_penalty_areas:
                final_score -= 5.0
                penalty_logs.append("영업 궁합 미스: 주거지 기반 상권에서 심야 영업은 유동인구가 부족합니다 (-5점).")

        # [Rule 4] 젠트리피케이션 (상권 몰락) 리스크 검증
        if trend_score < 40 and demand_score < 50:
            final_score -= 10.0
            penalty_logs.append("상권 쇠퇴 경고: 과거에 비해 검색량과 트렌드 지수가 모두 폭락 중인 위험 지역입니다 (-10점).")

        # [Rule 5] 리테일-F&B 클러스터링 시너지 (New)
        sync_bonus, sync_msg = self._get_clustering_bonus(area_code, industry_category)
        if sync_bonus > 0:
            final_score += sync_bonus
            bonus_logs.append(sync_msg)

        # 최솟값, 최댓값 보정
        final_score = max(min(final_score, 99.9), 1.0)
        
        return {
            "final_score": round(final_score, 1),
            "pop_score": round(pop_score, 1),
            "demand_score": round(demand_score, 1),
            "trend_score": round(trend_score, 1),
            "competition_score": round(competition_score, 1),
            "bonus_logs": bonus_logs,
            "penalty_logs": penalty_logs
        }

    def _get_deterministic_mock(self, area_code, keyword, base, variance):
        """DB에 데이터가 없을 때 지역/업종별 고유의 예측 가상치 생성"""
        import hashlib
        unique_str = f"{area_code}_{keyword}"
        h_val = int(hashlib.md5(unique_str.encode()).hexdigest(), 16)
        noise = (h_val % 100) / 100.0  # 0.0 ~ 1.0
        return base + (noise * variance)

    def _get_population_score(self, area_code):
        """[데이터 1] 행안부 인구 데이터 기반 점수"""
        query = "SELECT SUM(population_count) as total FROM population_data WHERE area_code = ?"
        result = self.db.execute_query(query, (area_code,))
        pop_count = result[0]['total'] if result[0]['total'] else 0
        if pop_count == 0:
            score = self._get_deterministic_mock(area_code, "pop", 40, 50) # 40~90점
        else:
            score = min((pop_count / 10000) * 100, 100)
        return score

    def _get_demand_score(self, area_code, founder_data):
        """[데이터 2] 진짜 수요(High-Intent) 판별 고도화 연산"""
        industry_category = founder_data.get('industry', '')
        target = founder_data.get('target', '상관없음')
        op_time = founder_data.get('op_time', '상관없음')
        
        query = "SELECT keyword, search_volume FROM keyword_trends WHERE area_code = ? AND keyword LIKE ?"
        results = self.db.execute_query(query, (area_code, f"%{industry_category}%"))
        
        if not results:
            return self._get_deterministic_mock(area_code, industry_category, 30, 60) # 30~90점
            
        # 1. 창업자 타겟에 맞춘 고관여(High-Intent) 단어 사전 구축
        high_intent_words = []
        if target == "1020 학생":
            high_intent_words.extend(["가성비", "인스타", "디저트", "핫플", "줄서기"])
        elif target == "2030 MZ":
            high_intent_words.extend(["분위기", "데이트", "와인", "신상", "추천", "감성"])
        elif target == "3040 직장인" or op_time == "런치 타임 (직장인)":
            high_intent_words.extend(["회식", "점심", "혼밥", "프라이빗", "룸", "예약"])
        elif target == "가족단위":
            high_intent_words.extend(["주차", "가족", "아이", "단체"])
            
        # 심야 영업 특화 키워드
        if op_time == "심야 영업":
            high_intent_words.extend(["심야", "새벽", "늦게까지", "24시간"])
        
        generic_vol = 0
        intent_vol = 0
        
        for row in results:
            kw = row['keyword']
            vol = row['search_volume'] if row['search_volume'] else 0
            
            # 2. 키워드에 high_intent 단어가 포함되어 있으면 폭발적 가중치(3배) 부여 (Window Shopper 필터링)
            is_intent = any(word in kw for word in high_intent_words)
            if is_intent:
                intent_vol += (vol * 3.0)
            else:
                generic_vol += vol
                
        total_adjusted_vol = intent_vol + generic_vol
        
        # 만일 관련 데이터가 전혀 없다면 가상 점수 (고도화 연산 버전) 발동
        if total_adjusted_vol == 0:
            return self._get_deterministic_mock(area_code, f"{industry_category}_adv", 20, 50)
            
        # 3. 최대 100점으로 정규화 (모수치는 전국 최상위권 기준 약 5만으로 세팅)
        score = min((total_adjusted_vol / 50000) * 100, 100)
        return score

    def _get_trend_score(self, area_code, industry_category):
        """[데이터 3] 블로그 감성 분석 점수"""
        query = "SELECT AVG(sentiment_score) as avg_sent FROM blog_analysis WHERE area_code = ?"
        result = self.db.execute_query(query, (area_code,))
        avg_sent = result[0]['avg_sent'] if result[0]['avg_sent'] else 0
        if avg_sent == 0:
            avg_sent = self._get_deterministic_mock(area_code, f"{industry_category}_sent", 0.3, 0.6) # 0.3~0.9
        return avg_sent * 100

    def _get_competition_score(self, area_code, industry_category):
        """[데이터 4] 상가 정보 기반 경쟁 역수 점수 (선형 정규화)
        WHY: 기존 1/(count+1)*100 역수 공식은 Mock 경쟁 수(10~210)를 넣으면
             결과가 0~9점으로 몰려 Rule4 페널티가 항상 발동되는 편향 버그 발생.
             선형 정규화(0개=100점, MAX_SATURATION개=0점)로 교체.
        """
        MAX_STORE_SATURATION = 200  # 이 수 이상이면 완전 레드오션(0점)
        query = "SELECT COUNT(*) as cnt FROM store_info WHERE area_code = ? AND category_medium LIKE ?"
        result = self.db.execute_query(query, (area_code, f"%{industry_category}%"))
        count = result[0]['cnt'] if result[0]['cnt'] else 0
        if count == 0:
            # 가상 경쟁 매장 수: 10~110개 범위로 축소하여 점수 편향 방지
            count = self._get_deterministic_mock(area_code, f"{industry_category}_comp", 10, 100)
        score = max(0.0, 100.0 * (1.0 - count / MAX_STORE_SATURATION))
        return score

    def _get_clustering_bonus(self, area_code, industry_category):
        """업종 간 클러스터링 시너지 분석 및 보너스 산출"""
        info = CategoryMaster.get_info(industry_category)
        cluster = info["cluster"]
        
        # 1. 현재 지역의 모든 업종 분포 조회
        query = "SELECT DISTINCT category_medium FROM store_info WHERE area_code = ?"
        results = self.db.execute_query(query, (area_code,))
        existing_categories = [row['category_medium'] for row in results]
        
        # 2. 클러스터별 시너지 규칙
        bonus = 0.0
        msg = ""
        
        if cluster == "Premium Curation":
            # 브런치나 패션 편집샵이 있으면 보너스
            if any(c in ["브런치", "패션 편집샵", "카페"] for c in existing_categories):
                bonus = 5.0
                msg = "클러스터 시너지 [Premium Curation]: 프리미엄 소비층이 정착된 상권으로 리테일-F&B 연계 효과가 기대됩니다 (+5점)."
        
        elif cluster == "Young Date Course":
            # 파스타나 셀프 사진관이 있으면 보너스
            if any(c in ["파스타", "셀프 사진관", "디저트"] for c in existing_categories):
                bonus = 5.0
                msg = "클러스터 시너지 [Young Date Course]: MZ세대의 데이트 동선이 확보된 상권으로 높은 집객력이 예상됩니다 (+5점)."
        
        elif cluster == "Social Hub":
            # 카페, 디저트, 베이커리 밀집 시너지
            cafe_count = sum(1 for c in existing_categories if c in ["카페", "디저트", "베이커리"])
            if cafe_count >= 2:
                bonus = 3.0
                msg = "클러스터 시너지 [Social Hub]: 카페 거리가 이미 형성되어 있어 목적지 방문객 유입이 유리합니다 (+3점)."

        return bonus, msg

    def get_success_probability(self, scores, founder_info):
        """통합 결과를 초정밀 리포트 문구로 변환"""
        from core.engine.report_generator import ReportGenerator
        
        area_name = founder_info.get('current_area_name', '해당 상권')
        report_text, pros, cons, dna_result = ReportGenerator.generate(scores, founder_info, area_name)
        
        return {
            "probability": scores['final_score'],
            "comment": report_text,
            "pros": pros,
            "cons": cons,
            "dna_result": dna_result
        }
