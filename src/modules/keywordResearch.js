import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

class KeywordResearch {
  constructor(config) {
    this.config = config;
    this.dataPath = config.paths.keywords;
  }

  /**
   * تولید کلمات کلیدی مرتبط بر اساس دسته‌بندی
   */
  async generateKeywords(category) {
    const spinner = ora(`در حال تحقیق کلمات کلیدی برای "${category.name}"...`).start();

    try {
      // استفاده از Google Suggest API (رایگان)
      const suggestions = await this.getGoogleSuggestions(category.name);

      // تولید variations
      const variations = this.generateKeywordVariations(category.name);

      // ترکیب long-tail keywords
      const longTailKeywords = this.generateLongTailKeywords(category.name);

      // تحلیل و امتیازدهی
      const keywords = [...suggestions, ...variations, ...longTailKeywords]
        .filter((v, i, a) => a.indexOf(v) === i) // حذف تکراری‌ها
        .map(keyword => ({
          keyword,
          category: category.slug,
          searchVolume: this.estimateSearchVolume(keyword),
          difficulty: this.estimateDifficulty(keyword),
          type: this.classifyKeywordType(keyword),
          createdAt: new Date().toISOString(),
        }))
        .sort((a, b) => b.searchVolume - a.searchVolume);

      spinner.succeed(chalk.green(`✓ ${keywords.length} کلمه کلیدی یافت شد`));

      await this.saveKeywords(category.slug, keywords);
      return keywords;

    } catch (error) {
      spinner.fail('خطا در تحقیق کلمات کلیدی');
      console.error(chalk.red(error.message));
      return [];
    }
  }

  /**
   * دریافت پیشنهادات گوگل
   */
  async getGoogleSuggestions(query) {
    try {
      const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      return response.data[1] || [];
    } catch (error) {
      console.warn(chalk.yellow('⚠ عدم دسترسی به Google Suggest'));
      return [];
    }
  }

  /**
   * تولید variations کلمات کلیدی
   */
  generateKeywordVariations(baseKeyword) {
    const prefixes = [
      'آموزش', 'راهنمای', 'بهترین', 'نحوه', 'چگونه', 'روش',
      'معرفی', 'بررسی', 'مقایسه', 'خرید', 'قیمت', 'مزایا', 'معایب'
    ];

    const suffixes = [
      'چیست', 'کجاست', 'چطور', 'چه‌طور', 'به چه صورت',
      'در سال 2024', 'به زبان ساده', 'کامل', 'حرفه‌ای'
    ];

    const variations = [];

    // ترکیب با prefix
    prefixes.forEach(prefix => {
      variations.push(`${prefix} ${baseKeyword}`);
    });

    // ترکیب با suffix
    suffixes.forEach(suffix => {
      variations.push(`${baseKeyword} ${suffix}`);
    });

    return variations;
  }

  /**
   * تولید long-tail keywords
   */
  generateLongTailKeywords(baseKeyword) {
    const questionWords = ['چیست', 'چگونه', 'چرا', 'کجا', 'کی', 'چه‌طور'];
    const longTails = [];

    questionWords.forEach(question => {
      longTails.push(`${baseKeyword} ${question}`);
      longTails.push(`${question} ${baseKeyword}`);
    });

    // سوالات رایج
    longTails.push(`بهترین ${baseKeyword} کدام است`);
    longTails.push(`مزایا و معایب ${baseKeyword}`);
    longTails.push(`راهنمای خرید ${baseKeyword}`);
    longTails.push(`قیمت ${baseKeyword}`);
    longTails.push(`آموزش کامل ${baseKeyword}`);

    return longTails;
  }

  /**
   * تخمین حجم جستجو (الگوریتم ساده)
   */
  estimateSearchVolume(keyword) {
    // الگوریتم ساده بر اساس طول و محبوبیت
    const length = keyword.split(' ').length;
    const baseVolume = 1000;

    if (length === 1) return Math.floor(baseVolume * 5 * Math.random());
    if (length === 2) return Math.floor(baseVolume * 3 * Math.random());
    if (length === 3) return Math.floor(baseVolume * 2 * Math.random());
    return Math.floor(baseVolume * Math.random());
  }

  /**
   * تخمین سختی رقابت
   */
  estimateDifficulty(keyword) {
    const length = keyword.split(' ').length;

    if (length === 1) return Math.floor(Math.random() * 40) + 60; // 60-100
    if (length === 2) return Math.floor(Math.random() * 40) + 40; // 40-80
    if (length === 3) return Math.floor(Math.random() * 30) + 20; // 20-50
    return Math.floor(Math.random() * 20) + 10; // 10-30
  }

  /**
   * طبقه‌بندی نوع کلمه کلیدی
   */
  classifyKeywordType(keyword) {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerKeyword.includes('خرید') || lowerKeyword.includes('قیمت')) {
      return 'transactional';
    }
    if (lowerKeyword.includes('چیست') || lowerKeyword.includes('آموزش') ||
        lowerKeyword.includes('راهنما')) {
      return 'informational';
    }
    if (lowerKeyword.includes('بهترین') || lowerKeyword.includes('مقایسه')) {
      return 'commercial';
    }
    return 'navigational';
  }

  /**
   * ذخیره کلمات کلیدی
   */
  async saveKeywords(categorySlug, keywords) {
    await fs.mkdir(this.dataPath, { recursive: true });
    const filePath = path.join(this.dataPath, `${categorySlug}.json`);
    await fs.writeFile(filePath, JSON.stringify(keywords, null, 2), 'utf-8');
  }

  /**
   * بارگذاری کلمات کلیدی
   */
  async loadKeywords(categorySlug) {
    try {
      const filePath = path.join(this.dataPath, `${categorySlug}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  /**
   * تحقیق کلمات کلیدی برای تمام دسته‌بندی‌ها
   */
  async researchAllCategories(categories) {
    console.log(chalk.blue('\n🔍 شروع تحقیق کلمات کلیدی...\n'));

    const results = {};

    for (const category of categories) {
      const keywords = await this.generateKeywords(category);
      results[category.slug] = keywords;

      // تاخیر کوتاه برای جلوگیری از rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(chalk.green('\n✓ تحقیق کلمات کلیدی تمام شد\n'));
    return results;
  }

  /**
   * نمایش آمار کلمات کلیدی
   */
  async displayKeywordStats(categorySlug) {
    const keywords = await this.loadKeywords(categorySlug);

    if (keywords.length === 0) {
      console.log(chalk.yellow('هیچ کلمه کلیدی یافت نشد'));
      return;
    }

    console.log(chalk.blue(`\n📊 آمار کلمات کلیدی "${categorySlug}":\n`));
    console.log(`تعداد کل: ${keywords.length}`);

    const byType = keywords.reduce((acc, kw) => {
      acc[kw.type] = (acc[kw.type] || 0) + 1;
      return acc;
    }, {});

    console.log('\nبر اساس نوع:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    console.log('\nبرترین کلمات کلیدی:');
    keywords.slice(0, 10).forEach((kw, i) => {
      console.log(chalk.cyan(`${i + 1}. ${kw.keyword}`));
      console.log(`   حجم: ${kw.searchVolume} | سختی: ${kw.difficulty} | نوع: ${kw.type}`);
    });
  }
}

export default KeywordResearch;
