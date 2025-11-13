from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.models.database import get_db, GeneratedContent, PublishedContent

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def publish_page(request: Request, db: Session = Depends(get_db)):
    """صفحه انتشار"""
    generated = db.query(GeneratedContent).all()
    published = db.query(PublishedContent).all()

    return templates.TemplateResponse(
        "publish.html",
        {
            "request": request,
            "generated_content": generated,
            "published_content": published
        }
    )

@router.post("/simulate/{content_id}")
async def simulate_publish(content_id: int, db: Session = Depends(get_db)):
    """شبیه‌سازی انتشار (بدون وردپرس واقعی)"""
    content = db.query(GeneratedContent).filter(
        GeneratedContent.id == content_id
    ).first()

    if not content:
        return RedirectResponse(url="/publish", status_code=303)

    # شبیه‌سازی انتشار
    published = PublishedContent(
        content_id=content.id,
        wordpress_id=12345,  # شبیه‌سازی
        wordpress_url=f"https://example.com/{content.slug}",
        status="published"
    )
    db.add(published)
    db.commit()

    return RedirectResponse(url="/publish", status_code=303)
