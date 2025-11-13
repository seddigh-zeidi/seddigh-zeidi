from typing import Dict, List
from datetime import datetime

class ContentGeneratorService:
    """سرویس تولید محتوا"""

    @staticmethod
    def generate_outline(title: str, keyword_type: str) -> List[Dict]:
        """تولید outline مقاله"""
        outline = [
            {"level": 1, "title": title, "tag": "h1"},
            {"level": 2, "title": f"{title} چیست؟", "tag": "h2"},
        ]

        if keyword_type == "informational":
            outline.extend([
                {"level": 2, "title": f"اهمیت {title}", "tag": "h2"},
                {"level": 2, "title": f"چگونه {title}", "tag": "h2"},
                {"level": 3, "title": "مرحله اول", "tag": "h3"},
                {"level": 3, "title": "مرحله دوم", "tag": "h3"},
                {"level": 3, "title": "مرحله سوم", "tag": "h3"},
                {"level": 2, "title": "نکات مهم", "tag": "h2"},
            ])
        elif keyword_type == "commercial":
            outline.extend([
                {"level": 2, "title": f"بررسی و مقایسه {title}", "tag": "h2"},
                {"level": 2, "title": "معیارهای انتخاب", "tag": "h2"},
                {"level": 2, "title": f"بهترین {title}", "tag": "h2"},
            ])
        elif keyword_type == "transactional":
            outline.extend([
                {"level": 2, "title": f"راهنمای خرید {title}", "tag": "h2"},
                {"level": 2, "title": "قیمت و هزینه‌ها", "tag": "h2"},
                {"level": 2, "title": "نکات قبل از خرید", "tag": "h2"},
            ])

        outline.append({"level": 2, "title": "سوالات متداول", "tag": "h2"})
        outline.append({"level": 2, "title": "نتیجه‌گیری", "tag": "h2"})

        return outline

    @staticmethod
    def generate_html_content(title: str, slug: str, outline: List[Dict]) -> str:
        """تولید محتوای HTML"""
        html = f'<article class="seo-article" itemscope itemtype="http://schema.org/Article">\n'
        html += f'  <header>\n'
        html += f'    <h1 itemprop="headline">{title}</h1>\n'
        html += f'    <meta itemprop="datePublished" content="{datetime.now().isoformat()}">\n'
        html += f'  </header>\n\n'

        # مقدمه
        html += f'  <div class="introduction" itemprop="description">\n'
        html += f'    <p>در این مقاله جامع، به بررسی کامل <strong>{title}</strong> می‌پردازیم. '
        html += f'با ما همراه باشید تا با جزئیات {title} آشنا شوید.</p>\n'
        html += f'  </div>\n\n'

        # بدنه اصلی
        for section in outline[1:]:  # از index 1 چون h1 را نوشتیم
            tag = section["tag"]
            html += f'  <section>\n'
            html += f'    <{tag}>{section["title"]}</{tag}>\n'

            # محتوای نمونه
            if section["level"] == 2:
                for i in range(2):
                    html += f'    <p>در این بخش به {section["title"]} می‌پردازیم. '
                    html += f'<strong>{title}</strong> یکی از موضوعات مهم است که باید به آن توجه کنید. '
                    html += f'با استفاده از روش‌های مناسب می‌توانید نتایج بهتری کسب کنید.</p>\n'

                # لیست
                if "نکات" in section["title"] or "مرحله" not in section["title"]:
                    html += f'    <ul>\n'
                    for j in range(3):
                        html += f'      <li>نکته {j+1} درباره {section["title"]}</li>\n'
                    html += f'    </ul>\n'

            html += f'  </section>\n\n'

        # FAQ
        html += ContentGeneratorService.generate_faq_section(title)

        html += f'</article>'

        return html

    @staticmethod
    def generate_faq_section(keyword: str) -> str:
        """تولید بخش FAQ"""
        faqs = [
            {
                "question": f"{keyword} چیست؟",
                "answer": f"{keyword} به مفهوم... است که در زمینه... کاربرد دارد."
            },
            {
                "question": f"چگونه {keyword} را شروع کنیم؟",
                "answer": f"برای شروع {keyword} ابتدا باید... را انجام دهید."
            },
            {
                "question": f"مزایای {keyword} چیست؟",
                "answer": f"{keyword} مزایای متعددی دارد از جمله..."
            }
        ]

        html = f'  <section class="faq" itemscope itemtype="https://schema.org/FAQPage">\n'
        html += f'    <h2>سوالات متداول</h2>\n'

        for faq in faqs:
            html += f'    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n'
            html += f'      <h3 itemprop="name">{faq["question"]}</h3>\n'
            html += f'      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n'
            html += f'        <p itemprop="text">{faq["answer"]}</p>\n'
            html += f'      </div>\n'
            html += f'    </div>\n'

        html += f'  </section>\n\n'

        return html

    @staticmethod
    def generate_meta_tags(title: str, keyword: str) -> Dict:
        """تولید متا تگ‌ها"""
        return {
            "title": f"{title} - راهنمای جامع",
            "description": f"آموزش کامل {keyword}. در این مقاله به طور جامع {keyword} را بررسی می‌کنیم.",
            "keywords": f"{keyword}, آموزش {keyword}, راهنمای {keyword}",
            "og_title": title,
            "og_description": f"راهنمای کامل {keyword}",
        }

    @staticmethod
    def count_words(html: str) -> int:
        """شمارش کلمات"""
        import re
        text = re.sub('<[^<]+?>', '', html)
        words = text.split()
        return len(words)

    @staticmethod
    def calculate_reading_time(word_count: int) -> int:
        """محاسبه زمان خواندن (دقیقه)"""
        return max(1, word_count // 200)  # 200 کلمه در دقیقه برای فارسی
