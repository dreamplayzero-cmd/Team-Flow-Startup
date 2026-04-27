import subprocess
import os
import sys
import time
import signal

def run_app():
    # Base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Paths
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")
    
    print("Starting Team Flow - Youth Startup Flow Integrated System...")
    
    # Start Backend (FastAPI)
    print("Starting Backend (FastAPI)...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=backend_dir
    )
    
    # Start Frontend (Vite)
    print("Starting Frontend (Vite)...")
    frontend_process = subprocess.Popen(
        ["npm.cmd", "run", "dev"] if os.name == 'nt' else ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True
    )
    
    print("\nBoth services are starting!")
    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:5173")
    print("\nPress Ctrl+C to stop both services.\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Goodbye!")

if __name__ == "__main__":
    run_app()
