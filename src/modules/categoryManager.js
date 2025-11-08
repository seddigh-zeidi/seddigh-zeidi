import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

class CategoryManager {
  constructor(dataPath = './data/categories') {
    this.dataPath = dataPath;
    this.categoriesFile = path.join(dataPath, 'categories.json');
  }

  /**
   * دریافت دسته‌بندی‌ها از کاربر
   */
  async getCategories() {
    console.log(chalk.blue('\n📁 مدیریت دسته‌بندی‌های سایت\n'));

    const categories = [];
    let addMore = true;

    while (addMore) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'نام دسته‌بندی:',
          validate: (input) => input.trim() ? true : 'نام دسته‌بندی نمی‌تواند خالی باشد',
        },
        {
          type: 'input',
          name: 'slug',
          message: 'اسلاگ دسته‌بندی (URL-friendly):',
          validate: (input) => input.trim() ? true : 'اسلاگ نمی‌تواند خالی باشد',
        },
        {
          type: 'input',
          name: 'description',
          message: 'توضیحات کوتاه:',
        },
        {
          type: 'number',
          name: 'priority',
          message: 'اولویت (1-10):',
          default: 5,
          validate: (input) => input >= 1 && input <= 10 ? true : 'اولویت باید بین 1 تا 10 باشد',
        },
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'دسته‌بندی دیگری اضافه می‌کنید؟',
          default: true,
        },
      ]);

      categories.push({
        id: Date.now() + Math.random(),
        name: answers.name,
        slug: answers.slug,
        description: answers.description,
        priority: answers.priority,
        createdAt: new Date().toISOString(),
      });

      addMore = answers.addAnother;
    }

    await this.saveCategories(categories);
    console.log(chalk.green(`\n✓ ${categories.length} دسته‌بندی ذخیره شد\n`));
    return categories;
  }

  /**
   * ذخیره دسته‌بندی‌ها
   */
  async saveCategories(categories) {
    await fs.mkdir(this.dataPath, { recursive: true });
    await fs.writeFile(
      this.categoriesFile,
      JSON.stringify(categories, null, 2),
      'utf-8'
    );
  }

  /**
   * بارگذاری دسته‌بندی‌های ذخیره شده
   */
  async loadCategories() {
    try {
      const data = await fs.readFile(this.categoriesFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(chalk.yellow('⚠ هیچ دسته‌بندی ذخیره شده‌ای یافت نشد'));
        return null;
      }
      throw error;
    }
  }

  /**
   * نمایش دسته‌بندی‌ها
   */
  async displayCategories() {
    const categories = await this.loadCategories();
    if (!categories || categories.length === 0) {
      console.log(chalk.yellow('هیچ دسته‌بندی وجود ندارد'));
      return;
    }

    console.log(chalk.blue('\n📋 دسته‌بندی‌های ثبت شده:\n'));
    categories
      .sort((a, b) => b.priority - a.priority)
      .forEach((cat, index) => {
        console.log(chalk.cyan(`${index + 1}. ${cat.name}`));
        console.log(`   اسلاگ: ${cat.slug}`);
        console.log(`   اولویت: ${cat.priority}`);
        if (cat.description) {
          console.log(`   توضیحات: ${cat.description}`);
        }
        console.log();
      });
  }

  /**
   * حذف دسته‌بندی
   */
  async deleteCategory(categoryId) {
    const categories = await this.loadCategories();
    const filtered = categories.filter(cat => cat.id !== categoryId);
    await this.saveCategories(filtered);
  }

  /**
   * ویرایش دسته‌بندی
   */
  async editCategory(categoryId, updates) {
    const categories = await this.loadCategories();
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      await this.saveCategories(categories);
    }
  }
}

export default CategoryManager;
