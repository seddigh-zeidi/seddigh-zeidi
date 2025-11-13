from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, Category, Keyword
from app.services.keyword_service import KeywordResearchService

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def list_keywords(request: Request, db: Session = Depends(get_db)):
    """لیست کلمات کلیدی"""
    categories = db.query(Category).all()
    keywords = db.query(Keyword).order_by(Keyword.search_volume.desc()).all()
    return templates.TemplateResponse(
        "keywords.html",
        {"request": request, "categories": categories, "keywords": keywords}
    )

@router.post("/research/{category_id}")
async def research_keywords(category_id: int, db: Session = Depends(get_db)):
    """تحقیق کلمات کلیدی برای یک دسته"""
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return RedirectResponse(url="/keywords", status_code=303)

    # حذف کلمات قبلی این دسته
    db.query(Keyword).filter(Keyword.category_id == category_id).delete()
    db.commit()

    # تحقیق جدید
    await KeywordResearchService.research_keywords(category, db)

    return RedirectResponse(url="/keywords", status_code=303)

@router.post("/research-all")
async def research_all_keywords(db: Session = Depends(get_db)):
    """تحقیق کلمات کلیدی برای همه دسته‌ها"""
    categories = db.query(Category).all()

    for category in categories:
        # حذف کلمات قبلی
        db.query(Keyword).filter(Keyword.category_id == category.id).delete()
        db.commit()

        # تحقیق جدید
        await KeywordResearchService.research_keywords(category, db)

    return RedirectResponse(url="/keywords", status_code=303)

@router.get("/category/{category_id}", response_class=HTMLResponse)
async def keywords_by_category(
    request: Request,
    category_id: int,
    db: Session = Depends(get_db)
):
    """کلمات کلیدی یک دسته"""
    category = db.query(Category).filter(Category.id == category_id).first()
    keywords = db.query(Keyword).filter(
        Keyword.category_id == category_id
    ).order_by(Keyword.search_volume.desc()).all()

    return templates.TemplateResponse(
        "keywords_category.html",
        {"request": request, "category": category, "keywords": keywords}
    )
