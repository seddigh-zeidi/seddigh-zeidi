import express from 'express';
import WordPressPublisher from '../../src/modules/wordpressPublisher.js';
import ContentGenerator from '../../src/modules/contentGenerator.js';
import ContentCalendar from '../../src/modules/contentCalendar.js';
import config from '../../config/default.js';

const router = express.Router();
const wordpressPublisher = new WordPressPublisher(config);
const contentGenerator = new ContentGenerator(config);
const contentCalendar = new ContentCalendar(config);

// تست اتصال وردپرس
router.get('/test-connection', async (req, res) => {
  try {
    const connected = await wordpressPublisher.testConnection();

    res.json({
      success: connected,
      message: connected ? 'اتصال برقرار است' : 'خطا در اتصال',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// انتشار یک مقاله
router.post('/article', async (req, res) => {
  try {
    const { slug, publish = false } = req.body;

    const article = await contentGenerator.loadContent(slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'محتوا یافت نشد',
      });
    }

    const result = await wordpressPublisher.publishArticle(article, {
      publish,
    });

    res.json({
      success: true,
      data: result,
      message: publish ? 'منتشر شد' : 'پیش‌نویس ایجاد شد',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// انتشار محتوای امروز
router.post('/today', async (req, res) => {
  try {
    const { publish = false } = req.body;

    const todayContent = await contentCalendar.getTodayContent();

    if (!todayContent || todayContent.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'محتوایی برای امروز یافت نشد',
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const item of todayContent) {
      try {
        let article = await contentGenerator.loadContent(item.slug);

        if (!article) {
          article = await contentGenerator.generateContent(item);
        }

        const result = await wordpressPublisher.publishArticle(article, {
          publish,
        });

        results.success.push({
          title: item.title,
          link: result.link,
        });
      } catch (error) {
        results.failed.push({
          title: item.title,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `${results.success.length} موفق، ${results.failed.length} ناموفق`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// دریافت آمار انتشار
router.get('/stats', async (req, res) => {
  try {
    const stats = await wordpressPublisher.getPublishingStats();

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

export default router;
