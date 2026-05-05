import os

def find_first_frame(data):
    # MP3 frames start with 0xFF followed by 0xFB (or FA, F3, F2)
    # We'll look for 0xFF 0xFB which is very common
    for i in range(len(data) - 1):
        if data[i] == 0xFF and (data[i+1] & 0xE0) == 0xE0:
            return i
    return 0

bgm_dir = r"c:\Users\User\Desktop\Team flow -Youth Startup Flow\The_Sovereign_ai _app\assets\bgm"
src_file = "Main_Theme_Pure_v12s.mp3" # This was already tripled, let's go back to original 4s one
original_file = "Main_Theme_Pure.mp3" # Wait, I renamed it? No, I still have it or can copy from source.

# Let's use the one in source directory
src_dir = r"c:\Users\User\Desktop\Team flow -Youth Startup Flow\The Sovereign AI - 7개지역 + main bgm (4초)"
main_bgm_src = os.path.join(src_dir, "'The Sovereign AI - 메인테마  (4초) (Main beat)' part2 (mp3cut.net).mp3")

if os.path.exists(main_bgm_src):
    with open(main_bgm_src, 'rb') as f:
        data = f.read()
    
    first_frame_idx = find_first_frame(data)
    print(f"First frame found at index {first_frame_idx}")
    
    header = data[:first_frame_idx]
    frames = data[first_frame_idx:]
    
    # Concatenate frames 3 times, keep one header
    new_data = header + (frames * 3)
    
    dst_path = os.path.join(bgm_dir, "Final_BGM_Loop_12s_v5.mp3")
    with open(dst_path, 'wb') as f:
        f.write(new_data)
    print(f"Created clean concatenated MP3 at {dst_path} (Size: {len(new_data)} bytes)")
else:
    print("Source BGM not found!")
