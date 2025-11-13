# 🚀 سیستم سئو و تولید محتوای حرفه‌ای (Python Edition)

یک وب اپلیکیشن کامل و حرفه‌ای با Python FastAPI و رابط کاربری زیبا

## ✨ ویژگی‌ها

### رابط کاربری حرفه‌ای
- ✅ طراحی مدرن با Bootstrap 5 RTL
- ✅ رنگ‌های گرادیانت زیبا و انیمیشن‌ها
- ✅ Responsive (موبایل، تبلت، دسکتاپ)
- ✅ Sidebar با ناوبری آسان
- ✅ کارت‌ها و چارت‌های تحلیلی

### قابلیت‌های سئو
1. **مدیریت دسته‌بندی‌ها** - افزودن، ویرایش، حذف
2. **تحقیق کلمات کلیدی** - Google Suggest API + الگوریتم‌های پیشرفته
3. **Pillar-Cluster** - ساختار خوشه‌ای محتوا
4. **تقویم محتوایی** - برنامه‌ریزی روزانه
5. **تولید محتوا** - HTML سئو شده با Schema.org
6. **انتشار** - شبیه‌سازی انتشار روی وردپرس

### تکنولوژی‌ها
- **Backend:** Python FastAPI
- **Frontend:** Jinja2 Templates + Bootstrap 5 RTL
- **Database:** SQLite with SQLAlchemy
- **API:** RESTful
- **UI:** Font Awesome Icons

## 📦 پیش‌نیازها

- Python 3.8 یا بالاتر
- pip (Python package manager)

## 🚀 نصب و راه‌اندازی

### 1. ایجاد محیط مجازی (Virtual Environment)

```bash
# ایجاد محیط مجازی
python3 -m venv venv

# فعال‌سازی محیط مجازی
# در Linux/Mac:
source venv/bin/activate

# در Windows:
venv\Scripts\activate
```

### 2. نصب Dependencies

```bash
pip install -r requirements.txt
```

### 3. اجرای برنامه

#### روش 1: استفاده از run.py (توصیه می‌شود)

```bash
python run.py
```

#### روش 2: استفاده از uvicorn مستقیم

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. دسترسی به برنامه

برنامه در آدرس زیر در دسترس است:

- **صفحه اصلی:** http://localhost:8000
- **داشبورد:** http://localhost:8000/dashboard
- **API Docs:** http://localhost:8000/docs

## 📱 صفحات وب اپلیکیشن

### 1. صفحه خوش‌آمدگویی (`/`)
- لوگوی زیبا و انیمیشن‌دار
- معرفی ویژگی‌ها
- دکمه شروع کار

### 2. داشبورد (`/dashboard`)
- کارت‌های آماری
- دسته‌بندی‌های اخیر
- کلمات کلیدی برتر
- دکمه‌های دسترسی سریع

### 3. دسته‌بندی‌ها (`/categories`)
- لیست دسته‌بندی‌ها به صورت کارت
- افزودن دسته‌بندی جدید (Modal)
- حذف دسته‌بندی
- نمایش اولویت

### 4. کلمات کلیدی (`/keywords`)
- جدول کلمات کلیدی
- فیلتر بر اساس دسته‌بندی
- نمایش نوع، حجم جستجو، سختی
- Progress bar سختی
- تحقیق کلمات کلیدی

### 5. Pillar-Cluster (`/pillar`)
- نمایش ساختار خوشه‌ای
- تقسیم‌بندی کلمات بر اساس نوع
- توضیحات استراتژی Pillar-Cluster

### 6. تقویم محتوایی (`/calendar`)
- لیست محتوای برنامه‌ریزی شده
- ایجاد تقویم جدید
- وضعیت هر محتوا
- لینک به تولید محتوا

### 7. تولید محتوا (`/content`)
- لیست محتوای تولید شده
- تولید تکی و دسته‌ای
- نمایش تعداد کلمات و زمان خواندن
- مشاهده محتوای HTML

### 8. انتشار (`/publish`)
- لیست محتوای آماده انتشار
- شبیه‌سازی انتشار روی وردپرس
- آمار منتشر شده

## 🎨 تصاویر رابط کاربری

رابط کاربری شامل:
- **گرادیانت‌های زیبا:** بنفش به صورتی
- **انیمیشن‌ها:** Hover effects و transitions
- **کارت‌ها:** Shadow و border-radius
- **رنگ‌بندی:** Primary, Success, Warning, Danger
- **آیکون‌ها:** Font Awesome

## 📂 ساختار پروژه

```
seo-content-system/
├── app/
│   ├── main.py                 # فایل اصلی FastAPI
│   ├── models/
│   │   └── database.py         # مدل‌های دیتابیس
│   ├── services/
│   │   ├── keyword_service.py  # سرویس کلمات کلیدی
│   │   └── content_service.py  # سرویس تولید محتوا
│   ├── routers/
│   │   ├── dashboard.py        # روتر داشبورد
│   │   ├── categories.py       # روتر دسته‌بندی‌ها
│   │   ├── keywords.py         # روتر کلمات کلیدی
│   │   ├── pillar.py           # روتر Pillar-Cluster
│   │   ├── calendar.py         # روتر تقویم
│   │   ├── content.py          # روتر محتوا
│   │   └── publish.py          # روتر انتشار
│   ├── templates/              # Templates HTML
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   ├── categories.html
│   │   ├── keywords.html
│   │   ├── pillar.html
│   │   ├── calendar.html
│   │   ├── content.html
│   │   ├── content_view.html
│   │   └── publish.html
│   └── static/
│       └── css/
│           └── style.css       # استایل‌های سفارشی
├── database/
│   └── seo_system.db           # دیتابیس SQLite (خودکار)
├── requirements.txt            # Dependencies
├── run.py                      # اجرای برنامه
└── PYTHON-README.md            # این فایل
```

## 🔧 API Endpoints

### Dashboard
- `GET /dashboard` - صفحه داشبورد

### Categories
- `GET /categories` - لیست دسته‌بندی‌ها
- `POST /categories/add` - افزودن دسته‌بندی
- `POST /categories/delete/{id}` - حذف دسته‌بندی
- `POST /categories/edit/{id}` - ویرایش دسته‌بندی

### Keywords
- `GET /keywords` - لیست کلمات کلیدی
- `POST /keywords/research/{category_id}` - تحقیق برای یک دسته
- `POST /keywords/research-all` - تحقیق برای همه دسته‌ها
- `GET /keywords/category/{category_id}` - کلمات یک دسته

### Pillar-Cluster
- `GET /pillar` - صفحه Pillar-Cluster

### Calendar
- `GET /calendar` - مشاهده تقویم
- `POST /calendar/generate` - ایجاد تقویم

### Content
- `GET /content` - لیست محتوا
- `POST /content/generate/{calendar_id}` - تولید یک محتوا
- `POST /content/generate-batch` - تولید دسته‌ای
- `GET /content/view/{content_id}` - مشاهده محتوا

### Publish
- `GET /publish` - صفحه انتشار
- `POST /publish/simulate/{content_id}` - شبیه‌سازی انتشار

## 🎯 نحوه استفاده

### گام 1: ایجاد دسته‌بندی‌ها
1. به `/categories` بروید
2. روی "دسته‌بندی جدید" کلیک کنید
3. فرم را پر کنید:
   - نام: مثلا "تکنولوژی"
   - اسلاگ: مثلا "technology"
   - توضیحات: توضیح کوتاه
   - اولویت: 1 تا 10

### گام 2: تحقیق کلمات کلیدی
1. به `/keywords` بروید
2. روی "تحقیق همه دسته‌ها" کلیک کنید
3. کلمات کلیدی به صورت خودکار تولید می‌شوند

### گام 3: مشاهده Pillar-Cluster
1. به `/pillar` بروید
2. ساختار خوشه‌ای کلمات را مشاهده کنید

### گام 4: ایجاد تقویم
1. به `/calendar` بروید
2. روی "ایجاد تقویم جدید" کلیک کنید
3. تعداد روزها را وارد کنید (مثلا 30)

### گام 5: تولید محتوا
1. به `/content` بروید
2. روی "تولید دسته‌ای" کلیک کنید
3. تعداد محتوا را مشخص کنید (مثلا 5)

### گام 6: انتشار (شبیه‌سازی)
1. به `/publish` بروید
2. محتوای مورد نظر را انتخاب کنید
3. روی "انتشار" کلیک کنید

## 🗄️ دیتابیس

دیتابیس SQLite به صورت خودکار ایجاد می‌شود در:
```
database/seo_system.db
```

جداول:
- `categories` - دسته‌بندی‌ها
- `keywords` - کلمات کلیدی
- `pillar_structures` - ساختار Pillar
- `content_calendar` - تقویم محتوایی
- `generated_content` - محتوای تولید شده
- `published_content` - محتوای منتشر شده

## 🎨 سفارشی‌سازی

### تغییر رنگ‌ها
فایل `app/templates/base.html` را ویرایش کنید و gradient های CSS را تغییر دهید.

### افزودن استایل
فایل `app/static/css/style.css` را ویرایش کنید.

## 🐛 رفع مشکلات

### خطا: Port already in use
```bash
# پورت 8000 را تغییر دهید
python run.py --port 8080
```

یا فایل `run.py` را ویرایش کنید.

### خطا: Module not found
```bash
# مطمئن شوید virtual environment فعال است
source venv/bin/activate

# Dependencies را دوباره نصب کنید
pip install -r requirements.txt
```

### خطا: Database locked
```bash
# فایل دیتابیس را حذف کنید (داده‌ها پاک می‌شود)
rm database/seo_system.db

# برنامه را restart کنید
python run.py
```

## 📝 نکات مهم

1. **Virtual Environment:** همیشه در virtual environment کار کنید
2. **Python Version:** حداقل Python 3.8
3. **Browser:** از مرورگر مدرن استفاده کنید (Chrome, Firefox, Edge)
4. **RTL:** رابط کاربری به صورت کامل RTL است
5. **Mobile:** طراحی Responsive است

## 🚀 استقرار (Deployment)

### استقرار ساده با Gunicorn

```bash
# نصب Gunicorn
pip install gunicorn

# اجرا
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### استقرار با Docker

```bash
# ساخت Image
docker build -t seo-system .

# اجرا
docker run -p 8000:8000 seo-system
```

## 🤝 مشارکت

این یک پروژه Open Source است. برای مشارکت:
1. Fork کنید
2. تغییرات خود را اعمال کنید
3. Pull Request بزنید

## 📄 لایسنس

MIT License

## ❤️ تشکر

ساخته شده با:
- Python FastAPI
- Bootstrap 5
- SQLAlchemy
- Jinja2
- Font Awesome

---

**نکته:** این نسخه Python یک وب اپلیکیشن کامل و حرفه‌ای است که بدون نیاز به تنظیمات پیچیده اجرا می‌شود!

🚀 **برای شروع:**
```bash
python run.py
```

سپس مرورگر خود را باز کنید: **http://localhost:8000**

موفق باشید! 🎉
