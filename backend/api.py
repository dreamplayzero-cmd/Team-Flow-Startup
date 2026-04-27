from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
import logging

# [NEW] Configure logging for api.py
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# [UPDATED] Robust path handling for both Dev and Frozen (PyInstaller) environments
if getattr(sys, 'frozen', False):
    root_dir = sys._MEIPASS
else:
    root_dir = os.path.dirname(os.path.abspath(__file__))

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from core.engine.scoring_engine import ScoringEngine
from config.settings import AREA_MAP
from core.engine.category_master import CategoryMaster
from core.utils.gemini_service import gemini_service

app = FastAPI()

# Mount assets folder to serve static files (Visual DNA images)
assets_path = os.path.join(root_dir, "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
else:
    logger.warning(f"Assets directory not found at: {assets_path}")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ScoringEngine()

class AnalysisRequest(BaseModel):
    age: int
    gender: str
    experience: int
    capital: int
    industry: str
    target: str
    op_type: str
    op_time: str
    areas: List[str]

class PersonaRequest(BaseModel):
    name: str
    description: str

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = gemini_service.generate_chat_response(request.message)
        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories")
async def get_categories():
    return CategoryMaster.get_all_names()

@app.get("/api/areas")
async def get_areas():
    return list(AREA_MAP.keys())

@app.post("/api/persona/analyze")
async def analyze_persona(request: PersonaRequest):
    try:
        insight = gemini_service.generate_persona_insight(request.name, request.description)
        return {
            "success": True,
            "insight": insight
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    try:
        data = request.dict()
        area_mapping = {name: info['code'] for name, info in AREA_MAP.items()}
        
        multi_reports = []
        
        logger.info(f"Processing analysis for areas: {request.areas}")
        
        for area_name in request.areas:
            try:
                area_code = area_mapping.get(area_name)
                if not area_code:
                    logger.warning(f"Area name {area_name} not found in AREA_MAP")
                    continue
                    
                data_copy = data.copy()
                data_copy['current_area_name'] = area_name
                
                scores = engine.calculate_area_score(area_code, data_copy)
                report = engine.get_success_probability(scores, data_copy)
                
                report['area_name'] = area_name
                report['final_score'] = scores['final_score']
                
                # [DEBUG] Verify critical fields
                logger.info(f"Generated report for {area_name}: dna_result={bool(report.get('dna_result'))}, future_prediction={bool(report.get('future_prediction'))}")
                
                multi_reports.append(report)
            except Exception as e:
                print(f"[ERROR] Failed to generate report for {area_name}: {e}")
                continue
            
        # Sort by final score descending
        multi_reports = sorted(multi_reports, key=lambda x: x.get('final_score', 0), reverse=True)
        
        return {
            "success": True,
            "reports": multi_reports
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
