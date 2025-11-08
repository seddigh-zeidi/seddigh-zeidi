import express from 'express';
import KeywordResearch from '../../src/modules/keywordResearch.js';
import CategoryManager from '../../src/modules/categoryManager.js';
import config from '../../config/default.js';

const router = express.Router();
const keywordResearch = new KeywordResearch(config);
const categoryManager = new CategoryManager(config.paths.categories);

// دریافت کلمات کلیدی یک دسته‌بندی
router.get('/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const keywords = await keywordResearch.loadKeywords(categorySlug);

    res.json({
      success: true,
      data: keywords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تحقیق کلمات کلیدی برای یک دسته‌بندی
router.post('/research/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const categories = await categoryManager.loadCategories();
    const category = categories.find(c => c.slug === categorySlug);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'دسته‌بندی یافت نشد',
      });
    }

    const keywords = await keywordResearch.generateKeywords(category);

    res.json({
      success: true,
      data: keywords,
      message: `${keywords.length} کلمه کلیدی یافت شد`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تحقیق کلمات کلیدی برای تمام دسته‌بندی‌ها
router.post('/research-all', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories();

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'هیچ دسته‌بندی وجود ندارد',
      });
    }

    const results = await keywordResearch.researchAllCategories(categories);

    const totalKeywords = Object.values(results).reduce(
      (sum, kws) => sum + kws.length,
      0
    );

    res.json({
      success: true,
      data: results,
      message: `${totalKeywords} کلمه کلیدی برای ${categories.length} دسته‌بندی`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
