from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from .services.gemini_service import gemini_service
from .services.github_service import github_service
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CodeAware Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    code: str
    error: Optional[str] = ""
    model: Optional[str] = "gemini-flash-latest"
    instruction: Optional[str] = ""

class Issue(BaseModel):
    title: str
    url: str
    repo: str

@app.get("/")
def read_root():
    return {"message": "Welcome to CodeAware API"}

@app.get("/models")
async def get_models():
    return {
        "models": [
            {"id": "gemini-flash-latest", "name": "Gemini 1.5 Flash (Fast & Stable)", "description": "The current standard for fast, high-quality analysis."},
            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash (Next-Gen)", "description": "Experimental model with improved reasoning capabilities."},
            {"id": "gemini-pro-latest", "name": "Gemini 1.5 Pro (Powerful)", "description": "High-fidelity model for complex architectural suggestions."}
        ]
    }

@app.post("/analyze")
async def analyze_code(request: AnalysisRequest):
    try:
        suggestion = await gemini_service.get_debugging_suggestion(
            request.code,
            request.error,
            request.model,
            request.instruction,
        )
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/github-issues", response_model=List[Issue])
async def get_issues(query: str):
    try:
        issues = await github_service.find_related_issues(query)
        return issues
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
