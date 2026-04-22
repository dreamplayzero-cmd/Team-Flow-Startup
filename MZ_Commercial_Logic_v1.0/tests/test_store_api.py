import os, sys, requests
from urllib.parse import unquote
sys.path.append('.')
from dotenv import load_dotenv
load_dotenv()

API_KEY = unquote(os.getenv('PUBLIC_DATA_API_KEY',''))
headers = {'accept': 'application/json'}

# 소상공인 공식 REST API (B553077 기관코드 기반)
test_cases = [
    ('sdsc2/storeListInDong', 'https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong'),
    ('sdsc/storeListInDong',  'https://apis.data.go.kr/B553077/api/open/sdsc/storeListInDong'),
    ('sdsc2/storeListInUpjong','https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInUpjong'),
]

for label, url in test_cases:
    params = {
        'serviceKey': API_KEY,
        'pageNo': 1,
        'numOfRows': 1,
        'divId': 'adongCd',
        'key': '1120067000',
        'type': 'json'
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        print(f'[{label}] Status={r.status_code} | {r.text[:200]}')
    except Exception as e:
        print(f'[{label}] ERROR: {e}')
    print()
