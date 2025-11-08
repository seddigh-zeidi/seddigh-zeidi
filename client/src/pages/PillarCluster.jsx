import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiGrid } from 'react-icons/fi';

function PillarCluster() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('خطا در دریافت دسته‌بندی‌ها');
    }
  };

  const handleCreateAll = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/pillar/create-all');
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطا در ایجاد ساختار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pillar-Cluster</h1>
          <p className="text-gray-600 mt-2">ساختار خوشه‌ای محتوا برای سئو</p>
        </div>
        <button
          onClick={handleCreateAll}
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiGrid />
          {loading ? 'در حال ایجاد...' : 'ایجاد ساختار برای همه'}
        </button>
      </div>

      <div className="card">
        <p className="text-gray-600">
          سیستم Pillar-Cluster کلمات کلیدی شما را به صورت خوشه‌ای گروه‌بندی می‌کند.
          هر Pillar یک محتوای اصلی است که Cluster های مرتبط به آن لینک می‌دهند.
        </p>
        <p className="text-gray-600 mt-2">
          پس از اجرا، فایل‌های JSON و Markdown ساختار در پوشه data ذخیره می‌شوند.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">دسته‌بندی‌های موجود</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{cat.name}</h4>
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PillarCluster;
