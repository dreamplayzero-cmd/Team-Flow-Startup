"""
행안부 인구 API + 소상공인 상가 API 실제 통신 검증
실행: python tests/test_public_apis.py
"""
import os, sys, json, requests
from pathlib import Path
from urllib.parse import unquote

sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output
from dotenv import load_dotenv

ensure_utf8_output()
load_dotenv()

raw_key = os.getenv("PUBLIC_DATA_API_KEY", "")
API_KEY = unquote(raw_key)  # Decoding Key 사용 필수

def test_population_api():
    """행안부: 성수동(1120067000) 인구 조회"""
    print("\n=== [1] 행안부 인구 API ===")
    url = "https://apis.data.go.kr/1741000/admmSexdAgePpltn/selectAdmmSexdAgePpltn"
    params = {
        "serviceKey": API_KEY,
        "type": "json",
        "admmCd": "1120067000",
        "srchFrYm": "202401",
        "srchToYm": "202401",
        "pageNo": "1",
        "numOfRows": "3"
    }
    try:
        r = requests.get(url, params=params, timeout=15, verify=False)
        print(f"  HTTP {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"  응답 구조 (최상위 키): {list(data.keys())}")
            # 첫 번째 행 샘플 출력
            root_key = list(data.keys())[0] if data else None
            if root_key and isinstance(data[root_key], list) and len(data[root_key]) > 1:
                rows = data[root_key][1].get("row", [])
                print(f"  행 수: {len(rows)}")
                if rows:
                    print(f"  첫 번째 행 키: {list(rows[0].keys())[:6]}")
                    print(f"  [OK] 행안부 인구 API 정상 작동!")
            else:
                print(f"  전체 응답(처음 300자): {str(data)[:300]}")
        else:
            print(f"  응답 본문: {r.text[:300]}")
    except Exception as e:
        print(f"  [ERROR] {e}")


def test_store_api():
    """소상공인: ODCloud 상가 API (성수동)"""
    print("\n=== [2] 소상공인 상가 API (ODCloud) ===")
    url = "https://api.odcloud.kr/api/15083033/v1/uddi:bb89aa82-09a4-4d4d-91d9-9d6681bb09a7"
    params = {
        "serviceKey": API_KEY,
        "page": 1,
        "perPage": 3,
        "returnType": "json",
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Infuser {API_KEY}"
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=20)
        print(f"  HTTP {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"  응답 최상위 키: {list(data.keys())}")
            items = data.get("data", [])
            if items:
                print(f"  첫 번째 상가 키: {list(items[0].keys())[:6]}")
                print(f"  첫 번째 상가명: {items[0].get('상호명','N/A')}")
                print(f"  [OK] 소상공인 상가 API 정상 작동!")
            else:
                print(f"  응답 내용: {str(data)[:300]}")
        else:
            print(f"  응답 본문: {r.text[:300]}")
    except Exception as e:
        print(f"  [ERROR] {e}")


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()  # SSL 경고 억제
    
    print("=" * 55)
    print("  공공데이터 API 실제 통신 진단")
    print(f"  API Key: {API_KEY[:8]}{'*'*20}")
    print("=" * 55)
    
    test_population_api()
    test_store_api()
    
    print("\n" + "=" * 55)
    print("진단 완료.")
    print("=" * 55)
