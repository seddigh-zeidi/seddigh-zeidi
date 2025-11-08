# 📖 مثال‌های کاربردی

## مثال 1: راه‌اندازی برای یک مجله تکنولوژی

### گام 1: تعریف دسته‌بندی‌ها

```javascript
// دسته‌بندی‌های پیشنهادی:

1. برنامه‌نویسی
   - اسلاگ: programming
   - اولویت: 10

2. هوش مصنوعی
   - اسلاگ: artificial-intelligence
   - اولویت: 9

3. امنیت سایبری
   - اسلاگ: cybersecurity
   - اولویت: 8

4. موبایل و اپلیکیشن
   - اسلاگ: mobile-apps
   - اولویت: 7
```

### گام 2: نمونه کلمات کلیدی تولید شده

برای دسته "برنامه‌نویسی":

```json
[
  {
    "keyword": "آموزش برنامه‌نویسی پایتون",
    "searchVolume": 5200,
    "difficulty": 58,
    "type": "informational"
  },
  {
    "keyword": "بهترین زبان برنامه‌نویسی 2024",
    "searchVolume": 3400,
    "difficulty": 42,
    "type": "commercial"
  },
  {
    "keyword": "خرید دوره برنامه‌نویسی",
    "searchVolume": 1800,
    "difficulty": 35,
    "type": "transactional"
  }
]
```

### گام 3: ساختار Pillar-Cluster

```
برنامه‌نویسی (Pillar)
│
├── محتوای آموزشی (15 مقاله)
│   ├── آموزش برنامه‌نویسی پایتون
│   ├── چگونه برنامه‌نویس شویم
│   ├── مفاهیم پایه برنامه‌نویسی
│   └── ...
│
├── محتوای تجاری (10 مقاله)
│   ├── بهترین زبان‌های برنامه‌نویسی
│   ├── مقایسه Python و JavaScript
│   └── ...
│
└── محتوای خرید (8 مقاله)
    ├── خرید دوره برنامه‌نویسی
    ├── قیمت دوره‌های آنلاین
    └── ...
```

### گام 4: تقویم 30 روزه

```markdown
## هفته 1

### روز 1 (یکشنبه)
1. 🎯 برنامه‌نویسی - راهنمای جامع (Pillar)
2. 📄 آموزش برنامه‌نویسی پایتون
3. 📄 مفاهیم پایه برنامه‌نویسی

### روز 2 (دوشنبه)
1. 📄 چگونه برنامه‌نویس شویم
2. 📄 بهترین زبان‌های برنامه‌نویسی
3. 📄 راهنمای شروع JavaScript

### روز 3 (سه‌شنبه)
1. 🎯 هوش مصنوعی - راهنمای کامل (Pillar)
2. 📄 هوش مصنوعی چیست
3. 📄 کاربردهای هوش مصنوعی
```

## مثال 2: مجله سلامت و تناسب اندام

### دسته‌بندی‌ها

```
1. تغذیه سالم (nutrition)
2. ورزش و تمرین (fitness)
3. سلامت روان (mental-health)
4. رژیم غذایی (diet)
```

### نمونه کلمات کلیدی برای "تغذیه سالم"

```
Informational:
- تغذیه سالم چیست
- اهمیت تغذیه سالم
- آموزش تغذیه سالم
- مواد غذایی مفید

Commercial:
- بهترین مواد غذایی سالم
- مقایسه رژیم‌های غذایی
- انواع ویتامین‌ها

Transactional:
- خرید مکمل غذایی
- برنامه غذایی آنلاین
```

### نمونه محتوای تولید شده

```html
<article class="seo-content">
  <h1>تغذیه سالم - راهنمای جامع</h1>

  <div class="introduction">
    <p>در این مقاله جامع، به بررسی کامل <strong>تغذیه سالم</strong> می‌پردازیم...</p>
  </div>

  <section>
    <h2>تغذیه سالم چیست؟</h2>
    <p>تغذیه سالم به معنای مصرف متعادل مواد غذایی است که...</p>
  </section>

  <section>
    <h2>اهمیت و کاربردهای تغذیه سالم</h2>
    <p>تغذیه سالم نقش بسیار مهمی در سلامت جسم و روان دارد...</p>
  </section>

  <!-- سایر بخش‌ها -->
</article>
```

## مثال 3: استفاده از API

### تولید محتوا با کد

```javascript
import ContentGenerator from './src/modules/contentGenerator.js';
import config from './config/default.js';

const generator = new ContentGenerator(config);

// تولید یک مقاله
const contentItem = {
  title: 'آموزش برنامه‌نویسی پایتون',
  slug: 'python-programming-tutorial',
  type: 'cluster',
  keyword: {
    keyword: 'آموزش پایتون',
    searchVolume: 5200,
    difficulty: 58,
    type: 'informational'
  },
  category: 'programming'
};

const article = await generator.generateContent(contentItem);
console.log(article);
```

### انتشار با کد

```javascript
import WordPressPublisher from './src/modules/wordpressPublisher.js';
import config from './config/default.js';

const publisher = new WordPressPublisher(config);

// تست اتصال
await publisher.testConnection();

// انتشار مقاله
const result = await publisher.publishArticle(article, {
  publish: true,  // انتشار فوری
  featuredImage: './path/to/image.jpg'  // اختیاری
});

console.log('منتشر شد:', result.link);
```

## مثال 4: برنامه‌ریزی انتشار

### انتشار روزانه خودکار

```javascript
import ContentCalendar from './src/modules/contentCalendar.js';
import ContentGenerator from './src/modules/contentGenerator.js';
import WordPressPublisher from './src/modules/wordpressPublisher.js';

// دریافت محتوای امروز
const todayContent = await contentCalendar.getTodayContent();

// تولید محتوا
for (const item of todayContent) {
  const article = await generator.generateContent(item);

  // انتشار
  await publisher.publishArticle(article, { publish: true });

  // به‌روزرسانی وضعیت
  await contentCalendar.updateContentStatus(
    new Date(),
    item.index,
    'published'
  );
}
```

### اجرا با Cron Job

```bash
# اضافه کردن به crontab
# انتشار روزانه در ساعت 9 صبح

0 9 * * * cd /path/to/project && node scripts/daily-publish.js
```

## مثال 5: سفارشی‌سازی محتوا

### افزودن بخش‌های سفارشی به Outline

```javascript
// ویرایش src/modules/contentGenerator.js

createOutline(contentItem) {
  const outline = [
    { level: 1, title: contentItem.title, type: 'h1' },
    { level: 2, title: 'مقدمه', type: 'h2' },

    // بخش‌های سفارشی
    { level: 2, title: 'ویدیو آموزشی', type: 'h2' },
    { level: 2, title: 'دانلود فایل‌ها', type: 'h2' },

    { level: 2, title: 'نتیجه‌گیری', type: 'h2' }
  ];

  return outline;
}
```

### افزودن Schema سفارشی

```javascript
// اضافه کردن Video Schema

generateVideoSchema(videoUrl, title) {
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "${title}",
      "contentUrl": "${videoUrl}",
      "uploadDate": "${new Date().toISOString()}"
    }
    </script>
  `;
}
```

## مثال 6: یکپارچگی با سرویس‌های دیگر

### ارسال اعلان در تلگرام

```javascript
import axios from 'axios';

async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  await axios.post(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }
  );
}

// استفاده
await publisher.publishArticle(article);
await sendTelegramNotification(`✅ مقاله جدید منتشر شد:\n${article.title}`);
```

### ذخیره در Google Sheets

```javascript
import { google } from 'googleapis';

async function saveToGoogleSheets(article) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: 'YOUR_SHEET_ID',
    range: 'A:D',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[
        article.title,
        article.slug,
        article.wordCount,
        new Date().toISOString()
      ]]
    }
  });
}
```

## مثال 7: آمار و تحلیل

### دریافت آمار کامل

```javascript
async function getFullStats() {
  const categories = await categoryManager.loadCategories();
  const calendarStats = await contentCalendar.getCalendarStats();
  const wpStats = await wordpressPublisher.getPublishingStats();

  console.log('📊 آمار کامل سیستم');
  console.log('دسته‌بندی‌ها:', categories.length);
  console.log('محتوای برنامه‌ریزی شده:', calendarStats.totalContent);
  console.log('منتشر شده در وردپرس:', wpStats.published);

  return {
    categories: categories.length,
    scheduled: calendarStats.totalContent,
    published: wpStats.published,
    successRate: (wpStats.published / calendarStats.totalContent * 100).toFixed(2) + '%'
  };
}
```

## مثال 8: Webhook برای اتوماسیون

### راه‌اندازی Webhook

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// وب‌هوک برای تریگر انتشار
app.post('/webhook/publish', async (req, res) => {
  try {
    const { category, count } = req.body;

    // دریافت محتوا
    const calendar = await contentCalendar.loadCalendar();
    const items = calendar
      .flatMap(day => day.content)
      .filter(item => item.category === category)
      .slice(0, count);

    // تولید و انتشار
    for (const item of items) {
      const article = await generator.generateContent(item);
      await publisher.publishArticle(article, { publish: true });
    }

    res.json({ success: true, published: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## نکات مهم

1. **تست محتوا**: همیشه محتوای تولید شده را قبل از انتشار بررسی کنید
2. **پشتیبان‌گیری**: از وردپرس و دیتابیس پشتیبان بگیرید
3. **Rate Limiting**: به محدودیت‌های API توجه کنید
4. **کیفیت**: محتوا را دستی ویرایش کنید برای کیفیت بهتر
5. **تصاویر**: تصاویر با کیفیت و مرتبط اضافه کنید
6. **لینک‌ها**: لینک‌های داخلی را بررسی کنید
7. **SEO**: از ابزارهای سئو برای بررسی استفاده کنید

---

این مثال‌ها نشان می‌دهند که سیستم چقدر انعطاف‌پذیر و قدرتمند است! 🚀
