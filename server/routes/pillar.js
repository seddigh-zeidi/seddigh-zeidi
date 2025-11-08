import express from 'express';
import PillarClusterSystem from '../../src/modules/pillarCluster.js';
import CategoryManager from '../../src/modules/categoryManager.js';
import KeywordResearch from '../../src/modules/keywordResearch.js';
import config from '../../config/default.js';

const router = express.Router();
const pillarCluster = new PillarClusterSystem(config);
const categoryManager = new CategoryManager(config.paths.categories);
const keywordResearch = new KeywordResearch(config);

// دریافت ساختار Pillar برای یک دسته‌بندی
router.get('/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const structure = await pillarCluster.loadPillarStructure(categorySlug);

    if (!structure) {
      return res.status(404).json({
        success: false,
        error: 'ساختار Pillar یافت نشد',
      });
    }

    res.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ایجاد ساختار Pillar برای یک دسته‌بندی
router.post('/create/:categorySlug', async (req, res) => {
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

    const keywords = await keywordResearch.loadKeywords(categorySlug);

    if (!keywords || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ابتدا تحقیق کلمات کلیدی را انجام دهید',
      });
    }

    const pillarStructure = await pillarCluster.createPillarClusterStructure(
      category,
      keywords
    );

    const mindMap = await pillarCluster.generateMindMap(pillarStructure);
    await pillarCluster.saveMindMap(categorySlug, mindMap);

    res.json({
      success: true,
      data: {
        pillar: pillarStructure,
        mindMap,
      },
      message: 'ساختار Pillar ایجاد شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ایجاد ساختار برای تمام دسته‌بندی‌ها
router.post('/create-all', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories();

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'هیچ دسته‌بندی وجود ندارد',
      });
    }

    const allKeywords = {};
    for (const cat of categories) {
      allKeywords[cat.slug] = await keywordResearch.loadKeywords(cat.slug);
    }

    const structures = await pillarCluster.createAllPillarStructures(
      categories,
      allKeywords
    );

    res.json({
      success: true,
      data: structures,
      message: `${structures.length} ساختار Pillar ایجاد شد`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
