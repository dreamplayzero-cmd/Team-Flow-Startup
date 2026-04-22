# tests/list_keywords.py
import sys
from pathlib import Path

# 프로젝트 루트를 path에 추가
sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

from core.engine.keyword_gen import KeywordGenerator

def show_all_keywords():
    gen = KeywordGenerator()
    keywords = gen.generate()
    
    print("\n" + "="*60)
    print(f"      MZ 상권분석 AI - 생성된 검색 키워드 목록 (총 {len(keywords)}개)")
    print("="*60)
    
    # 지역별로 묶어서 예시 출력
    areas = ["한남동", "이태원", "성수동", "연남동", "망원동", "가로수길"]
    
    for area in areas:
        area_kw = [k['keyword'] for k in keywords if area in k['keyword']]
        print(f"\n[{area}] 관련 키워드 (상위 5개 예시):")
        if not area_kw:
            print(" - 생성된 샘플(limit) 범위에 해당 지역 키워드가 없습니다.")
            continue
        shown = area_kw[:5]
        for k in shown:
            print(f" - {k}")
        print(f" ... 외 {max(len(area_kw) - len(shown), 0)}개 키워드 더 존재")

    print("\n" + "="*60)
    print("※ 이 모든 키워드가 네이버 트렌드와 블로그 분석에 순차적으로 활용됩니다.")
    print("="*60 + "\n")

if __name__ == "__main__":
    show_all_keywords()
