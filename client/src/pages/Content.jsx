import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';

function Content() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);

  const handleGenerateToday = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/content/generate-today');
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطا در تولید محتوا');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/content/generate-batch', { count });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطا در تولید محتوا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تولید محتوا</h1>
        <p className="text-gray-600 mt-2">تولید مقالات سئو شده با Schema.org</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">تولید محتوای امروز</h3>
          <p className="text-gray-600 mb-4">
            محتوای برنامه‌ریزی شده برای امروز را تولید می‌کند
          </p>
          <button
            onClick={handleGenerateToday}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <FiEdit />
            {loading ? 'در حال تولید...' : 'تولید محتوای امروز'}
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-4">تولید تعداد مشخص</h3>
          <div className="mb-4">
            <label className="label">تعداد محتوا</label>
            <input
              type="number"
              className="input"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              min="1"
              max="50"
            />
          </div>
          <button
            onClick={handleGenerateBatch}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <FiEdit />
            {loading ? 'در حال تولید...' : 'تولید محتوا'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">ویژگی‌های محتوای تولید شده</h3>
        <ul className="space-y-2 text-gray-600">
          <li>✓ HTML کامل با ساختار معنایی</li>
          <li>✓ متا تگ‌های سئو (Title, Description, Keywords)</li>
          <li>✓ Schema.org Markup (Article, FAQ)</li>
          <li>✓ لینک‌های داخلی هوشمند</li>
          <li>✓ پیشنهاد تصاویر با Alt Tags</li>
          <li>✓ محاسبه زمان خواندن و تعداد کلمات</li>
        </ul>
      </div>
    </div>
  );
}

export default Content;
