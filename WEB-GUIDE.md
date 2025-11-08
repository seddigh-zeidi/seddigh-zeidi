# 🌐 راهنمای اجرای وب اپلیکیشن

سیستم سئو و تولید محتوا با رابط کاربری وب

## 📋 نیازمندی‌ها

- Node.js 18 یا بالاتر
- npm یا yarn
- وردپرس با REST API فعال (اختیاری)

## 🚀 نصب و راه‌اندازی

### 1. کلون پروژه

```bash
git clone <repository-url>
cd seo-content-system
```

### 2. نصب Dependencies

#### نصب Dependencies سرور (Root)

```bash
npm install
```

#### نصب Dependencies کلاینت (Frontend)

```bash
cd client
npm install
cd ..
```

### 3. تنظیمات محیطی

فایل `.env` را در پوشه اصلی ایجاد کنید:

```bash
cp .env.example .env
```

محتوای فایل `.env`:

```env
# Server Port
PORT=3001

# WordPress Configuration
WORDPRESS_URL=https://your-site.com
WORDPRESS_USERNAME=your-username
WORDPRESS_APP_PASSWORD=your-app-password

# Content Configuration
DAILY_CONTENT_COUNT=3
MIN_WORD_COUNT=1500
MAX_WORD_COUNT=3000
CONTENT_LANGUAGE=fa
```

## ▶️ اجرای برنامه

### حالت Development (توسعه)

برای اجرای همزمان سرور و کلاینت:

```bash
npm run dev
```

این دستور هر دو سرور Backend (پورت 3001) و Frontend (پورت 3000) را اجرا می‌کند.

### اجرای جداگانه

#### فقط Backend:
```bash
npm run server
```

#### فقط Frontend:
```bash
npm run client:dev
```

### حالت Production

#### 1. Build کردن Frontend:
```bash
npm run client:build
```

#### 2. اجرای سرور:
```bash
npm run server
```

سپس برنامه در آدرس `http://localhost:3001` در دسترس خواهد بود.

## 🌐 دسترسی به برنامه

بعد از اجرا:

- **Frontend (کاربر):** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

## 📱 صفحات وب اپلیکیشن

### 1. داشبورد (`/`)
- نمایش آمار کلی سیستم
- چارت‌های تحلیلی
- دسترسی سریع به عملیات

### 2. دسته‌بندی‌ها (`/categories`)
- مشاهده و مدیریت دسته‌بندی‌ها
- افزودن/ویرایش/حذف دسته‌بندی
- تنظیم اولویت

### 3. کلمات کلیدی (`/keywords`)
- مشاهده کلمات کلیدی هر دسته
- تحقیق کلمات کلیدی جدید
- فیلتر بر اساس نوع

### 4. Pillar-Cluster (`/pillar`)
- ایجاد ساختار خوشه‌ای
- مشاهده Mind Map

### 5. تقویم محتوایی (`/calendar`)
- مشاهده برنامه محتوا
- ایجاد تقویم جدید
- مدیریت زمان‌بندی

### 6. تولید محتوا (`/content`)
- تولید محتوای امروز
- تولید دسته‌ای محتوا

### 7. انتشار (`/publish`)
- بررسی اتصال وردپرس
- انتشار محتوا روی وردپرس
- مدیریت Draft/Publish

### 8. تنظیمات (`/settings`)
- راهنمای تنظیمات
- اطلاعات سیستم

## 🔧 API Endpoints

### Categories
- `GET /api/categories` - دریافت همه دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی
- `PUT /api/categories/:id` - ویرایش دسته‌بندی
- `DELETE /api/categories/:id` - حذف دسته‌بندی

### Keywords
- `GET /api/keywords/:categorySlug` - دریافت کلمات کلیدی
- `POST /api/keywords/research/:categorySlug` - تحقیق یک دسته
- `POST /api/keywords/research-all` - تحقیق همه دسته‌ها

### Pillar-Cluster
- `GET /api/pillar/:categorySlug` - دریافت ساختار
- `POST /api/pillar/create/:categorySlug` - ایجاد ساختار
- `POST /api/pillar/create-all` - ایجاد برای همه

### Calendar
- `GET /api/calendar` - دریافت تقویم
- `GET /api/calendar/today` - محتوای امروز
- `POST /api/calendar/generate` - ایجاد تقویم
- `GET /api/calendar/stats` - آمار تقویم

### Content
- `GET /api/content/:slug` - دریافت محتوا
- `POST /api/content/generate` - تولید یک محتوا
- `POST /api/content/generate-today` - تولید محتوای امروز
- `POST /api/content/generate-batch` - تولید دسته‌ای

### Publish
- `GET /api/publish/test-connection` - تست اتصال وردپرس
- `POST /api/publish/article` - انتشار یک مقاله
- `POST /api/publish/today` - انتشار محتوای امروز
- `GET /api/publish/stats` - آمار انتشار

### Stats
- `GET /api/stats/overview` - آمار کلی
- `GET /api/stats/categories` - آمار دسته‌بندی‌ها
- `GET /api/stats/keywords` - آمار کلمات کلیدی
- `GET /api/stats/calendar` - آمار تقویم

## 🎨 تکنولوژی‌های استفاده شده

### Backend
- **Express.js** - فریم‌ورک سرور
- **Node.js** - زیرساخت
- **CORS** - مدیریت Cross-Origin

### Frontend
- **React 18** - کتابخانه UI
- **Vite** - Build Tool
- **React Router** - مسیریابی
- **Tailwind CSS** - استایل
- **Recharts** - چارت‌ها و نمودارها
- **Axios** - درخواست‌های HTTP
- **React Toastify** - نوتیفیکیشن
- **React Icons** - آیکون‌ها

## 📊 ویژگی‌های رابط کاربری

### طراحی
- ✅ رابط کاربری فارسی و RTL
- ✅ طراحی Responsive (موبایل، تبلت، دسکتاپ)
- ✅ تم روشن و مدرن
- ✅ Navigation با Sidebar

### قابلیت‌ها
- ✅ نمایش آمار به صورت Realtime
- ✅ چارت‌های تحلیلی
- ✅ نوتیفیکیشن‌های هوشمند
- ✅ Loading States
- ✅ Error Handling

## 🔐 امنیت

- تمام endpoint ها از طریق Express Router محافظت شده‌اند
- CORS تنظیم شده
- Validation در سمت سرور
- Error Handling مناسب

## 🐛 عیب‌یابی

### مشکل: سرور اجرا نمی‌شود
```bash
# بررسی پورت 3001 آزاد باشد
lsof -i :3001
kill -9 <PID>
```

### مشکل: Frontend اجرا نمی‌شود
```bash
# حذف node_modules و نصب مجدد
cd client
rm -rf node_modules
npm install
```

### مشکل: API ها کار نمی‌کنند
- فایل `.env` را بررسی کنید
- Backend را restart کنید
- Console برنامه را چک کنید

## 📝 نکات مهم

1. **پورت‌ها:** Backend در 3001 و Frontend در 3000 اجرا می‌شود
2. **Proxy:** Vite درخواست‌های `/api` را به Backend هدایت می‌کند
3. **Build:** برای Production حتما `npm run client:build` را اجرا کنید
4. **Data:** داده‌ها در پوشه `data/` ذخیره می‌شوند

## 🎯 فلوچارت کاربری

```
ورود به برنامه
    ↓
داشبورد (مشاهده آمار)
    ↓
افزودن دسته‌بندی‌ها
    ↓
تحقیق کلمات کلیدی
    ↓
ایجاد ساختار Pillar-Cluster
    ↓
ایجاد تقویم محتوایی
    ↓
تولید محتوا
    ↓
انتشار روی وردپرس
```

## 🚀 استقرار (Deployment)

### Deploy با PM2

```bash
# نصب PM2
npm install -g pm2

# Build Frontend
npm run client:build

# اجرا با PM2
pm2 start server/index.js --name seo-system
pm2 save
pm2 startup
```

### Deploy با Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app

EXPOSE 3001

CMD ["npm", "run", "server"]
```

```bash
# Build و Run
docker build -t seo-system .
docker run -p 3001:3001 --env-file .env seo-system
```

## 📞 پشتیبانی

برای مشکلات و سوالات:
- Issue باز کنید در GitHub
- مستندات کامل را مطالعه کنید

---

**توسعه داده شده با ❤️ برای مجلات فارسی**
