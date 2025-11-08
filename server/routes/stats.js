import express from 'express';
import CategoryManager from '../../src/modules/categoryManager.js';
import KeywordResearch from '../../src/modules/keywordResearch.js';
import ContentCalendar from '../../src/modules/contentCalendar.js';
import WordPressPublisher from '../../src/modules/wordpressPublisher.js';
import config from '../../config/default.js';

const router = express.Router();
const categoryManager = new CategoryManager(config.paths.categories);
const keywordResearch = new KeywordResearch(config);
const contentCalendar = new ContentCalendar(config);
const wordpressPublisher = new WordPressPublisher(config);

// دریافت آمار کلی سیستم
router.get('/overview', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories() || [];
    const calendarStats = await contentCalendar.getCalendarStats();

    // آمار کلمات کلیدی
    let totalKeywords = 0;
    const keywordsByCategory = {};

    for (const cat of categories) {
      const keywords = await keywordResearch.loadKeywords(cat.slug);
      totalKeywords += keywords.length;
      keywordsByCategory[cat.slug] = keywords.length;
    }

    // آمار وردپرس (اگر موجود باشد)
    let wpStats = null;
    try {
      wpStats = await wordpressPublisher.getPublishingStats();
    } catch (error) {
      // اگر اتصال به وردپرس نباشد
    }

    res.json({
      success: true,
      data: {
        categories: {
          total: categories.length,
          items: categories,
        },
        keywords: {
          total: totalKeywords,
          byCategory: keywordsByCategory,
        },
        calendar: calendarStats,
        wordpress: wpStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// آمار دسته‌بندی‌ها
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories() || [];

    const stats = {
      total: categories.length,
      byPriority: {},
      items: categories,
    };

    categories.forEach(cat => {
      const priority = cat.priority || 5;
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    });

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

// آمار کلمات کلیدی
router.get('/keywords', async (req, res) => {
  try {
    const categories = await categoryManager.loadCategories() || [];

    const stats = {
      total: 0,
      byCategory: {},
      byType: {
        informational: 0,
        commercial: 0,
        transactional: 0,
        navigational: 0,
      },
      topKeywords: [],
    };

    const allKeywords = [];

    for (const cat of categories) {
      const keywords = await keywordResearch.loadKeywords(cat.slug);

      stats.total += keywords.length;
      stats.byCategory[cat.slug] = {
        name: cat.name,
        count: keywords.length,
      };

      keywords.forEach(kw => {
        stats.byType[kw.type]++;
        allKeywords.push({ ...kw, category: cat.name });
      });
    }

    // برترین کلمات کلیدی
    stats.topKeywords = allKeywords
      .sort((a, b) => b.searchVolume - a.searchVolume)
      .slice(0, 10);

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

// آمار تقویم
router.get('/calendar', async (req, res) => {
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

export default router;
