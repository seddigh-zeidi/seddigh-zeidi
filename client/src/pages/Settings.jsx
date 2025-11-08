import { FiSettings, FiInfo } from 'react-icons/fi';

function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
        <p className="text-gray-600 mt-2">پیکربندی سیستم</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiInfo />
          راهنمای تنظیمات
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>
            برای تنظیم سیستم، فایل <code className="bg-gray-100 px-2 py-1 rounded">.env</code> در
            پوشه اصلی پروژه را ویرایش کنید.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">تنظیمات وردپرس</h4>
            <pre className="text-sm">
{`WORDPRESS_URL=https://your-site.com
WORDPRESS_USERNAME=your-username
WORDPRESS_APP_PASSWORD=your-app-password`}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">تنظیمات محتوا</h4>
            <pre className="text-sm">
{`DAILY_CONTENT_COUNT=3
MIN_WORD_COUNT=1500
MAX_WORD_COUNT=3000
CONTENT_LANGUAGE=fa`}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">نحوه ایجاد Application Password در وردپرس</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>وارد پنل مدیریت وردپرس شوید</li>
              <li>به Users → Profile بروید</li>
              <li>به بخش Application Passwords بروید</li>
              <li>یک نام برای Application وارد کنید (مثلا: SEO Content System)</li>
              <li>روی Add New Application Password کلیک کنید</li>
              <li>رمز تولید شده را کپی کرده و در فایل .env قرار دهید</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card bg-yellow-50 border border-yellow-200">
        <h3 className="font-bold text-yellow-900 mb-2">توجه</h3>
        <p className="text-yellow-800 text-sm">
          پس از تغییر فایل .env، باید سرور را مجددا راه‌اندازی کنید تا تغییرات اعمال شود.
        </p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">درباره سیستم</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>نسخه:</strong> 1.0.0</p>
          <p><strong>تکنولوژی Backend:</strong> Node.js + Express.js</p>
          <p><strong>تکنولوژی Frontend:</strong> React + Vite + Tailwind CSS</p>
          <p><strong>لایسنس:</strong> MIT</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
