import os
import shutil
import sqlite3
from PIL import Image, ImageEnhance

# 경로 설정
BASE_DIR = r'c:\Users\User\Desktop\MZ_Commercial_Logic_v1.0'
SRC_DIR = os.path.join(BASE_DIR, 'Frontend_Curation_Package')
DST_DIR = os.path.join(BASE_DIR, 'assets', 'visual_dna')
DB_PATH = os.path.join(BASE_DIR, 'data', 'mz_commercial_analysis.db')

if not os.path.exists(DST_DIR):
    os.makedirs(DST_DIR, exist_ok=True)

def apply_consistency(img_path):
    """이미지에 일관된 필터 적용 (따뜻한 톤, 대비 강화)"""
    try:
        with Image.open(img_path) as img:
            img = img.convert('RGB')
            # 1. 크기 통일 (높이 600 기준, 비율 유지)
            target_h = 600
            w, h = img.size
            target_w = int(w * (target_h / h))
            img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            # 2. 대비 살짝 강화 (1.2)
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.2)
            
            # 3. 따뜻한 톤 부여 (Red 채널 +5%, Blue 채널 -5%)
            r, g, b = img.split()
            r = r.point(lambda i: min(255, int(i * 1.05)))
            b = b.point(lambda i: int(i * 0.95))
            img = Image.merge('RGB', (r, g, b))
            
            # 덮어쓰기 저장
            img.save(img_path, 'JPEG', quality=95)
            return True
    except Exception as e:
        print(f"Error filtering {img_path}: {e}")
        return False

# 파일명 매핑 (사용자 파일명 -> 시스템 ID 매칭용 키워드)
mapping = {
    'SS_WW_01': 'SS_WW_01_Seongsu_Cafe_WarmWood.jpg',
    'SS_WW_02': 'SS_WW_02_Seongsu_Retail_WarmWood.jpg',
    'SS_MN_01': 'SS_MN_01_Seongsu_Cafe_MinimalBasic.jpg',
    'SS_MN_02': 'SS_MN_02_Seongsu_EditShop_MinimalBasic.jpg',
    'SS_ID_01': 'SS_ID_01_Seongsu_Dining_IndustrialVintage.jpg',
    'SS_ID_02': 'SS_ID_02_Seongsu_Cafe_IndustrialVintage.jpg',
    'SS_MC_01': 'SS_MC_01_Seongsu_EditShop_ModernChic.jpg',
    'SS_MC_02': 'SS_MC_02_Seongsu_PhotoStudio_ModernChic.jpg',
    'HN_WW_01': 'HN_WW_01_Hannam_Cafe_WarmWood.jpg',
    'HN_WW_02': 'HN_WW_02_Hannam_Dining_WarmWood.jpg',
    'HN_MN_01': 'HN_MN_01_Hannam_EditShop_MinimalBasic.jpg',
    'HN_MN_02': 'HN_MN_02_Hannam_Cafe_MinimalBasic.jpg',
    'HN_ID_01': 'HN_ID_01_Hannam_Dining_IndustrialVintage.jpg',
    'HN_ID_02': 'HN_ID_02_Hannam_Cafe_IndustrialVintage.jpg',
    'HN_MC_01': 'HN_MC_01_Hannam_Dining_ModernChic.jpg',
    'HN_MC_02': 'HN_MC_02_Hannam_EditShop_ModernChic.jpg'
}

def sync():
    print(f"--- 이미지 동기화 및 필터링 시작 ---")
    if not os.path.exists(SRC_DIR):
        print(f"Source directory not found: {SRC_DIR}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    count = 0
    for sys_id_base, filename in mapping.items():
        src_path = os.path.join(SRC_DIR, filename)
        if os.path.exists(src_path):
            # 1. 파일 복사
            dst_path = os.path.join(DST_DIR, filename)
            shutil.copy2(src_path, dst_path)
            
            # 2. 필터 보정 (통일성 부여)
            apply_consistency(dst_path)
            
            # 3. DB 업데이트
            # reg: SS or HN / tone: WW, MN, ID, MC
            reg = sys_id_base.split('_')[0]
            tone_code = sys_id_base.split('_')[1]
            
            # Tones in DB are: WW, MB, IV, MC
            # Our mapping MN -> MB
            db_tone = "MB" if tone_code == "MN" else ("IV" if tone_code == "ID" else tone_code)
            
            rel_path = f"assets/visual_dna/{filename}"
            # query: region and tone matching
            sql = "UPDATE visual_dna_master SET image_path = ? WHERE dna_id LIKE ?"
            match_pattern = f"{reg}%{db_tone}%"
            cursor.execute(sql, (rel_path, match_pattern))
            print(f"Synced & Filtered: {filename} -> Pattern: {match_pattern}")
            count += 1
        else:
            print(f"Missing source file: {filename}")

    conn.commit()
    conn.close()
    print(f"완료! 총 {count}개의 이미지가 처리되었습니다.")

if __name__ == "__main__":
    sync()
