from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, Category, Keyword

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def pillar_cluster(request: Request, db: Session = Depends(get_db)):
    """صفحه Pillar-Cluster"""
    categories = db.query(Category).all()

    # ساختار Pillar برای هر دسته
    pillar_data = []
    for cat in categories:
        keywords = db.query(Keyword).filter(Keyword.category_id == cat.id).all()

        # گروه‌بندی بر اساس نوع
        informational = [k for k in keywords if k.keyword_type == "informational"]
        commercial = [k for k in keywords if k.keyword_type == "commercial"]
        transactional = [k for k in keywords if k.keyword_type == "transactional"]

        pillar_data.append({
            "category": cat,
            "total_keywords": len(keywords),
            "informational": len(informational),
            "commercial": len(commercial),
            "transactional": len(transactional),
        })

    return templates.TemplateResponse(
        "pillar.html",
        {"request": request, "pillar_data": pillar_data}
    )
