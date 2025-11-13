import requests
import random
from typing import List, Dict
from app.models.database import Keyword, Category, get_db

class KeywordResearchService:
    """سرویس تحقیق کلمات کلیدی"""

    @staticmethod
    def generate_keyword_variations(base_keyword: str) -> List[str]:
        """تولید variations کلمات کلیدی"""
        prefixes = [
            "آموزش", "راهنمای", "بهترین", "نحوه", "چگونه", "روش",
            "معرفی", "بررسی", "مقایسه", "خرید", "قیمت"
        ]

        suffixes = [
            "چیست", "کجاست", "چطور", "چه‌طور",
            "در سال 2024", "به زبان ساده", "کامل", "حرفه‌ای"
        ]

        variations = [base_keyword]  # شامل کلمه اصلی

        # ترکیب با prefix
        for prefix in prefixes[:5]:
            variations.append(f"{prefix} {base_keyword}")

        # ترکیب با suffix
        for suffix in suffixes[:5]:
            variations.append(f"{base_keyword} {suffix}")

        return variations

    @staticmethod
    def get_google_suggestions(query: str) -> List[str]:
        """دریافت پیشنهادات گوگل"""
        try:
            url = f"http://suggestqueries.google.com/complete/search"
            params = {
                "client": "firefox",
                "q": query
            }
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return data[1] if len(data) > 1 else []
        except:
            pass
        return []

    @staticmethod
    def estimate_search_volume(keyword: str) -> int:
        """تخمین حجم جستجو"""
        length = len(keyword.split())

        if length == 1:
            return random.randint(2000, 10000)
        elif length == 2:
            return random.randint(500, 3000)
        elif length == 3:
            return random.randint(200, 1000)
        else:
            return random.randint(50, 500)

    @staticmethod
    def estimate_difficulty(keyword: str) -> int:
        """تخمین سختی"""
        length = len(keyword.split())

        if length == 1:
            return random.randint(60, 95)
        elif length == 2:
            return random.randint(40, 70)
        elif length == 3:
            return random.randint(20, 50)
        else:
            return random.randint(10, 30)

    @staticmethod
    def classify_keyword_type(keyword: str) -> str:
        """تعیین نوع کلمه کلیدی"""
        lower_kw = keyword.lower()

        if any(word in lower_kw for word in ["خرید", "قیمت", "فروش"]):
            return "transactional"
        elif any(word in lower_kw for word in ["چیست", "آموزش", "راهنما", "نحوه"]):
            return "informational"
        elif any(word in lower_kw for word in ["بهترین", "مقایسه", "بررسی"]):
            return "commercial"
        else:
            return "navigational"

    @staticmethod
    async def research_keywords(category: Category, db) -> List[Dict]:
        """تحقیق کلمات کلیدی برای یک دسته"""
        all_keywords = []

        # تولید variations
        variations = KeywordResearchService.generate_keyword_variations(category.name)

        # دریافت پیشنهادات گوگل
        google_suggestions = KeywordResearchService.get_google_suggestions(category.name)

        # ترکیب
        keywords_list = list(set(variations + google_suggestions))

        for kw in keywords_list[:30]:  # محدود به 30 کلمه
            keyword_data = {
                "keyword": kw,
                "search_volume": KeywordResearchService.estimate_search_volume(kw),
                "difficulty": KeywordResearchService.estimate_difficulty(kw),
                "type": KeywordResearchService.classify_keyword_type(kw)
            }

            # ذخیره در دیتابیس
            db_keyword = Keyword(
                keyword=kw,
                category_id=category.id,
                search_volume=keyword_data["search_volume"],
                difficulty=keyword_data["difficulty"],
                keyword_type=keyword_data["type"]
            )
            db.add(db_keyword)

            all_keywords.append(keyword_data)

        db.commit()

        # مرتب‌سازی بر اساس حجم
        all_keywords.sort(key=lambda x: x["search_volume"], reverse=True)

        return all_keywords
