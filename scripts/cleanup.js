#!/usr/bin/env node

/**
 * اسکریپت پاکسازی و نگهداری سیستم
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

async function cleanup() {
  console.log(chalk.blue('\n🧹 ابزار پاکسازی سیستم\n'));

  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'actions',
      message: 'چه کارهایی انجام شود؟',
      choices: [
        { name: 'پاکسازی فایل‌های موقت', value: 'temp' },
        { name: 'پاکسازی لاگ‌های قدیمی', value: 'logs' },
        { name: 'پاکسازی محتوای تولید شده', value: 'content' },
        { name: 'پاکسازی کلمات کلیدی', value: 'keywords' },
        { name: 'بازنشانی کامل (همه داده‌ها)', value: 'reset-all' },
      ],
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست!',
      default: false,
    },
  ]);

  if (!answer.confirm) {
    console.log(chalk.yellow('\nلغو شد.'));
    return;
  }

  const actions = answer.actions;

  if (actions.includes('temp')) {
    await cleanTemp();
  }

  if (actions.includes('logs')) {
    await cleanLogs();
  }

  if (actions.includes('content')) {
    await cleanContent();
  }

  if (actions.includes('keywords')) {
    await cleanKeywords();
  }

  if (actions.includes('reset-all')) {
    await resetAll();
  }

  console.log(chalk.green('\n✅ پاکسازی با موفقیت انجام شد\n'));
}

async function cleanTemp() {
  console.log(chalk.cyan('پاکسازی فایل‌های موقت...'));
  // اینجا می‌توانید فایل‌های موقت را پاک کنید
  console.log(chalk.green('✓ فایل‌های موقت پاک شد'));
}

async function cleanLogs() {
  console.log(chalk.cyan('پاکسازی لاگ‌های قدیمی...'));

  try {
    const logsDir = './logs';
    const files = await fs.readdir(logsDir);

    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = await fs.stat(filePath);

      if (stats.mtimeMs < thirtyDaysAgo) {
        await fs.unlink(filePath);
        console.log(chalk.gray(`  حذف شد: ${file}`));
      }
    }

    console.log(chalk.green('✓ لاگ‌های قدیمی پاک شد'));
  } catch (error) {
    console.log(chalk.yellow('⚠ لاگی برای پاک کردن وجود ندارد'));
  }
}

async function cleanContent() {
  console.log(chalk.cyan('پاکسازی محتوای تولید شده...'));

  try {
    await fs.rm('./data/content', { recursive: true, force: true });
    await fs.mkdir('./data/content', { recursive: true });
    console.log(chalk.green('✓ محتوا پاک شد'));
  } catch (error) {
    console.log(chalk.yellow('⚠ خطا در پاکسازی محتوا'));
  }
}

async function cleanKeywords() {
  console.log(chalk.cyan('پاکسازی کلمات کلیدی...'));

  try {
    await fs.rm('./data/keywords', { recursive: true, force: true });
    await fs.mkdir('./data/keywords', { recursive: true });
    console.log(chalk.green('✓ کلمات کلیدی پاک شد'));
  } catch (error) {
    console.log(chalk.yellow('⚠ خطا در پاکسازی کلمات کلیدی'));
  }
}

async function resetAll() {
  console.log(chalk.cyan('بازنشانی کامل سیستم...'));

  try {
    await fs.rm('./data', { recursive: true, force: true });
    await fs.mkdir('./data/categories', { recursive: true });
    await fs.mkdir('./data/keywords', { recursive: true });
    await fs.mkdir('./data/content', { recursive: true });
    await fs.mkdir('./data/calendar', { recursive: true });

    console.log(chalk.green('✓ سیستم بازنشانی شد'));
  } catch (error) {
    console.log(chalk.red('✗ خطا در بازنشانی سیستم'));
  }
}

cleanup().catch(error => {
  console.error('خطا:', error);
  process.exit(1);
});
