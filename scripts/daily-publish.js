#!/usr/bin/env node

/**
 * اسکریپت انتشار روزانه خودکار
 * این اسکریپت را می‌توانید با cron job اجرا کنید
 *
 * مثال crontab:
 * 0 9 * * * cd /path/to/project && node scripts/daily-publish.js
 */

import config from '../config/default.js';
import ContentCalendar from '../src/modules/contentCalendar.js';
import ContentGenerator from '../src/modules/contentGenerator.js';
import WordPressPublisher from '../src/modules/wordpressPublisher.js';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

const contentCalendar = new ContentCalendar(config);
const contentGenerator = new ContentGenerator(config);
const wordpressPublisher = new WordPressPublisher(config);

const LOG_FILE = './logs/daily-publish.log';

/**
 * نوشتن لاگ
 */
async function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(message);

  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.appendFile(LOG_FILE, logMessage);
}

/**
 * اجرای انتشار روزانه
 */
async function dailyPublish() {
  await log(chalk.blue('🚀 شروع فرآیند انتشار روزانه'));

  try {
    // تست اتصال به وردپرس
    await log('تست اتصال به وردپرس...');
    const connected = await wordpressPublisher.testConnection();

    if (!connected) {
      await log(chalk.red('❌ خطا در اتصال به وردپرس'));
      return;
    }

    // دریافت محتوای امروز
    await log('دریافت محتوای امروز از تقویم...');
    const todayContent = await contentCalendar.getTodayContent();

    if (!todayContent || todayContent.length === 0) {
      await log(chalk.yellow('⚠ محتوایی برای امروز برنامه‌ریزی نشده است'));
      return;
    }

    await log(`${todayContent.length} محتوا برای انتشار یافت شد`);

    // تولید و انتشار هر محتوا
    const results = {
      success: [],
      failed: [],
    };

    for (let i = 0; i < todayContent.length; i++) {
      const item = todayContent[i];

      try {
        await log(`\n[${i + 1}/${todayContent.length}] در حال پردازش: ${item.title}`);

        // بررسی اینکه محتوا قبلا تولید شده یا نه
        let article = await contentGenerator.loadContent(item.slug);

        if (!article) {
          await log('تولید محتوا...');
          article = await contentGenerator.generateContent(item);
        } else {
          await log('محتوا قبلا تولید شده است');
        }

        // انتشار روی وردپرس
        await log('انتشار روی وردپرس...');
        const publishResult = await wordpressPublisher.publishArticle(article, {
          publish: true,
        });

        // به‌روزرسانی وضعیت در تقویم
        await contentCalendar.updateContentStatus(new Date(), i, 'published');

        results.success.push({
          title: item.title,
          link: publishResult.link,
        });

        await log(chalk.green(`✓ منتشر شد: ${publishResult.link}`));

        // تاخیر بین انتشارها
        if (i < todayContent.length - 1) {
          await log('تاخیر 30 ثانیه...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }

      } catch (error) {
        results.failed.push({
          title: item.title,
          error: error.message,
        });

        await log(chalk.red(`✗ خطا در "${item.title}": ${error.message}`));
      }
    }

    // گزارش نهایی
    await log(chalk.blue('\n📊 گزارش نهایی:'));
    await log(chalk.green(`✓ موفق: ${results.success.length}`));

    if (results.failed.length > 0) {
      await log(chalk.red(`✗ ناموفق: ${results.failed.length}`));
      results.failed.forEach(f => {
        log(chalk.gray(`  - ${f.title}: ${f.error}`));
      });
    }

    // ذخیره گزارش
    const reportPath = `./logs/report-${new Date().toISOString().split('T')[0]}.json`;
    await fs.writeFile(
      reportPath,
      JSON.stringify({
        date: new Date().toISOString(),
        total: todayContent.length,
        success: results.success,
        failed: results.failed,
      }, null, 2)
    );

    await log(`\n📄 گزارش ذخیره شد: ${reportPath}`);
    await log(chalk.green('\n✅ فرآیند انتشار روزانه با موفقیت انجام شد'));

  } catch (error) {
    await log(chalk.red(`\n❌ خطای کلی: ${error.message}`));
    await log(error.stack);
  }
}

// اجرا
dailyPublish().catch(error => {
  console.error('خطای غیرمنتظره:', error);
  process.exit(1);
});
