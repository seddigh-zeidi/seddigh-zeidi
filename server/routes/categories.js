import express from 'express';
import CategoryManager from '../../src/modules/categoryManager.js';
import config from '../../config/default.js';

const router = express.Router();
const categoryManager = new CategoryManager(config.paths.categories);

// دریافت تمام دسته‌بندی‌ها
router.get('/', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories();
    res.json({
      success: true,
      data: categories || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ایجاد دسته‌بندی جدید
router.post('/', async (req, res) => {
  try {
    const { name, slug, description, priority } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'نام و اسلاگ الزامی است',
      });
    }

    const categories = await categoryManager.loadCategories() || [];

    const newCategory = {
      id: Date.now() + Math.random(),
      name,
      slug,
      description: description || '',
      priority: priority || 5,
      createdAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    await categoryManager.saveCategories(categories);

    res.json({
      success: true,
      data: newCategory,
      message: 'دسته‌بندی ایجاد شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ویرایش دسته‌بندی
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await categoryManager.editCategory(parseFloat(id), updates);

    res.json({
      success: true,
      message: 'دسته‌بندی به‌روزرسانی شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// حذف دسته‌بندی
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await categoryManager.deleteCategory(parseFloat(id));

    res.json({
      success: true,
      message: 'دسته‌بندی حذف شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
