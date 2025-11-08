#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import config from '../config/default.js';

// Import modules
import CategoryManager from './modules/categoryManager.js';
import KeywordResearch from './modules/keywordResearch.js';
import PillarClusterSystem from './modules/pillarCluster.js';
import ContentCalendar from './modules/contentCalendar.js';
import ContentGenerator from './modules/contentGenerator.js';
import WordPressPublisher from './modules/wordpressPublisher.js';

// Initialize modules
const categoryManager = new CategoryManager(config.paths.categories);
const keywordResearch = new KeywordResearch(config);
const pillarCluster = new PillarClusterSystem(config);
const contentCalendar = new ContentCalendar(config);
const contentGenerator = new ContentGenerator(config);
const wordpressPublisher = new WordPressPublisher(config);

/**
 * نمایش بنر
 */
function displayBanner() {
  console.clear();
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 سیستم سئو و تولید محتوای حرفه‌ای                    ║
║                                                           ║
║   نسخه: 1.0.0                                            ║
║   برای مجلات آنلاین                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

/**
 * منوی اصلی
 */
async function mainMenu() {
  displayBanner();

  const choices = [
    { name: '📁 مدیریت دسته‌بندی‌ها', value: 'categories' },
    { name: '🔍 تحقیق کلمات کلیدی', value: 'keyword-research' },
    { name: '🏗️  ساخت ساختار Pillar-Cluster', value: 'pillar-cluster' },
    { name: '📅 ایجاد تقویم محتوایی', value: 'calendar' },
    { name: '✍️  تولید محتوا', value: 'generate-content' },
    { name: '📤 انتشار روی وردپرس', value: 'publish' },
    { name: '🔄 فرآیند کامل (تمام مراحل)', value: 'full-process' },
    { name: '⚙️  تنظیمات', value: 'settings' },
    { name: '📊 آمار و گزارش', value: 'stats' },
    new inquirer.Separator(),
    { name: '🚪 خروج', value: 'exit' },
  ];

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'چه کاری می‌خواهید انجام دهید؟',
      choices,
    },
  ]);

  return answer.action;
}

/**
 * مدیریت دسته‌بندی‌ها
 */
async function manageCategoriesMenu() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'مدیریت دسته‌بندی‌ها:',
      choices: [
        { name: 'افزودن دسته‌بندی‌ها', value: 'add' },
        { name: 'نمایش دسته‌بندی‌ها', value: 'view' },
        { name: 'بازگشت', value: 'back' },
      ],
    },
  ]);

  if (answer.action === 'add') {
    await categoryManager.getCategories();
  } else if (answer.action === 'view') {
    await categoryManager.displayCategories();
    await waitForEnter();
  }
}

/**
 * تحقیق کلمات کلیدی
 */
async function keywordResearchProcess() {
  const categories = await categoryManager.loadCategories();

  if (!categories || categories.length === 0) {
    console.log(chalk.yellow('\n⚠ ابتدا باید دسته‌بندی‌ها را تعریف کنید\n'));
    await waitForEnter();
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: `تحقیق کلمات کلیدی برای ${categories.length} دسته‌بندی؟`,
      default: true,
    },
  ]);

  if (answer.proceed) {
    await keywordResearch.researchAllCategories(categories);
    await waitForEnter();
  }
}

/**
 * ساخت ساختار Pillar-Cluster
 */
async function buildPillarCluster() {
  const categories = await categoryManager.loadCategories();

  if (!categories || categories.length === 0) {
    console.log(chalk.yellow('\n⚠ ابتدا دسته‌بندی‌ها را تعریف کنید\n'));
    await waitForEnter();
    return;
  }

  // بارگذاری کلمات کلیدی
  const allKeywords = {};
  for (const cat of categories) {
    allKeywords[cat.slug] = await keywordResearch.loadKeywords(cat.slug);
  }

  const hasKeywords = Object.values(allKeywords).some(kws => kws.length > 0);

  if (!hasKeywords) {
    console.log(chalk.yellow('\n⚠ ابتدا تحقیق کلمات کلیدی را انجام دهید\n'));
    await waitForEnter();
    return;
  }

  await pillarCluster.createAllPillarStructures(categories, allKeywords);
  await waitForEnter();
}

/**
 * ایجاد تقویم محتوایی
 */
async function createContentCalendar() {
  const categories = await categoryManager.loadCategories();

  if (!categories || categories.length === 0) {
    console.log(chalk.yellow('\n⚠ ابتدا دسته‌بندی‌ها را تعریف کنید\n'));
    await waitForEnter();
    return;
  }

  // بارگذاری ساختارهای Pillar
  const pillarStructures = [];
  for (const cat of categories) {
    const structure = await pillarCluster.loadPillarStructure(cat.slug);
    if (structure) {
      pillarStructures.push(structure);
    }
  }

  if (pillarStructures.length === 0) {
    console.log(chalk.yellow('\n⚠ ابتدا ساختار Pillar-Cluster را ایجاد کنید\n'));
    await waitForEnter();
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'number',
      name: 'days',
      message: 'تقویم برای چند روز؟',
      default: 30,
    },
  ]);

  await contentCalendar.generateCalendar(pillarStructures, answer.days);
  await contentCalendar.displayCalendar(7);
  await waitForEnter();
}

/**
 * تولید محتوا
 */
async function generateContentProcess() {
  const calendar = await contentCalendar.loadCalendar();

  if (!calendar || calendar.length === 0) {
    console.log(chalk.yellow('\n⚠ ابتدا تقویم محتوایی را ایجاد کنید\n'));
    await waitForEnter();
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'scope',
      message: 'تولید محتوا برای:',
      choices: [
        { name: 'محتوای امروز', value: 'today' },
        { name: 'تعداد مشخص', value: 'count' },
        { name: 'همه محتوا', value: 'all' },
      ],
    },
  ]);

  let contentItems = [];

  if (answer.scope === 'today') {
    contentItems = await contentCalendar.getTodayContent();
  } else if (answer.scope === 'count') {
    const countAnswer = await inquirer.prompt([
      {
        type: 'number',
        name: 'count',
        message: 'چند محتوا؟',
        default: 5,
      },
    ]);

    // دریافت اولین N محتوا
    for (const day of calendar) {
      for (const item of day.content) {
        if (contentItems.length < countAnswer.count) {
          contentItems.push(item);
        }
      }
    }
  } else {
    // همه محتوا
    for (const day of calendar) {
      contentItems.push(...day.content);
    }
  }

  if (contentItems.length === 0) {
    console.log(chalk.yellow('\nمحتوایی برای تولید یافت نشد\n'));
    await waitForEnter();
    return;
  }

  await contentGenerator.generateBatchContent(contentItems);
  await waitForEnter();
}

/**
 * انتشار روی وردپرس
 */
async function publishToWordPress() {
  // تست اتصال
  const connected = await wordpressPublisher.testConnection();

  if (!connected) {
    console.log(chalk.yellow('\n⚠ لطفا تنظیمات وردپرس را در فایل .env بررسی کنید\n'));
    await waitForEnter();
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'scope',
      message: 'انتشار:',
      choices: [
        { name: 'محتوای امروز', value: 'today' },
        { name: 'تعداد مشخص', value: 'count' },
        { name: 'انتخاب دستی', value: 'manual' },
      ],
    },
    {
      type: 'confirm',
      name: 'publish',
      message: 'انتشار فوری؟ (در غیر این صورت draft می‌شود)',
      default: false,
    },
  ]);

  // در اینجا باید محتوای تولید شده را بارگذاری کنیم
  // برای سادگی، فرض می‌کنیم لیستی از مقالات داریم

  console.log(chalk.yellow('\n💡 این قسمت به محتوای تولید شده نیاز دارد\n'));
  await waitForEnter();
}

/**
 * فرآیند کامل
 */
async function fullProcess() {
  console.log(chalk.blue('\n🚀 شروع فرآیند کامل سئو و تولید محتوا\n'));

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'این فرآیند تمام مراحل را انجام می‌دهد. ادامه؟',
      default: true,
    },
  ]);

  if (!answer.proceed) return;

  try {
    // مرحله 1: دسته‌بندی‌ها
    console.log(chalk.cyan('\n📍 مرحله 1: دسته‌بندی‌ها'));
    let categories = await categoryManager.loadCategories();

    if (!categories || categories.length === 0) {
      categories = await categoryManager.getCategories();
    } else {
      console.log(chalk.green(`✓ ${categories.length} دسته‌بندی بارگذاری شد`));
    }

    // مرحله 2: تحقیق کلمات کلیدی
    console.log(chalk.cyan('\n📍 مرحله 2: تحقیق کلمات کلیدی'));
    const allKeywords = await keywordResearch.researchAllCategories(categories);

    // مرحله 3: ساختار Pillar-Cluster
    console.log(chalk.cyan('\n📍 مرحله 3: ساختار Pillar-Cluster'));
    const pillarStructures = await pillarCluster.createAllPillarStructures(
      categories,
      allKeywords
    );

    // مرحله 4: تقویم محتوایی
    console.log(chalk.cyan('\n📍 مرحله 4: تقویم محتوایی'));
    const daysAnswer = await inquirer.prompt([
      {
        type: 'number',
        name: 'days',
        message: 'تعداد روزهای تقویم:',
        default: 30,
      },
    ]);

    const calendar = await contentCalendar.generateCalendar(
      pillarStructures,
      daysAnswer.days
    );

    // مرحله 5: تولید محتوا
    console.log(chalk.cyan('\n📍 مرحله 5: تولید محتوا'));
    const contentAnswer = await inquirer.prompt([
      {
        type: 'number',
        name: 'count',
        message: 'چند محتوا تولید شود؟',
        default: 5,
      },
    ]);

    const contentItems = [];
    for (const day of calendar) {
      for (const item of day.content) {
        if (contentItems.length < contentAnswer.count) {
          contentItems.push(item);
        }
      }
    }

    await contentGenerator.generateBatchContent(contentItems);

    console.log(chalk.green('\n✅ فرآیند کامل با موفقیت انجام شد!\n'));

    // نمایش خلاصه
    console.log(chalk.blue('📊 خلاصه:'));
    console.log(`  دسته‌بندی: ${categories.length}`);
    console.log(`  کلمات کلیدی: ${Object.values(allKeywords).flat().length}`);
    console.log(`  ساختار Pillar: ${pillarStructures.length}`);
    console.log(`  تقویم: ${calendar.length} روز`);
    console.log(`  محتوا تولید شده: ${contentItems.length}`);
    console.log();

  } catch (error) {
    console.error(chalk.red('\n❌ خطا در فرآیند:'), error.message);
  }

  await waitForEnter();
}

/**
 * نمایش آمار
 */
async function showStats() {
  console.log(chalk.blue('\n📊 آمار و گزارش سیستم\n'));

  // آمار دسته‌بندی‌ها
  const categories = await categoryManager.loadCategories();
  console.log(chalk.cyan('دسته‌بندی‌ها:'));
  console.log(`  تعداد: ${categories?.length || 0}`);

  // آمار تقویم
  await contentCalendar.displayStats();

  // آمار وردپرس (اگر متصل باشد)
  try {
    await wordpressPublisher.displayStats();
  } catch (error) {
    console.log(chalk.gray('(آمار وردپرس در دسترس نیست)'));
  }

  await waitForEnter();
}

/**
 * تنظیمات
 */
async function settings() {
  console.log(chalk.blue('\n⚙️  تنظیمات سیستم\n'));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'تنظیمات:',
      choices: [
        { name: 'تست اتصال وردپرس', value: 'test-wp' },
        { name: 'نمایش تنظیمات فعلی', value: 'show' },
        { name: 'بازگشت', value: 'back' },
      ],
    },
  ]);

  if (answer.action === 'test-wp') {
    await wordpressPublisher.testConnection();
    await waitForEnter();
  } else if (answer.action === 'show') {
    console.log(chalk.gray('\nتنظیمات فعلی:\n'));
    console.log(`WordPress URL: ${config.wordpress.url || 'تنظیم نشده'}`);
    console.log(`محتوا در روز: ${config.content.dailyCount}`);
    console.log(`حداقل کلمات: ${config.content.minWordCount}`);
    console.log(`زبان: ${config.content.language}`);
    console.log();
    await waitForEnter();
  }
}

/**
 * انتظار برای Enter
 */
async function waitForEnter() {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'برای ادامه Enter بزنید...',
    },
  ]);
}

/**
 * اجرای برنامه اصلی
 */
async function run() {
  let running = true;

  while (running) {
    const action = await mainMenu();

    switch (action) {
      case 'categories':
        await manageCategoriesMenu();
        break;

      case 'keyword-research':
        await keywordResearchProcess();
        break;

      case 'pillar-cluster':
        await buildPillarCluster();
        break;

      case 'calendar':
        await createContentCalendar();
        break;

      case 'generate-content':
        await generateContentProcess();
        break;

      case 'publish':
        await publishToWordPress();
        break;

      case 'full-process':
        await fullProcess();
        break;

      case 'stats':
        await showStats();
        break;

      case 'settings':
        await settings();
        break;

      case 'exit':
        console.log(chalk.cyan('\n👋 خداحافظ!\n'));
        running = false;
        break;
    }
  }
}

// اجرای برنامه
run().catch(error => {
  console.error(chalk.red('خطای غیرمنتظره:'), error);
  process.exit(1);
});
