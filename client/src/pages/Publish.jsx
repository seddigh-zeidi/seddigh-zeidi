import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function Publish() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publishMode, setPublishMode] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await axios.get('/api/publish/test-connection');
      setConnected(response.data.success);
      if (response.data.success) {
        toast.success('اتصال به وردپرس برقرار است');
      }
    } catch (error) {
      setConnected(false);
      toast.warning('اتصال به وردپرس برقرار نیست');
    }
  };

  const handlePublishToday = async () => {
    if (!connected) {
      toast.error('ابتدا اتصال به وردپرس را بررسی کنید');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/publish/today', {
        publish: publishMode,
      });

      const { success, failed } = response.data.data;
      toast.success(`${success.length} مقاله منتشر شد، ${failed.length} ناموفق`);

      if (success.length > 0) {
        console.log('منتشر شده:', success);
      }
      if (failed.length > 0) {
        console.log('ناموفق:', failed);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطا در انتشار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">انتشار</h1>
        <p className="text-gray-600 mt-2">انتشار محتوا روی وردپرس</p>
      </div>

      {/* Connection Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {connected ? (
              <>
                <FiCheckCircle className="text-2xl text-green-500" />
                <div>
                  <h3 className="font-bold">اتصال برقرار است</h3>
                  <p className="text-sm text-gray-600">
                    سیستم به وردپرس متصل است
                  </p>
                </div>
              </>
            ) : (
              <>
                <FiAlertCircle className="text-2xl text-red-500" />
                <div>
                  <h3 className="font-bold">اتصال برقرار نیست</h3>
                  <p className="text-sm text-gray-600">
                    لطفا تنظیمات وردپرس را بررسی کنید
                  </p>
                </div>
              </>
            )}
          </div>
          <button onClick={testConnection} className="btn btn-secondary">
            بررسی مجدد
          </button>
        </div>
      </div>

      {/* Publish Options */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">تنظیمات انتشار</h3>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="publishMode"
            checked={publishMode}
            onChange={(e) => setPublishMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="publishMode" className="text-gray-700">
            انتشار فوری (در غیر این صورت به عنوان پیش‌نویس ذخیره می‌شود)
          </label>
        </div>

        <button
          onClick={handlePublishToday}
          disabled={loading || !connected}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <FiSend />
          {loading ? 'در حال انتشار...' : 'انتشار محتوای امروز'}
        </button>
      </div>

      {/* Info */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">نکات مهم</h3>
        <ul className="space-y-1 text-blue-800 text-sm">
          <li>• قبل از انتشار، از وردپرس خود پشتیبان بگیرید</li>
          <li>• محتوای تولید شده را قبل از انتشار بررسی کنید</li>
          <li>• در ابتدا به صورت Draft منتشر کنید</li>
          <li>• تصاویر را به صورت دستی اضافه کنید</li>
        </ul>
      </div>
    </div>
  );
}

export default Publish;
