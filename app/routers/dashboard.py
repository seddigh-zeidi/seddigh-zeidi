from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, Category, Keyword, ContentCalendar

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    """صفحه داشبورد"""

    # آمار کلی
    total_categories = db.query(Category).count()
    total_keywords = db.query(Keyword).count()
    total_content = db.query(ContentCalendar).count()
    published_content = db.query(ContentCalendar).filter(
        ContentCalendar.status == "published"
    ).count()

    # دسته‌بندی‌های اخیر
    recent_categories = db.query(Category).order_by(
        Category.created_at.desc()
    ).limit(5).all()

    # کلمات کلیدی برتر
    top_keywords = db.query(Keyword).order_by(
        Keyword.search_volume.desc()
    ).limit(10).all()

    stats = {
        "total_categories": total_categories,
        "total_keywords": total_keywords,
        "total_content": total_content,
        "published_content": published_content,
        "recent_categories": recent_categories,
        "top_keywords": top_keywords,
    }

    return templates.TemplateResponse(
        "dashboard.html",
        {"request": request, "stats": stats}
    )
