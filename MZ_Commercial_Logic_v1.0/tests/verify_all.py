import sys
from pathlib import Path
import sqlite3

sys.path.append(str(Path(__file__).resolve().parent.parent))
from data.db_manager import DatabaseManager
from config.settings import DB_PATH
from core.engine.scoring_engine import ScoringEngine

db = DatabaseManager()
print('='*60)
print(' 1 & 2. 데이터 수집 및 DB 적재 (깡통 여부) 완전 검증')
print('='*60)

tables = [
    ('인구 데이터 (population_data)', 'population_data'),
    ('네이버 트렌드 (keyword_trends)', 'keyword_trends'),
    ('블로그 감성 (blog_analysis)', 'blog_analysis'),
    ('상가(CSV) 데이터 (store_info)', 'store_info')
]

for label, t_name in tables:
    count_res = db.execute_query(f'SELECT COUNT(*) FROM {t_name}')
    count = count_res[0][0] if count_res else 0
    print(f'[{label}]')
    print(f' > 총 누적 데이터 수: {count:,} 건')
    
    if count > 0:
        sample = db.execute_query(f'SELECT * FROM {t_name} LIMIT 1')
        if sample:
            sample_dict = dict(sample[0])
            print(f' > 샘플 1건 예시: {sample_dict}')
    else:
        print(' > ⚠️ 깡통입니다 (데이터 없음)')
    print('-'*60)

print('\n' + '='*60)
print(' 3. 스코어링 엔진 작동 여부 (DB 데이터 기반 점수 산출)')
print('='*60)

engine = ScoringEngine()
test_founder_input = {
    'industry_category': '카페',
    'budget': 5000,
    'operation_type': '홀 중심',
    'target_audience': 'MZ',
    'selected_areas': ['1117068500', '1144071000'] # 성수동, 서교동(홍대)
}

try:
    print(f'선택된 지역 수: {len(test_founder_input["selected_areas"])}개')
    for area_code in test_founder_input["selected_areas"]:
        # 지역 이름 확보 (검증 스크립트용 하드코딩)
        area_name = "성수동" if area_code == "1120067000" else "서교동" if area_code == "1144071000" else "한남동" if area_code == "1117068500" else area_code
        
        test_founder_input['current_area_name'] = area_name
        res = engine.calculate_area_score(area_code, test_founder_input)
        
        total = res.get('final_score', 0)
        print(f'\n▶ 지역: {area_name} ({area_code})')
        print(f'  최종 점수: {total:.1f}점')
        print(f'  [세부 점수 내역]')
        print(f'   - 경쟁 포화도 (상가 DB 기반): {res.get("competition_score", 0):.1f}점')
        print(f'   - 인구 밀집도 (인구 DB 기반): {res.get("pop_score", 0):.1f}점')
        print(f'   - 수요 트렌드 점수 (검색/블로그 포함): {res.get("demand_score", 0):.1f}점')
        print(f'   - [보너스 로그]: {", ".join(res.get("bonus_logs", [])) or "없음"}')
        print(f'   - [페널티 로그]: {", ".join(res.get("penalty_logs", [])) or "없음"}')
        
    print('\n=> ✨ 엔진 계산 및 DB 로드 정상 작동 확인 완료!')
except Exception as e:
    print(f'엔진 계산 중 오류 발생: {e}')
