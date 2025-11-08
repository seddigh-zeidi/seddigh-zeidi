import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

class WordPressPublisher {
  constructor(config) {
    this.config = config;
    this.baseURL = config.wordpress.url;
    this.username = config.wordpress.username;
    this.appPassword = config.wordpress.appPassword;

    // ساخت instance axios با authentication
    this.api = axios.create({
      baseURL: `${this.baseURL}/wp-json/wp/v2`,
      auth: {
        username: this.username,
        password: this.appPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * انتشار مقاله
   */
  async publishArticle(article, options = {}) {
    const spinner = ora(`در حال انتشار: ${article.title}...`).start();

    try {
      // دریافت یا ایجاد دسته‌بندی
      const categoryId = await this.getOrCreateCategory(article.category);

      // آپلود تصاویر (اگر وجود دارد)
      const featuredImageId = options.featuredImage
        ? await this.uploadImage(options.featuredImage)
        : null;

      // ساخت post data
      const postData = {
        title: article.metaTags.title,
        content: article.content,
        status: options.publish ? 'publish' : 'draft',
        categories: [categoryId],
        meta: {
          _yoast_wpseo_title: article.metaTags.title,
          _yoast_wpseo_metadesc: article.metaTags.description,
          _yoast_wpseo_focuskw: article.keyword?.keyword || '',
        },
        featured_media: featuredImageId,
      };

      // ارسال به وردپرس
      const response = await this.api.post('/posts', postData);

      spinner.succeed(chalk.green(`✓ منتشر شد: ${response.data.link}`));

      return {
        id: response.data.id,
        link: response.data.link,
        status: response.data.status,
      };

    } catch (error) {
      spinner.fail('خطا در انتشار مقاله');
      this.handleError(error);
      throw error;
    }
  }

  /**
   * دریافت یا ایجاد دسته‌بندی
   */
  async getOrCreateCategory(categoryName) {
    try {
      // جستجوی دسته موجود
      const response = await this.api.get('/categories', {
        params: { search: categoryName },
      });

      if (response.data.length > 0) {
        return response.data[0].id;
      }

      // ایجاد دسته جدید
      const createResponse = await this.api.post('/categories', {
        name: categoryName,
        slug: categoryName.replace(/\s+/g, '-'),
      });

      return createResponse.data.id;

    } catch (error) {
      console.error(chalk.red('خطا در مدیریت دسته‌بندی'));
      throw error;
    }
  }

  /**
   * آپلود تصویر
   */
  async uploadImage(imagePath) {
    try {
      const FormData = (await import('form-data')).default;
      const fs = (await import('fs')).default;

      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));

      const response = await this.api.post('/media', formData, {
        headers: formData.getHeaders(),
      });

      return response.data.id;

    } catch (error) {
      console.warn(chalk.yellow('⚠ خطا در آپلود تصویر'));
      return null;
    }
  }

  /**
   * به‌روزرسانی مقاله
   */
  async updateArticle(postId, updates) {
    try {
      const response = await this.api.post(`/posts/${postId}`, updates);
      console.log(chalk.green(`✓ مقاله ${postId} به‌روزرسانی شد`));
      return response.data;
    } catch (error) {
      console.error(chalk.red('خطا در به‌روزرسانی مقاله'));
      throw error;
    }
  }

  /**
   * حذف مقاله
   */
  async deleteArticle(postId) {
    try {
      await this.api.delete(`/posts/${postId}`);
      console.log(chalk.green(`✓ مقاله ${postId} حذف شد`));
    } catch (error) {
      console.error(chalk.red('خطا در حذف مقاله'));
      throw error;
    }
  }

  /**
   * دریافت لیست مقالات
   */
  async getPosts(params = {}) {
    try {
      const response = await this.api.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error(chalk.red('خطا در دریافت مقالات'));
      throw error;
    }
  }

  /**
   * تست اتصال
   */
  async testConnection() {
    const spinner = ora('در حال تست اتصال به وردپرس...').start();

    try {
      const response = await this.api.get('/users/me');
      spinner.succeed(chalk.green(`✓ اتصال برقرار شد. کاربر: ${response.data.name}`));
      return true;
    } catch (error) {
      spinner.fail('خطا در اتصال به وردپرس');
      this.handleError(error);
      return false;
    }
  }

  /**
   * انتشار دسته‌ای مقالات
   */
  async publishBatch(articles, options = {}) {
    console.log(chalk.blue(`\n📤 انتشار ${articles.length} مقاله...\n`));

    const results = {
      success: [],
      failed: [],
    };

    for (const article of articles) {
      try {
        const result = await this.publishArticle(article, options);
        results.success.push({ article: article.title, ...result });

        // تاخیر برای جلوگیری از rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        results.failed.push({
          article: article.title,
          error: error.message,
        });
      }
    }

    console.log(chalk.green(`\n✓ موفق: ${results.success.length}`));
    if (results.failed.length > 0) {
      console.log(chalk.red(`✗ ناموفق: ${results.failed.length}`));
      results.failed.forEach(f => {
        console.log(chalk.gray(`  - ${f.article}: ${f.error}`));
      });
    }

    return results;
  }

  /**
   * برنامه‌ریزی انتشار
   */
  async schedulePost(article, publishDate) {
    try {
      const postData = {
        title: article.metaTags.title,
        content: article.content,
        status: 'future',
        date: publishDate.toISOString(),
        categories: [await this.getOrCreateCategory(article.category)],
      };

      const response = await this.api.post('/posts', postData);
      console.log(chalk.green(`✓ برنامه‌ریزی شد برای: ${publishDate.toLocaleDateString('fa-IR')}`));

      return response.data;
    } catch (error) {
      console.error(chalk.red('خطا در برنامه‌ریزی انتشار'));
      throw error;
    }
  }

  /**
   * افزودن لینک‌های داخلی
   */
  async addInternalLinks(postId, links) {
    try {
      const post = await this.api.get(`/posts/${postId}`);
      let content = post.data.content.rendered;

      // افزودن لینک‌ها به محتوا
      links.forEach(link => {
        const linkHtml = `<a href="${link.url}" title="${link.anchor}">${link.text}</a>`;
        // جایگذاری هوشمند لینک در محتوا
        content = this.insertLinkInContent(content, linkHtml, link.position);
      });

      await this.updateArticle(postId, { content });

    } catch (error) {
      console.error(chalk.red('خطا در افزودن لینک‌های داخلی'));
    }
  }

  /**
   * جایگذاری لینک در محتوا
   */
  insertLinkInContent(content, linkHtml, position) {
    // الگوریتم ساده برای جایگذاری لینک
    const paragraphs = content.split('</p>');

    if (position === 'intro' && paragraphs.length > 0) {
      paragraphs[0] += ` ${linkHtml}`;
    } else if (position === 'content' && paragraphs.length > 2) {
      const midPoint = Math.floor(paragraphs.length / 2);
      paragraphs[midPoint] += ` ${linkHtml}`;
    }

    return paragraphs.join('</p>');
  }

  /**
   * مدیریت خطاها
   */
  handleError(error) {
    if (error.response) {
      console.error(chalk.red(`خطای ${error.response.status}: ${error.response.statusText}`));

      if (error.response.status === 401) {
        console.error(chalk.yellow('⚠ احراز هویت ناموفق. لطفا اطلاعات وردپرس را بررسی کنید.'));
      } else if (error.response.status === 403) {
        console.error(chalk.yellow('⚠ دسترسی رد شد. کاربر دسترسی لازم را ندارد.'));
      }

      if (error.response.data?.message) {
        console.error(chalk.gray(`پیام: ${error.response.data.message}`));
      }
    } else {
      console.error(chalk.red(error.message));
    }
  }

  /**
   * دریافت آمار انتشار
   */
  async getPublishingStats() {
    try {
      const posts = await this.getPosts({ per_page: 100 });

      const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'publish').length,
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'future').length,
      };

      return stats;
    } catch (error) {
      return null;
    }
  }

  /**
   * نمایش آمار
   */
  async displayStats() {
    const stats = await this.getPublishingStats();

    if (!stats) {
      console.log(chalk.yellow('آماری یافت نشد'));
      return;
    }

    console.log(chalk.blue('\n📊 آمار وردپرس\n'));
    console.log(`کل مقالات: ${stats.total}`);
    console.log(`منتشر شده: ${stats.published}`);
    console.log(`پیش‌نویس: ${stats.draft}`);
    console.log(`برنامه‌ریزی شده: ${stats.scheduled}`);
    console.log();
  }
}

export default WordPressPublisher;
