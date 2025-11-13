from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, Category

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def list_categories(request: Request, db: Session = Depends(get_db)):
    """لیست دسته‌بندی‌ها"""
    categories = db.query(Category).order_by(Category.priority.desc()).all()
    return templates.TemplateResponse(
        "categories.html",
        {"request": request, "categories": categories}
    )

@router.post("/add")
async def add_category(
    name: str = Form(...),
    slug: str = Form(...),
    description: str = Form(""),
    priority: int = Form(5),
    db: Session = Depends(get_db)
):
    """افزودن دسته‌بندی جدید"""
    category = Category(
        name=name,
        slug=slug,
        description=description,
        priority=priority
    )
    db.add(category)
    db.commit()
    return RedirectResponse(url="/categories", status_code=303)

@router.post("/delete/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    """حذف دسته‌بندی"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if category:
        db.delete(category)
        db.commit()
    return RedirectResponse(url="/categories", status_code=303)

@router.post("/edit/{category_id}")
async def edit_category(
    category_id: int,
    name: str = Form(...),
    slug: str = Form(...),
    description: str = Form(""),
    priority: int = Form(5),
    db: Session = Depends(get_db)
):
    """ویرایش دسته‌بندی"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if category:
        category.name = name
        category.slug = slug
        category.description = description
        category.priority = priority
        db.commit()
    return RedirectResponse(url="/categories", status_code=303)
