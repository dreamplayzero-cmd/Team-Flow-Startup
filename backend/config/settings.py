import os
import sys
from pathlib import Path

# [UPDATED] Robust path handling for Onedir (Folder) environment
if getattr(sys, 'frozen', False):
    # In 'onedir' mode, _MEIPASS is the folder containing the EXE and all bundled files
    BUNDLE_DIR = Path(sys._MEIPASS)
    # DATA_DIR: Use the directory where the EXE is located
    DATA_DIR = Path(sys.executable).parent
    IS_FROZEN = True
else:
    BUNDLE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BUNDLE_DIR
    IS_FROZEN = False

# Base directory for bundled read-only assets (e.g., config/area_attributes.json)
BASE_DIR = BUNDLE_DIR

# --- Boot Debug Logging (Only for Frozen state to track path issues) ---
if IS_FROZEN:
    try:
        with open(DATA_DIR / "boot_debug.log", "w", encoding="utf-8") as f:
            f.write(f"BUNDLE_DIR: {BUNDLE_DIR}\n")
            f.write(f"DATA_DIR: {DATA_DIR}\n")
            f.write(f"EXECUTABLE: {sys.executable}\n")
            f.write(f"CWD: {os.getcwd()}\n")
    except:
        pass

# Base directory for read-only assets
BASE_DIR = BUNDLE_DIR

# Database configuration (Writable)
DB_DIR = DATA_DIR / "data"
DB_NAME = "mz_commercial_analysis.db"
DB_PATH = DB_DIR / DB_NAME

# Logging configuration (Writable)
LOG_DIR = DATA_DIR / "logs"
LOG_FILE = LOG_DIR / "app.log"

# SQL Configuration
SCHEMA_DIR = BUNDLE_DIR / "data"  # Schema is bundled

# --- Critical: Ensure writable directories exist BEFORE any logging handlers start ---
try:
    os.makedirs(LOG_DIR, exist_ok=True)
    os.makedirs(DB_DIR, exist_ok=True)
except Exception as e:
    # If this fails, we want to know why
    if IS_FROZEN:
        with open(DATA_DIR / "boot_debug.log", "a", encoding="utf-8") as f:
            f.write(f"CRITICAL ERROR: Failed to create directories: {e}\n")


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

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCAEXXT8cgh7WVi0C0-xr7eOpFifwoXOvk")
GEMINI_MODEL_NAME = "gemini-pro"
GEMINI_MAX_CALLS = 100
GEMINI_LIMIT_ENABLED = True
