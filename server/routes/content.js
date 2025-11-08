import express from 'express';
import ContentGenerator from '../../src/modules/contentGenerator.js';
import ContentCalendar from '../../src/modules/contentCalendar.js';
import config from '../../config/default.js';

const router = express.Router();
const contentGenerator = new ContentGenerator(config);
const contentCalendar = new ContentCalendar(config);

// دریافت محتوا
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const content = await contentGenerator.loadContent(slug);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'محتوا یافت نشد',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تولید یک محتوا
router.post('/generate', async (req, res) => {
  try {
    const contentItem = req.body;

    if (!contentItem.title || !contentItem.slug) {
      return res.status(400).json({
        success: false,
        error: 'عنوان و اسلاگ الزامی است',
      });
    }

    const article = await contentGenerator.generateContent(contentItem);

    res.json({
      success: true,
      data: article,
      message: 'محتوا تولید شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تولید محتوای امروز
router.post('/generate-today', async (req, res) => {
  try {
    const todayContent = await contentCalendar.getTodayContent();

    if (!todayContent || todayContent.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'محتوایی برای امروز برنامه‌ریزی نشده',
      });
    }

    const articles = await contentGenerator.generateBatchContent(todayContent);

    res.json({
      success: true,
      data: articles,
      message: `${articles.length} محتوا تولید شد`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تولید تعداد مشخص محتوا
router.post('/generate-batch', async (req, res) => {
  try {
    const { count = 5 } = req.body;

    const calendar = await contentCalendar.loadCalendar();

    if (!calendar || calendar.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'تقویم محتوایی وجود ندارد',
      });
    }

    const contentItems = [];
    for (const day of calendar) {
      for (const item of day.content) {
        if (contentItems.length < count) {
          contentItems.push(item);
        }
      }
    }

    const articles = await contentGenerator.generateBatchContent(contentItems);

    res.json({
      success: true,
      data: articles,
      message: `${articles.length} محتوا تولید شد`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
