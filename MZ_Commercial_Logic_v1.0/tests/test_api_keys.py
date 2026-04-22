"""
API 키 및 공공데이터 통신 상태 진단 스크립트
실행: python tests/test_api_keys.py
"""
import os
import sys
import json
import requests
from pathlib import Path
from urllib.parse import unquote

sys.path.append(str(Path(__file__).resolve().parent.parent))
from utils.encoding_utils import ensure_utf8_output
from dotenv import load_dotenv

ensure_utf8_output()
load_dotenv()

def check_naver_api():
    print("\n=== [1] 네이버 데이터랩 API ===")
    client_id = os.getenv("NAVER_CLIENT_ID")
    client_secret = os.getenv("NAVER_CLIENT_SECRET")

    if not client_id or not client_secret:
        print("[MISSING] NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 없음")
        return

    url = "https://openapi.naver.com/v1/datalab/search"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
        "Content-Type": "application/json"
    }
    body = {
        "startDate": "2024-03-01",
        "endDate": "2024-03-31",
        "timeUnit": "date",
        "keywordGroups": [{"groupName": "seongsu_cafe", "keywords": ["seongsu cafe"]}]
    }
    try:
        r = requests.post(url, headers=headers, data=json.dumps(body), timeout=10)
        if r.status_code == 200:
            data = r.json()
            latest_ratio = data["results"][0]["data"][-1]["ratio"]
            print(f"[OK] Naver DataLab API 정상! latest ratio = {latest_ratio}")
        else:
            print(f"[FAIL] HTTP {r.status_code}")
            print(f"       Response: {r.text[:300]}")
    except Exception as e:
        print(f"[ERROR] {e}")


def check_public_data_api():
    print("\n=== [2] 공공데이터포털 (ODCloud 상가 API) ===")
    api_key = unquote(os.getenv("PUBLIC_DATA_API_KEY", ""))

    if not api_key:
        print("[MISSING] PUBLIC_DATA_API_KEY 없음")
        return

    url = "https://api.odcloud.kr/api/15083033/v1/uddi:bb89aa82-09a4-4d4d-91d9-9d6681bb09a7"
    params = {
        "serviceKey": api_key,
        "page": 1,
        "perPage": 1,
        "returnType": "json",
        "cond[행정동코드:EQ]": "1120067000"  # 성수동
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Infuser {api_key}"
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        if r.status_code == 200:
            try:
                data = r.json()
                print(f"[OK] ODCloud 상가 API 정상! 응답 키: {list(data.keys())}")
            except Exception:
                print(f"[PARTIAL] HTTP 200 but not JSON. 처음 200자: {r.text[:200]}")
        else:
            print(f"[FAIL] HTTP {r.status_code}")
    except Exception as e:
        print(f"[ERROR] {e}")


def check_population_api():
    print("\n=== [3] 행안부 인구 API ===")
    api_key = unquote(os.getenv("PUBLIC_DATA_API_KEY", ""))

    if not api_key:
        print("[MISSING] PUBLIC_DATA_API_KEY 없음")
        return

    url = "https://apis.data.go.kr/1741000/admmSexdAgePpltn/selectAdmmSexdAgePpltn"
    params = {
        "serviceKey": api_key,
        "type": "json",
        "admmCd": "1120067000",
        "srchFrYm": "202401",
        "srchToYm": "202401",
        "pageNo": 1,
        "numOfRows": 1
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        if r.status_code == 200:
            print(f"[OK] 행안부 API 응답 200. 처음 150자: {r.text[:150]}")
        else:
            print(f"[FAIL] HTTP {r.status_code}")
    except Exception as e:
        print(f"[ERROR] {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("   API Key & Connectivity Diagnostic")
    print("=" * 50)

    naver_id = os.getenv("NAVER_CLIENT_ID", "")
    pub_key  = os.getenv("PUBLIC_DATA_API_KEY", "")

    print("\n[KEY STATUS]")
    print(f"  NAVER_CLIENT_ID     : {naver_id[:6]}{'*'*(len(naver_id)-6) if len(naver_id)>6 else '(short)'}")
    print(f"  NAVER_CLIENT_SECRET : {'OK (set)' if os.getenv('NAVER_CLIENT_SECRET') else 'MISSING'}")
    print(f"  PUBLIC_DATA_API_KEY : {pub_key[:8]}{'*'*(len(pub_key)-8) if len(pub_key)>8 else '(short)'}")

    check_naver_api()
    check_public_data_api()
    check_population_api()

    print("\n" + "=" * 50)
    print("진단 완료. [OK] 항목은 실제 데이터 수집 가능.")
    print("=" * 50)
