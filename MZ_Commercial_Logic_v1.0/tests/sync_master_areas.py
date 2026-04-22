"""
master_areas 동기화 스크립트
settings.py AREA_MAP 기준으로 미등록 지역을 자동 삽입
"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from data.db_manager import DatabaseManager
from config.settings import AREA_MAP

db = DatabaseManager()

# 현재 등록된 지역 확인 (WHY: execute_query는 항상 fetchall() 반환)
existing = db.execute_query("SELECT area_code, area_name FROM master_areas") or []
print("=== 현재 master_areas ===")
existing_codes = set()
for row in existing:
    print(f"  {row[0]} | {row[1]}")
    existing_codes.add(row[0])

print()
print("=== AREA_MAP 기준 누락 지역 확인 ===")
missing = []
for name, info in AREA_MAP.items():
    code = info['code']
    if code not in existing_codes:
        missing.append((
            code,
            name,
            info.get('province', ''),
            info.get('city', ''),
            info.get('district', name)
        ))
        print(f"  [MISSING] {code} | {name}")
    else:
        print(f"  [OK]      {code} | {name}")

# 누락된 지역 삽입
if missing:
    print(f"\n=> {len(missing)}개 누락 지역 삽입 중...")
    for code, name, province, city, district in missing:
        try:
            db.execute_query(
                """
                INSERT OR IGNORE INTO master_areas
                (area_code, area_name, province, city, district)
                VALUES (?, ?, ?, ?, ?)
                """,
                (code, name, province, city, district)
            )
            print(f"  [INSERTED] {code} | {name}")
        except Exception as e:
            print(f"  [ERROR] {code} | {name} -> {e}")
else:
    print("\n=> 모든 지역이 이미 등록되어 있습니다!")

# 최종 확인
final = db.execute_query("SELECT area_code, area_name FROM master_areas") or []
print(f"\n=== 최종 master_areas ({len(final)}개) ===")
for row in final:
    print(f"  {row[0]} | {row[1]}")
