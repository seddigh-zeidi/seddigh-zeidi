import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiFolder, FiSearch, FiFileText, FiCheckCircle } from 'react-icons/fi';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('خطا در دریافت آمار:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">خطا در بارگذاری داده‌ها</div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'دسته‌بندی‌ها',
      value: stats.categories?.total || 0,
      icon: FiFolder,
      color: 'bg-blue-500',
    },
    {
      title: 'کلمات کلیدی',
      value: stats.keywords?.total || 0,
      icon: FiSearch,
      color: 'bg-green-500',
    },
    {
      title: 'محتوای برنامه‌ریزی شده',
      value: stats.calendar?.totalContent || 0,
      icon: FiFileText,
      color: 'bg-yellow-500',
    },
    {
      title: 'منتشر شده',
      value: stats.wordpress?.published || 0,
      icon: FiCheckCircle,
      color: 'bg-purple-500',
    },
  ];

  // داده برای نمودار دسته‌بندی‌ها
  const categoryData = stats.categories?.items?.map(cat => ({
    name: cat.name,
    priority: cat.priority,
  })) || [];

  // داده برای نمودار نوع کلمات کلیدی
  const keywordTypeData = [
    { name: 'آموزشی', value: 0 },
    { name: 'تجاری', value: 0 },
    { name: 'خرید', value: 0 },
    { name: 'راهبری', value: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">داشبورد</h1>
        <p className="text-gray-600 mt-2">خلاصه آمار سیستم سئو و تولید محتوا</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-2xl text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* دسته‌بندی‌ها */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            دسته‌بندی‌ها بر اساس اولویت
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="priority" fill="#0ea5e9" name="اولویت" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* نوع کلمات کلیدی */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            توزیع نوع کلمات کلیدی
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={keywordTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {keywordTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Categories */}
      {stats.categories?.items && stats.categories.items.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            دسته‌بندی‌های اخیر
          </h3>
          <div className="space-y-3">
            {stats.categories.items.slice(0, 5).map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{cat.name}</h4>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    اولویت {cat.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">دسترسی سریع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            تحقیق کلمات کلیدی
          </button>
          <button className="btn btn-primary">
            ایجاد تقویم
          </button>
          <button className="btn btn-primary">
            تولید محتوا
          </button>
          <button className="btn btn-primary">
            انتشار
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
