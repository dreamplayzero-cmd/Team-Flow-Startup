"""
master_areas 테이블 마이그레이션 + AREA_MAP 동기화
- area_name 컬럼 추가 (스키마 변경)
- AREA_MAP 기준 7개 지역 등록
실행: python tests/migrate_master_areas.py
"""
import sys
import sqlite3
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from config.settings import AREA_MAP, DB_PATH

print(f"DB 경로: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA foreign_keys = OFF;")  # 마이그레이션 중 FK 잠시 비활성화
cursor = conn.cursor()

# 1. area_name 컬럼 존재 여부 확인
cursor.execute("PRAGMA table_info(master_areas)")
columns = [row[1] for row in cursor.fetchall()]
print(f"현재 컬럼: {columns}")

if "area_name" not in columns:
    print("=> area_name 컬럼 추가 중...")
    cursor.execute("ALTER TABLE master_areas ADD COLUMN area_name TEXT DEFAULT ''")
    conn.commit()
    print("=> area_name 컬럼 추가 완료!")
else:
    print("=> area_name 컬럼 이미 존재")

# 2. AREA_MAP 기준 지역 INSERT OR REPLACE
print("\n=> AREA_MAP 기준 7개 지역 등록 중...")
for name, info in AREA_MAP.items():
    code = info['code']
    addr = info.get('address', f'서울특별시 {name}')
    cursor.execute(
        """INSERT OR REPLACE INTO master_areas 
           (area_code, area_name, province, city, district)
           VALUES (?, ?, ?, ?, ?)""",
        (code, name, '서울특별시', addr, name)
    )
    print(f"  [OK] {code} | {name}")

conn.commit()
conn.execute("PRAGMA foreign_keys = ON;")

# 3. 최종 확인
cursor.execute("SELECT area_code, area_name FROM master_areas")
rows = cursor.fetchall()
print(f"\n=== 최종 master_areas ({len(rows)}개) ===")
for row in rows:
    print(f"  {row[0]} | {row[1]}")

conn.close()
print("\n동기화 완료!")
