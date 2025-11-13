from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os

from app.routers import categories, keywords, pillar, calendar, content, publish, dashboard
from app.models.database import init_db

app = FastAPI(title="سیستم سئو و تولید محتوا", version="2.0.0")

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(dashboard.router)
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(keywords.router, prefix="/keywords", tags=["keywords"])
app.include_router(pillar.router, prefix="/pillar", tags=["pillar"])
app.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
app.include_router(content.router, prefix="/content", tags=["content"])
app.include_router(publish.router, prefix="/publish", tags=["publish"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()
    print("🚀 سیستم سئو شروع به کار کرد")
    print("📡 دسترسی: http://localhost:8000")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """صفحه اصلی"""
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
