# data/populate_dna_master.py
import sqlite3
import os
import sys

# 프로젝트 루트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.engine.category_master import CategoryMaster

def populate():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mz_commercial_analysis.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("--- Industry Categories 데이터 적재 시작 ---")
    categories = [
        ('fnb_01', '카페', 'CF', '지역 소통의 중심이 되는 커뮤니티 공간'),
        ('fnb_02', '디저트', 'CF', '시각적 즐거움과 달콤함을 제공하는 공간'),
        ('fnb_03', '브런치', 'DN', '여유로운 오전의 프리미엄 식문화 공간'),
        ('fnb_04', '파스타', 'DN', '젊은 층의 데이트를 주도하는 세련된 식사 공간'),
        ('fnb_05', '고기집', 'DN', '전통적인 맛과 정겨운 분위기의 식사 공간'),
        ('fnb_06', '술집', 'DN', '상권의 밤을 책임지는 에너지 넘치는 공간'),
        ('fnb_07', '베이커리', 'CF', '매일 구워내는 신선함과 따뜻함이 있는 공간'),
        ('ret_01', '패션 편집샵', 'RS', '브랜드의 정체성과 스타일을 제안하는 큐레이션 공간'),
        ('ret_02', '라이프스타일/소품샵', 'RS', '공간의 분위기를 완성하는 감성적인 리테일 공간'),
        ('ret_03', '셀프 사진관', 'RS', 'MZ세대의 추억과 현재를 기록하는 레코드 공간')
    ]
    cursor.executemany("INSERT OR REPLACE INTO industry_categories VALUES (?, ?, ?, ?)", categories)

    print("--- Visual DNA Master 데이터 적재 시작 (16대 핵심 조합) ---")
    
    # 공통 프롬프트 베이스
    BASE_PROMPT = "Professional interior architectural photography, eye-level cinematic centered shot, wide-angle 24mm, soft afternoon natural side lighting, symmetrical composition, realistic materials and textures, high-end design."
    DNA_SS = "Harmonious Contrast between raw industrial concrete and delicate modern wood/metal furniture."
    DNA_HN = "Premium Curation with sophisticated refined textures, marble, and curated artistic details."

    dna_data = []
    
    # 성수(SS) 조합: 1120067000
    regions = [('1120067000', 'SS', DNA_SS), ('1117068500', 'HN', DNA_HN)]
    categories_gis = [('fnb_01', 'CF'), ('ret_01', 'RS')] # CF: Cafe, RS: Retail (for SS)
    # Note: For Hannam, RS is typically Dining (DN) as per prompt
    
    tones = [('WW', 'Warm Wood'), ('MB', 'Minimal Basic'), ('IV', 'Industrial Vintage'), ('MC', 'Modern Chic')]

    for area_code, reg_code, dna_msg in regions:
        # 성수는 Cafe/Retail, 한남은 Cafe/Dining (DN)
        if reg_code == 'SS':
            active_cats = [('fnb_01', 'CF'), ('ret_01', 'RS')]
        else:
            active_cats = [('fnb_01', 'CF'), ('fnb_03', 'DN')] # fnb_03 is Brunch/Dining

        for cat_id, gis_code in active_cats:
            for tone_code, tone_name in tones:
                dna_id = f"{reg_code}_{gis_code}_{tone_code}_01"
                prompt = f"{BASE_PROMPT} Projecting '{dna_msg}'. Style: {tone_name}."
                img_path = f"assets/visual_dna/{dna_id}.png"
                
                dna_data.append((dna_id, area_code, cat_id, tone_code, prompt, img_path))

    cursor.executemany("INSERT OR REPLACE INTO visual_dna_master VALUES (?, ?, ?, ?, ?, ?)", dna_data)
    
    conn.commit()
    conn.close()
    print(f"총 {len(dna_data)}건의 DNA 마스터 데이터가 적재되었습니다.")

if __name__ == "__main__":
    populate()
