import os

bgm_dir = r"c:\Users\User\Desktop\Team flow -Youth Startup Flow\The_Sovereign_ai _app\assets\bgm"
files = [
    "Main_Theme_Pure.mp3",
    "seongsu.mp3",
    "hannam.mp3",
    "itaewon.mp3",
    "yeonnam.mp3",
    "garosu.mp3",
    "sharosu.mp3",
    "mangwon.mp3"
]

for f in files:
    path = os.path.join(bgm_dir, f)
    if os.path.exists(path):
        with open(path, 'rb') as original:
            data = original.read()
        
        # 파일 크기가 너무 작으면 (예: 4초) 3번 반복하여 12초로 연장
        # 이미 연장된 파일(300KB 이상)은 건너뜀 (안전 장치)
        if len(data) < 200000: 
            with open(path, 'wb') as extended:
                extended.write(data * 3)
            print(f"Extended {f}: {len(data)} -> {len(data)*3} bytes")
        else:
            print(f"Skipped {f}: Already extended or large ({len(data)} bytes)")
    else:
        print(f"File not found: {path}")
