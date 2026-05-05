import os
import shutil

src_dir = r"c:\Users\User\Desktop\Team flow -Youth Startup Flow\The Sovereign AI - 7개지역 + main bgm (4초)"
dst_dir = r"c:\Users\User\Desktop\Team flow -Youth Startup Flow\The_Sovereign_ai _app\assets\audio"

os.makedirs(dst_dir, exist_ok=True)

files_to_copy = {
    "'The Sovereign AI - 메인테마  (4초) (Main beat)' part2 (mp3cut.net).mp3": "Main_Theme_Pure.mp3",
    "1. 성수동 (4초) (mp3cut.net).mp3": "seongsu.mp3",
    "2. 한남동 (4초) (mp3cut.net).mp3": "hannam.mp3",
    "3. 이태원 (4초) (mp3cut.net).mp3": "itaewon.mp3",
    "4. 연남동 (4초) (mp3cut.net).mp3": "yeonnam.mp3",
    "5. 가로수길 (4초) (mp3cut.net).mp3": "garosu.mp3",
    "6. 샤로수길 (4초) (mp3cut.net).mp3": "sharosu.mp3",
    "7. 망원동 (4초) (mp3cut.net).mp3": "mangwon.mp3"
}

for src_name, dst_name in files_to_copy.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src_name} to {dst_name}")
    else:
        print(f"File not found: {src_path}")
