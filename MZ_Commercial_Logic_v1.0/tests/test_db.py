# tests/test_db.py
import sys
import os
from pathlib import Path

# 프로젝트 루트를 path에 추가
sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

from data.db_manager import DatabaseManager

def test_initialization():
    print("--- DB 초기화 테스트 시작 ---")
    db = DatabaseManager()
    
    # 테이블 목록 확인
    query = "SELECT name FROM sqlite_master WHERE type='table';"
    tables = db.execute_query(query)
    
    table_names = [table['name'] for table in tables]
    expected_tables = [
        'master_areas', 'population_data', 'store_info', 
        'keyword_trends', 'blog_analysis', 'founder_inputs'
    ]
    
    for table in expected_tables:
        if table in table_names:
            print(f"[OK] 테이블 존재: {table}")
        else:
            print(f"[FAIL] 테이블 누락: {table}")

def test_foreign_key_constraint():
    print("\n--- 외래 키 제약 조건 테스트 ---")
    db = DatabaseManager()
    
    # master_areas에 없는 area_code를 참조하여 데이터 삽입 시도 (실패해야 함)
    # execute_query는 예외를 삼키고 None을 반환하므로 반환값으로 판정한다.
    query = "INSERT INTO population_data (area_code, age_group, population_count) VALUES (?, ?, ?)"
    result = db.execute_query(query, ('99999', 'MZ', 100))
    if result is None:
        print("[OK] 외래 키 제약 조건 정상 작동")
    else:
        print("[FAIL] 외래 키 제약 조건이 작동하지 않습니다. (에러 없이 삽입됨)")

if __name__ == "__main__":
    # tests 폴더 자동 생성 및 실행
    test_initialization()
    test_foreign_key_constraint()
