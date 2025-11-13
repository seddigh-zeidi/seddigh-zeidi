from fastapi import APIRouter, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.database import get_db, ContentCalendar, Category, Keyword

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def view_calendar(request: Request, db: Session = Depends(get_db)):
    """مشاهده تقویم محتوایی"""
    calendar_items = db.query(ContentCalendar).order_by(ContentCalendar.date).all()

    return templates.TemplateResponse(
        "calendar.html",
        {"request": request, "calendar_items": calendar_items}
    )

@router.post("/generate")
async def generate_calendar(days: int = Form(30), db: Session = Depends(get_db)):
    """ایجاد تقویم محتوایی"""

    # حذف تقویم قبلی
    db.query(ContentCalendar).delete()
    db.commit()

    # دریافت تمام کلمات کلیدی
    keywords = db.query(Keyword).order_by(Keyword.search_volume.desc()).all()

    if not keywords:
        return RedirectResponse(url="/calendar", status_code=303)

    # ایجاد تقویم
    current_date = datetime.now()
    daily_count = 3  # 3 محتوا در روز

    keyword_index = 0
    for day in range(days):
        date = current_date + timedelta(days=day)

        for i in range(daily_count):
            if keyword_index >= len(keywords):
                break

            kw = keywords[keyword_index]

            calendar_item = ContentCalendar(
                date=date,
                title=kw.keyword,
                slug=kw.keyword.replace(" ", "-"),
                category_id=kw.category_id,
                keyword_id=kw.id,
                content_type="cluster",
                status="scheduled"
            )
            db.add(calendar_item)

            keyword_index += 1

        if keyword_index >= len(keywords):
            break

    db.commit()

    return RedirectResponse(url="/calendar", status_code=303)
