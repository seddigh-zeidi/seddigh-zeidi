import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiFolder,
  FiSearch,
  FiGrid,
  FiCalendar,
  FiEdit,
  FiSend,
  FiSettings,
} from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'داشبورد', icon: FiHome },
  { path: '/categories', label: 'دسته‌بندی‌ها', icon: FiFolder },
  { path: '/keywords', label: 'کلمات کلیدی', icon: FiSearch },
  { path: '/pillar', label: 'Pillar-Cluster', icon: FiGrid },
  { path: '/calendar', label: 'تقویم محتوایی', icon: FiCalendar },
  { path: '/content', label: 'تولید محتوا', icon: FiEdit },
  { path: '/publish', label: 'انتشار', icon: FiSend },
  { path: '/settings', label: 'تنظیمات', icon: FiSettings },
];

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">سیستم سئو</h1>
          <p className="text-sm text-gray-500 mt-1">تولید محتوای حرفه‌ای</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="mr-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
