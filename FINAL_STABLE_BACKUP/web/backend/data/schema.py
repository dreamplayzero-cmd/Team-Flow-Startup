# data/schema.py

CREATE_MASTER_AREAS = """
CREATE TABLE IF NOT EXISTS master_areas (
    area_code TEXT PRIMARY KEY,
    area_name TEXT NOT NULL DEFAULT '',  -- 상권 이름 (예: 성수동, 한남동)
    province TEXT NOT NULL DEFAULT '',   -- 시/도
    city TEXT NOT NULL DEFAULT '',       -- 시/군/구
    district TEXT NOT NULL DEFAULT '',   -- 동
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

CREATE_POPULATION_DATA = """
CREATE TABLE IF NOT EXISTS population_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_code TEXT NOT NULL,
    age_group TEXT NOT NULL, -- e.g., 'MZ', '20s', '30s'
    gender TEXT,
    population_count INTEGER DEFAULT 0,
    reference_date DATE,
    FOREIGN KEY (area_code) REFERENCES master_areas (area_code) ON DELETE CASCADE
);
"""

CREATE_STORE_INFO = """
CREATE TABLE IF NOT EXISTS store_info (
    store_id TEXT PRIMARY KEY,
    area_code TEXT NOT NULL,
    store_name TEXT NOT NULL,
    category_large TEXT,
    category_medium TEXT,
    category_small TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    FOREIGN KEY (area_code) REFERENCES master_areas (area_code) ON DELETE CASCADE
);
"""

CREATE_KEYWORD_TRENDS = """
CREATE TABLE IF NOT EXISTS keyword_trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_code TEXT NOT NULL,
    keyword TEXT NOT NULL,
    search_volume INTEGER DEFAULT 0,
    search_platform TEXT, -- e.g., 'Naver'
    target_month DATE,
    FOREIGN KEY (area_code) REFERENCES master_areas (area_code) ON DELETE CASCADE
);
"""

CREATE_BLOG_ANALYSIS = """
CREATE TABLE IF NOT EXISTS blog_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_code TEXT NOT NULL,
    keyword TEXT NOT NULL,
    mention_count INTEGER DEFAULT 0,
    sentiment_score REAL, -- 0.0 to 1.0 (Positive)
    analysis_date DATE,
    FOREIGN KEY (area_code) REFERENCES master_areas (area_code) ON DELETE CASCADE
);
"""

CREATE_FOUNDER_INPUTS = """
CREATE TABLE IF NOT EXISTS founder_inputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT, 
    -- 기존 필수값
    area_code TEXT NOT NULL,         -- 선택된 지역 콤마(,) 기준 최대 4개 저장
    industry_category TEXT NOT NULL, 
    budget INTEGER,
    
    -- 신규 추가 조건값
    age INTEGER,                     -- 창업자 나이
    gender TEXT,                     -- 창업자 성별 (M/F/All)
    experience_years INTEGER,        -- 동종업계 경력(년)
    target_audience TEXT,            -- 주 수요층 (예: 1020, MZ, 직장인, 가족단위)
    
    -- 안티그래비티 추가 추천 조건값
    operation_type TEXT,             -- 매장 형태 (홀 중심 / 배달 중심 / 테이크아웃)
    target_time TEXT,                -- 주 영업시간 (점심 / 저녁 / 야간)
    
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

CREATE_INDUSTRY_CATEGORIES = """
CREATE TABLE IF NOT EXISTS industry_categories (
    category_id TEXT PRIMARY KEY,
    category_name TEXT NOT NULL,
    gis_code TEXT NOT NULL, -- e.g., 'CF', 'RS', 'DN'
    description TEXT
);
"""

CREATE_VISUAL_DNA_MASTER = """
CREATE TABLE IF NOT EXISTS visual_dna_master (
    dna_id TEXT PRIMARY KEY, -- e.g., 'SS_CF_WW_01'
    area_code TEXT,          -- e.g., '1120067000' (Seongsu)
    industry_id TEXT,        -- FK to industry_categories
    tone_code TEXT,          -- e.g., 'WW', 'MB', 'IV', 'MC'
    prompt_en TEXT,
    image_path TEXT,
    FOREIGN KEY (area_code) REFERENCES master_areas (area_code),
    FOREIGN KEY (industry_id) REFERENCES industry_categories (category_id)
);
"""


TABLE_SCHEMAS = [
    CREATE_MASTER_AREAS,
    CREATE_POPULATION_DATA,
    CREATE_STORE_INFO,
    CREATE_KEYWORD_TRENDS,
    CREATE_BLOG_ANALYSIS,
    CREATE_FOUNDER_INPUTS,
    CREATE_INDUSTRY_CATEGORIES,
    CREATE_VISUAL_DNA_MASTER
]

# Indexes for performance
INDEXES = [
    "CREATE INDEX IF NOT EXISTS idx_pop_area ON population_data(area_code);",
    "CREATE INDEX IF NOT EXISTS idx_store_area ON store_info(area_code);",
    "CREATE INDEX IF NOT EXISTS idx_kw_area ON keyword_trends(area_code);",
    "CREATE INDEX IF NOT EXISTS idx_blog_area ON blog_analysis(area_code);"
]
