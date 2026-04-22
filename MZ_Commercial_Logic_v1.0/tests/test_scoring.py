# tests/test_scoring.py
import sys
from pathlib import Path

# 프로젝트 루트를 path에 추가
sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

from core.engine.scoring_engine import ScoringEngine

def test_scoring_flow():
    print("\n" + "="*50)
    print("      Scoring Engine Logic Test")
    print("="*50)
    
    engine = ScoringEngine()
    
    # 1. 가상의 창업자 정보 (현재 엔진 스펙: dict 전체를 인자로 전달)
    founder_data = {
        "industry": "카페",
        "age": "28",
        "capital": "5000",       # 만원 단위
        "experience": "3",
        "target": "2030 MZ",
        "op_type": "홀 중심",
        "op_time": "올데이",
        "areas": ["성수동"],
        "current_area_name": "성수동"
    }
    
    # 2. 특정 지역(성수동)에 대한 점수 계산 시뮬레이션
    TEST_AREA_CODE = "1120067000"
    
    print(f"Calculating score for Area: 성수동({TEST_AREA_CODE}), Industry: {founder_data['industry']}")
    
    # [수정] calculate_area_score(area_code, founder_data) — dict 전체를 두 번째 인자로 전달
    raw_scores = engine.calculate_area_score(TEST_AREA_CODE, founder_data)
    
    print("\n--- Raw Score Components ---")
    print(f" - Pop Score         : {raw_scores['pop_score']}")
    print(f" - Demand Score      : {raw_scores['demand_score']}")
    print(f" - Trend Score       : {raw_scores['trend_score']}")
    print(f" - Competition Score : {raw_scores['competition_score']}")
    print(f" -> FINAL SCORE      : {raw_scores['final_score']}")
    print(f" - Bonuses           : {raw_scores['bonus_logs']}")
    print(f" - Penalties         : {raw_scores['penalty_logs']}")
    
    # 3. 리포트 생성 테스트 — get_success_probability(scores_dict, founder_info)
    report = engine.get_success_probability(raw_scores, founder_data)
    
    print("\n--- Generated Analysis Report ---")
    safe_comment = report['comment'].encode('ascii', errors='replace').decode('ascii')
    safe_pros    = report['pros'].encode('ascii', errors='replace').decode('ascii')
    safe_cons    = report['cons'].encode('ascii', errors='replace').decode('ascii')
    print(f" > Probability : {report['probability']}")
    print(f" > Comment     : {safe_comment[:80]}...")
    print(f" > Pros        : {safe_pros[:60]}...")
    print(f" > Cons        : {safe_cons[:60]}...")
    print("="*50 + "\n")
    
    # 4. 기본 검증 (assert)
    assert 0 < raw_scores['final_score'] <= 100, "Final score must be in range 1~100"
    assert report['comment'], "Comment should not be empty"
    print("[PASS] All assertions passed!")

if __name__ == "__main__":
    test_scoring_flow()
