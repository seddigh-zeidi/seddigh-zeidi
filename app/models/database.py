from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database setup
DATABASE_URL = "sqlite:///./database/seo_system.db"
os.makedirs("database", exist_ok=True)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    priority = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

    keywords = relationship("Keyword", back_populates="category", cascade="all, delete-orphan")

class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    search_volume = Column(Integer, default=0)
    difficulty = Column(Integer, default=50)
    keyword_type = Column(String, default="informational")  # informational, commercial, transactional, navigational
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="keywords")

class PillarStructure(Base):
    __tablename__ = "pillar_structures"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    title = Column(String)
    slug = Column(String)
    main_keyword_id = Column(Integer, ForeignKey("keywords.id"))
    structure_data = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

class ContentCalendar(Base):
    __tablename__ = "content_calendar"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    title = Column(String)
    slug = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    keyword_id = Column(Integer, ForeignKey("keywords.id"))
    content_type = Column(String, default="cluster")  # pillar or cluster
    status = Column(String, default="scheduled")  # scheduled, generated, published
    created_at = Column(DateTime, default=datetime.utcnow)

class GeneratedContent(Base):
    __tablename__ = "generated_content"

    id = Column(Integer, primary_key=True, index=True)
    calendar_id = Column(Integer, ForeignKey("content_calendar.id"))
    title = Column(String)
    slug = Column(String, unique=True)
    content_html = Column(Text)
    meta_title = Column(String)
    meta_description = Column(Text)
    word_count = Column(Integer)
    reading_time = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class PublishedContent(Base):
    __tablename__ = "published_content"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("generated_content.id"))
    wordpress_id = Column(Integer)
    wordpress_url = Column(String)
    status = Column(String)  # draft, published
    published_at = Column(DateTime, default=datetime.utcnow)

# Database initialization
async def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
