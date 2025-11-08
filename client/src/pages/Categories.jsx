import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    priority: 5,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.id}`, formData);
        toast.success('دسته‌بندی به‌روزرسانی شد');
      } else {
        await axios.post('/api/categories', formData);
        toast.success('دسته‌بندی ایجاد شد');
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', priority: 5 });
      fetchCategories();
    } catch (error) {
      toast.error('خطا در ذخیره دسته‌بندی');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      priority: category.priority,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      toast.success('دسته‌بندی حذف شد');
      fetchCategories();
    } catch (error) {
      toast.error('خطا در حذف دسته‌بندی');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', priority: 5 });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">دسته‌بندی‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت دسته‌بندی‌های سایت</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus />
          دسته‌بندی جدید
        </button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">هیچ دسته‌بندی وجود ندارد</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary mt-4"
          >
            ایجاد اولین دسته‌بندی
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .sort((a, b) => b.priority - a.priority)
            .map((category) => (
              <div key={category.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      /{category.slug}
                    </p>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {category.priority}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <FiEdit2 />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-danger flex-1 flex items-center justify-center gap-2"
                  >
                    <FiTrash2 />
                    حذف
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">نام دسته‌بندی</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">اسلاگ (URL)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">توضیحات</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="label">اولویت (1-10)</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingCategory ? 'به‌روزرسانی' : 'ایجاد'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
