import sys
import os
from pathlib import Path

# [Frozen Check] PyInstaller 상의 임시 경로와 실제 실행 경로 구분
if getattr(sys, 'frozen', False):
    # EXE 내부의 번들 이미지/JSON 등 (Read Only)
    BUNDLE_DIR = Path(sys._MEIPASS).resolve()
    # EXE 외부의 DB/로그 등 (Persistent)
    BASE_DIR = Path(os.path.dirname(sys.executable)).resolve()
else:
    BUNDLE_DIR = Path(__file__).resolve().parent.parent
    BASE_DIR = BUNDLE_DIR

# Database configuration (EXE 외부에서 유지되어야 함)
DB_DIR = BASE_DIR / "data"
DB_NAME = "mz_commercial_analysis.db"
DB_PATH = DB_DIR / DB_NAME

# Asset configuration (EXE 내부에 번들링)
ASSET_DIR = BUNDLE_DIR / "assets"
DNA_IMG_DIR = ASSET_DIR / "visual_dna"

# Logging configuration
LOG_DIR = BASE_DIR / "logs"
LOG_FILE = LOG_DIR / "app.log"

# SQL Configuration
SCHEMA_DIR = DB_DIR

# Ensure directories exist
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(DB_DIR, exist_ok=True)

# ============================================================
# [AREA_MAP] 단일 진실 공급원 (Single Source of Truth)
# WHY: 지역 목록이 5개 파일에 분산 관리되던 문제를 해결.
#      새 지역 추가 시 이 딕셔너리 한 곳만 수정하면 됨.
# 구조: { 표시명: { code, province, city, district } }
# ============================================================
AREA_MAP = {
    "한남동":   {"code": "1117068500", "province": "서울특별시", "city": "용산구",  "district": "한남동"},
    "이태원":   {"code": "1117065000", "province": "서울특별시", "city": "용산구",  "district": "이태원제1동"},
    "성수동":   {"code": "1120067000", "province": "서울특별시", "city": "성동구",  "district": "성수2가제3동"},
    "연남동":   {"code": "1144071000", "province": "서울특별시", "city": "마포구",  "district": "연남동"},
    "망원동":   {"code": "1144069000", "province": "서울특별시", "city": "마포구",  "district": "망원제1동"},
    "가로수길": {"code": "1168051000", "province": "서울특별시", "city": "강남구",  "district": "신사동"},
    "샤로수길": {"code": "1162058500", "province": "서울특별시", "city": "관악구",  "district": "낙성대동"},
}

