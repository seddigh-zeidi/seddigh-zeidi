import express from 'express';
import ContentCalendar from '../../src/modules/contentCalendar.js';
import PillarClusterSystem from '../../src/modules/pillarCluster.js';
import CategoryManager from '../../src/modules/categoryManager.js';
import config from '../../config/default.js';

const router = express.Router();
const contentCalendar = new ContentCalendar(config);
const pillarCluster = new PillarClusterSystem(config);
const categoryManager = new CategoryManager(config.paths.categories);

// دریافت تقویم
router.get('/', async (req, res) => {
  try {
    const calendar = await contentCalendar.loadCalendar();

    res.json({
      success: true,
      data: calendar || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// دریافت محتوای امروز
router.get('/today', async (req, res) => {
  try {
    const todayContent = await contentCalendar.getTodayContent();

    res.json({
      success: true,
      data: todayContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ایجاد تقویم
router.post('/generate', async (req, res) => {
  try {
    const { days = 30 } = req.body;

    const categories = await categoryManager.loadCategories();

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'هیچ دسته‌بندی وجود ندارد',
      });
    }

    const pillarStructures = [];
    for (const cat of categories) {
      const structure = await pillarCluster.loadPillarStructure(cat.slug);
      if (structure) {
        pillarStructures.push(structure);
      }
    }

    if (pillarStructures.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ابتدا ساختار Pillar را ایجاد کنید',
      });
    }

    const calendar = await contentCalendar.generateCalendar(
      pillarStructures,
      days
    );

    res.json({
      success: true,
      data: calendar,
      message: `تقویم ${days} روزه ایجاد شد`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// دریافت آمار تقویم
router.get('/stats', async (req, res) => {
  try {
    const stats = await contentCalendar.getCalendarStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// به‌روزرسانی وضعیت محتوا
router.put('/update-status', async (req, res) => {
  try {
    const { date, contentIndex, status } = req.body;

    await contentCalendar.updateContentStatus(date, contentIndex, status);

    res.json({
      success: true,
      message: 'وضعیت به‌روزرسانی شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
