from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import sys

# Add current directory to path to import core/config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.engine.scoring_engine import ScoringEngine
from config.settings import AREA_MAP
from core.engine.category_master import CategoryMaster

app = FastAPI()

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

@app.get("/api/categories")
async def get_categories():
    return CategoryMaster.get_all_names()

@app.get("/api/areas")
async def get_areas():
    return list(AREA_MAP.keys())

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    try:
        data = request.dict()
        area_mapping = {name: info['code'] for name, info in AREA_MAP.items()}
        
        multi_reports = []
        for area_name in request.areas:
            area_code = area_mapping.get(area_name)
            if not area_code:
                continue
                
            data_copy = data.copy()
            data_copy['current_area_name'] = area_name
            
            scores = engine.calculate_area_score(area_code, data_copy)
            report = engine.get_success_probability(scores, data_copy)
            
            report['area_name'] = area_name
            report['final_score'] = scores['final_score']
            multi_reports.append(report)
            
        # Sort by final score descending
        multi_reports = sorted(multi_reports, key=lambda x: x['final_score'], reverse=True)
        
        return {
            "success": True,
            "reports": multi_reports
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
