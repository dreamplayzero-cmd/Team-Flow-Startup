import os
import subprocess
import sys

def build_backend_v2():
    print("--- Starting Backend 2.0 (FastAPI) EXE Build ---")
    
    # 1. Ensure dependencies are installed
    print("Installing requirements...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    
    # 2. Run PyInstaller
    print("Running PyInstaller...")
    # Using the updated specimen file
    subprocess.run([sys.executable, "-m", "PyInstaller", "mz_analyzer.spec", "--noconfirm"], check=True)
    
    print("\nSUCCESS: Backend 2.0 EXE should be in the 'dist' folder.")
    print("Output: dist/MZ_Analyzer_v2.exe (or equivalent folder)")

if __name__ == "__main__":
    # Change to backend directory if needed
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    build_backend_v2()
