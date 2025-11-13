from fastapi import APIRouter, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, ContentCalendar, GeneratedContent, Keyword
from app.services.content_service import ContentGeneratorService

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def list_content(request: Request, db: Session = Depends(get_db)):
    """لیست محتوای تولید شده"""
    generated = db.query(GeneratedContent).all()
    scheduled = db.query(ContentCalendar).filter(
        ContentCalendar.status == "scheduled"
    ).count()

    return templates.TemplateResponse(
        "content.html",
        {"request": request, "generated_content": generated, "scheduled_count": scheduled}
    )

@router.post("/generate/{calendar_id}")
async def generate_single_content(calendar_id: int, db: Session = Depends(get_db)):
    """تولید یک محتوا"""
    calendar_item = db.query(ContentCalendar).filter(
        ContentCalendar.id == calendar_id
    ).first()

    if not calendar_item:
        return RedirectResponse(url="/content", status_code=303)

    # دریافت کلمه کلیدی
    keyword = db.query(Keyword).filter(Keyword.id == calendar_item.keyword_id).first()

    # تولید outline
    outline = ContentGeneratorService.generate_outline(
        calendar_item.title,
        keyword.keyword_type if keyword else "informational"
    )

    # تولید HTML
    html_content = ContentGeneratorService.generate_html_content(
        calendar_item.title,
        calendar_item.slug,
        outline
    )

    # متا تگ‌ها
    meta_tags = ContentGeneratorService.generate_meta_tags(
        calendar_item.title,
        keyword.keyword if keyword else calendar_item.title
    )

    # محاسبه آمار
    word_count = ContentGeneratorService.count_words(html_content)
    reading_time = ContentGeneratorService.calculate_reading_time(word_count)

    # ذخیره محتوا
    generated = GeneratedContent(
        calendar_id=calendar_id,
        title=calendar_item.title,
        slug=calendar_item.slug,
        content_html=html_content,
        meta_title=meta_tags["title"],
        meta_description=meta_tags["description"],
        word_count=word_count,
        reading_time=reading_time
    )
    db.add(generated)

    # به‌روزرسانی وضعیت تقویم
    calendar_item.status = "generated"

    db.commit()

    return RedirectResponse(url="/content", status_code=303)

@router.post("/generate-batch")
async def generate_batch_content(count: int = Form(5), db: Session = Depends(get_db)):
    """تولید دسته‌ای محتوا"""
    scheduled_items = db.query(ContentCalendar).filter(
        ContentCalendar.status == "scheduled"
    ).limit(count).all()

    for item in scheduled_items:
        # استفاده از تابع تولید تکی
        keyword = db.query(Keyword).filter(Keyword.id == item.keyword_id).first()

        outline = ContentGeneratorService.generate_outline(
            item.title,
            keyword.keyword_type if keyword else "informational"
        )

        html_content = ContentGeneratorService.generate_html_content(
            item.title,
            item.slug,
            outline
        )

        meta_tags = ContentGeneratorService.generate_meta_tags(
            item.title,
            keyword.keyword if keyword else item.title
        )

        word_count = ContentGeneratorService.count_words(html_content)
        reading_time = ContentGeneratorService.calculate_reading_time(word_count)

        generated = GeneratedContent(
            calendar_id=item.id,
            title=item.title,
            slug=item.slug,
            content_html=html_content,
            meta_title=meta_tags["title"],
            meta_description=meta_tags["description"],
            word_count=word_count,
            reading_time=reading_time
        )
        db.add(generated)

        item.status = "generated"

    db.commit()

    return RedirectResponse(url="/content", status_code=303)

@router.get("/view/{content_id}", response_class=HTMLResponse)
async def view_content(request: Request, content_id: int, db: Session = Depends(get_db)):
    """مشاهده یک محتوا"""
    content = db.query(GeneratedContent).filter(
        GeneratedContent.id == content_id
    ).first()

    return templates.TemplateResponse(
        "content_view.html",
        {"request": request, "content": content}
    )
