import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

function Keywords() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [researching, setResearching] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchKeywords(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      const cats = response.data.data;
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0].slug);
      }
    } catch (error) {
      toast.error('خطا در دریافت دسته‌بندی‌ها');
    }
  };

  const fetchKeywords = async (categorySlug) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/keywords/${categorySlug}`);
      setKeywords(response.data.data);
    } catch (error) {
      toast.error('خطا در دریافت کلمات کلیدی');
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    if (!selectedCategory) return;

    setResearching(true);
    try {
      const response = await axios.post(`/api/keywords/research/${selectedCategory}`);
      toast.success(response.data.message);
      fetchKeywords(selectedCategory);
    } catch (error) {
      toast.error('خطا در تحقیق کلمات کلیدی');
    } finally {
      setResearching(false);
    }
  };

  const handleResearchAll = async () => {
    setResearching(true);
    try {
      const response = await axios.post('/api/keywords/research-all');
      toast.success(response.data.message);
      if (selectedCategory) {
        fetchKeywords(selectedCategory);
      }
    } catch (error) {
      toast.error('خطا در تحقیق کلمات کلیدی');
    } finally {
      setResearching(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      informational: 'bg-blue-100 text-blue-800',
      commercial: 'bg-green-100 text-green-800',
      transactional: 'bg-yellow-100 text-yellow-800',
      navigational: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeName = (type) => {
    const names = {
      informational: 'آموزشی',
      commercial: 'تجاری',
      transactional: 'خرید',
      navigational: 'راهبری',
    };
    return names[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">کلمات کلیدی</h1>
          <p className="text-gray-600 mt-2">تحقیق و مدیریت کلمات کلیدی</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResearch}
            disabled={!selectedCategory || researching}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiSearch />
            {researching ? 'در حال تحقیق...' : 'تحقیق این دسته'}
          </button>
          <button
            onClick={handleResearchAll}
            disabled={researching}
            className="btn btn-success flex items-center gap-2"
          >
            <FiRefreshCw />
            تحقیق همه دسته‌ها
          </button>
        </div>
      </div>

      {/* Category Selector */}
      <div className="card">
        <label className="label">انتخاب دسته‌بندی</label>
        <select
          className="input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">انتخاب کنید</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Keywords List */}
      {loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      ) : keywords.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">هیچ کلمه کلیدی یافت نشد</p>
          <p className="text-sm text-gray-500 mt-2">
            برای تحقیق کلمات کلیدی، دکمه "تحقیق این دسته" را بزنید
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {keywords.length} کلمه کلیدی یافت شد
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    کلمه کلیدی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    نوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    حجم جستجو
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    سختی
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(keyword.type)}`}>
                        {getTypeName(keyword.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {keyword.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${keyword.difficulty}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{keyword.difficulty}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Keywords;
