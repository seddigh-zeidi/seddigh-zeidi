import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

class ContentGenerator {
  constructor(config) {
    this.config = config;
    this.dataPath = config.paths.content;
    this.minWords = config.content.minWordCount;
    this.maxWords = config.content.maxWordCount;
  }

  /**
   * تولید محتوای سئو شده
   */
  async generateContent(contentItem, relatedContent = []) {
    const spinner = ora(`در حال تولید محتوا: ${contentItem.title}...`).start();

    try {
      // ساخت outline
      const outline = this.createOutline(contentItem);

      // تولید محتوای اصلی
      const content = await this.generateMainContent(contentItem, outline);

      // افزودن متا تگ‌ها
      const metaTags = this.generateMetaTags(contentItem);

      // افزودن لینک‌های داخلی
      const internalLinks = this.generateInternalLinks(contentItem, relatedContent);

      // پیشنهاد تصاویر
      const imageSuggestions = this.generateImageSuggestions(contentItem, outline);

      // ساخت ساختار نهایی
      const article = {
        title: contentItem.title,
        slug: contentItem.slug,
        category: contentItem.category,
        type: contentItem.type,
        keyword: contentItem.keyword,
        metaTags,
        outline,
        content,
        internalLinks,
        imageSuggestions,
        wordCount: this.countWords(content),
        readingTime: this.calculateReadingTime(content),
        createdAt: new Date().toISOString(),
        status: 'draft',
      };

      // ذخیره محتوا
      await this.saveContent(article);

      spinner.succeed(chalk.green(`✓ محتوا تولید شد: ${article.wordCount} کلمه`));

      return article;

    } catch (error) {
      spinner.fail('خطا در تولید محتوا');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  /**
   * ساخت outline مقاله
   */
  createOutline(contentItem) {
    const isPillar = contentItem.type === 'pillar';
    const keyword = contentItem.keyword?.keyword || contentItem.title;

    const outline = [
      {
        level: 1,
        title: contentItem.title,
        type: 'h1',
      },
      {
        level: 2,
        title: `${keyword} چیست؟`,
        type: 'h2',
        keywords: [keyword, 'تعریف', 'معنی'],
      },
    ];

    if (isPillar) {
      // برای Pillar Content - جامع‌تر
      outline.push(
        {
          level: 2,
          title: `اهمیت و کاربردهای ${keyword}`,
          type: 'h2',
          keywords: [keyword, 'اهمیت', 'کاربرد'],
        },
        {
          level: 2,
          title: `انواع ${keyword}`,
          type: 'h2',
          keywords: [keyword, 'انواع', 'تقسیم‌بندی'],
        },
        {
          level: 2,
          title: `راهنمای کامل ${keyword}`,
          type: 'h2',
          keywords: [keyword, 'راهنما', 'آموزش'],
        },
        {
          level: 3,
          title: `مراحل شروع کار با ${keyword}`,
          type: 'h3',
        },
        {
          level: 3,
          title: `نکات مهم در ${keyword}`,
          type: 'h3',
        },
        {
          level: 2,
          title: `مزایا و معایب ${keyword}`,
          type: 'h2',
          keywords: [keyword, 'مزایا', 'معایب'],
        },
        {
          level: 2,
          title: `سوالات متداول`,
          type: 'h2',
          keywords: ['FAQ', 'سوالات متداول'],
        },
        {
          level: 2,
          title: 'نتیجه‌گیری',
          type: 'h2',
        }
      );
    } else {
      // برای Cluster Content - تخصصی‌تر
      const kwType = contentItem.keyword?.type;

      if (kwType === 'informational') {
        outline.push(
          {
            level: 2,
            title: `چرا ${keyword} مهم است؟`,
            type: 'h2',
          },
          {
            level: 2,
            title: `چگونه ${keyword}`,
            type: 'h2',
            keywords: [keyword, 'آموزش', 'روش'],
          },
          {
            level: 3,
            title: 'مرحله اول',
            type: 'h3',
          },
          {
            level: 3,
            title: 'مرحله دوم',
            type: 'h3',
          },
          {
            level: 3,
            title: 'مرحله سوم',
            type: 'h3',
          }
        );
      } else if (kwType === 'commercial') {
        outline.push(
          {
            level: 2,
            title: `بررسی و مقایسه ${keyword}`,
            type: 'h2',
          },
          {
            level: 2,
            title: 'معیارهای انتخاب',
            type: 'h2',
          },
          {
            level: 2,
            title: `بهترین گزینه‌های ${keyword}`,
            type: 'h2',
          }
        );
      } else if (kwType === 'transactional') {
        outline.push(
          {
            level: 2,
            title: `راهنمای خرید ${keyword}`,
            type: 'h2',
          },
          {
            level: 2,
            title: 'قیمت و هزینه‌ها',
            type: 'h2',
          },
          {
            level: 2,
            title: 'نکات قبل از خرید',
            type: 'h2',
          }
        );
      }

      outline.push(
        {
          level: 2,
          title: 'نتیجه‌گیری',
          type: 'h2',
        }
      );
    }

    return outline;
  }

  /**
   * تولید محتوای اصلی
   */
  async generateMainContent(contentItem, outline) {
    const keyword = contentItem.keyword?.keyword || contentItem.title;
    const isPillar = contentItem.type === 'pillar';

    let html = `<article class="seo-content" itemscope itemtype="http://schema.org/Article">\n`;

    // Header
    html += `  <header>\n`;
    html += `    <h1 itemprop="headline">${contentItem.title}</h1>\n`;
    html += `    <div class="meta">\n`;
    html += `      <time itemprop="datePublished" datetime="${new Date().toISOString()}">${new Date().toLocaleDateString('fa-IR')}</time>\n`;
    html += `    </div>\n`;
    html += `  </header>\n\n`;

    // مقدمه
    html += `  <div class="introduction" itemprop="description">\n`;
    html += `    <p>در این مقاله جامع، به بررسی کامل <strong>${keyword}</strong> می‌پردازیم. `;
    if (isPillar) {
      html += `این راهنمای کامل تمام آنچه که باید درباره ${keyword} بدانید را پوشش می‌دهد.`;
    } else {
      html += `با ما همراه باشید تا با جزئیات ${keyword} آشنا شوید.`;
    }
    html += `</p>\n`;
    html += `  </div>\n\n`;

    // بدنه اصلی بر اساس outline
    outline.forEach((section, index) => {
      if (index === 0) return; // عنوان اصلی را رد می‌کنیم

      const Tag = section.type;
      html += `  <section class="content-section">\n`;
      html += `    <${Tag}>${section.title}</${Tag}>\n`;

      // تولید محتوای نمونه برای هر بخش
      const paragraphs = this.generateSectionContent(section, keyword, isPillar);
      paragraphs.forEach(p => {
        html += `    <p>${p}</p>\n`;
      });

      // اگر بخش مهمی است، یک لیست اضافه کن
      if (section.level === 2 && Math.random() > 0.5) {
        html += `    <ul>\n`;
        for (let i = 0; i < 3; i++) {
          html += `      <li>نکته ${i + 1} درباره ${section.title}</li>\n`;
        }
        html += `    </ul>\n`;
      }

      html += `  </section>\n\n`;
    });

    // FAQ Schema (برای Pillar)
    if (isPillar) {
      html += this.generateFAQSection(keyword);
    }

    // نتیجه‌گیری
    html += `  <footer class="conclusion">\n`;
    html += `    <h2>نتیجه‌گیری</h2>\n`;
    html += `    <p>در این مقاله به طور کامل ${keyword} را بررسی کردیم. `;
    html += `امیدواریم این اطلاعات برای شما مفید بوده باشد.</p>\n`;
    html += `  </footer>\n`;

    html += `</article>`;

    return html;
  }

  /**
   * تولید محتوای هر بخش
   */
  generateSectionContent(section, keyword, isPillar) {
    const paragraphCount = isPillar ? 3 : 2;
    const paragraphs = [];

    for (let i = 0; i < paragraphCount; i++) {
      let content = `در این بخش به ${section.title} می‌پردازیم. `;
      content += `<strong>${keyword}</strong> یکی از موضوعات مهم در این حوزه است که باید به آن توجه کنید. `;
      content += `با استفاده از روش‌های مناسب و رعایت نکات کلیدی، می‌توانید نتایج بهتری کسب کنید.`;

      // اضافه کردن کلمات کلیدی مرتبط
      if (section.keywords && section.keywords.length > 0) {
        content += ` در زمینه ${section.keywords.join('، ')} نیز اطلاعات مفیدی ارائه می‌دهیم.`;
      }

      paragraphs.push(content);
    }

    return paragraphs;
  }

  /**
   * تولید بخش سوالات متداول
   */
  generateFAQSection(keyword) {
    const faqs = [
      {
        question: `${keyword} چیست؟`,
        answer: `${keyword} به مفهوم... است که در زمینه... کاربرد دارد.`
      },
      {
        question: `چگونه ${keyword} را شروع کنیم؟`,
        answer: `برای شروع ${keyword} ابتدا باید... را انجام دهید.`
      },
      {
        question: `مزایای ${keyword} چیست؟`,
        answer: `${keyword} مزایای متعددی دارد از جمله...`
      }
    ];

    let html = `  <section class="faq" itemscope itemtype="https://schema.org/FAQPage">\n`;
    html += `    <h2>سوالات متداول</h2>\n`;

    faqs.forEach(faq => {
      html += `    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n`;
      html += `      <h3 itemprop="name">${faq.question}</h3>\n`;
      html += `      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n`;
      html += `        <p itemprop="text">${faq.answer}</p>\n`;
      html += `      </div>\n`;
      html += `    </div>\n`;
    });

    html += `  </section>\n\n`;

    return html;
  }

  /**
   * تولید متا تگ‌ها
   */
  generateMetaTags(contentItem) {
    const keyword = contentItem.keyword?.keyword || contentItem.title;

    return {
      title: `${contentItem.title} - راهنمای جامع`,
      description: `آموزش کامل ${keyword}. در این مقاله به طور جامع ${keyword} را بررسی می‌کنیم.`,
      keywords: [
        keyword,
        contentItem.category,
        `آموزش ${keyword}`,
        `راهنمای ${keyword}`,
      ],
      ogTitle: contentItem.title,
      ogDescription: `راهنمای کامل ${keyword} - همه چیز درباره ${keyword}`,
      ogType: 'article',
      canonical: `/${contentItem.category}/${contentItem.slug}`,
    };
  }

  /**
   * تولید لینک‌های داخلی
   */
  generateInternalLinks(contentItem, relatedContent) {
    const links = [];

    // لینک به Pillar اصلی
    if (contentItem.type === 'cluster' && contentItem.pillarSlug) {
      links.push({
        text: `بیشتر بخوانید: ${contentItem.pillarSlug}`,
        url: `/${contentItem.category}/${contentItem.pillarSlug}`,
        anchor: `راهنمای کامل ${contentItem.category}`,
        position: 'intro',
      });
    }

    // لینک‌های مرتبط
    relatedContent.slice(0, 5).forEach(related => {
      links.push({
        text: related.title,
        url: `/${related.category}/${related.slug}`,
        anchor: related.title,
        position: 'content',
      });
    });

    return links;
  }

  /**
   * پیشنهاد تصاویر
   */
  generateImageSuggestions(contentItem, outline) {
    const keyword = contentItem.keyword?.keyword || contentItem.title;
    const suggestions = [];

    // تصویر شاخص
    suggestions.push({
      type: 'featured',
      alt: `تصویر شاخص ${keyword}`,
      description: `تصویر اصلی مقاله درباره ${keyword}`,
      position: 'top',
      keywords: [keyword, contentItem.category],
    });

    // تصاویر محتوا
    outline.filter(s => s.level === 2).forEach((section, index) => {
      suggestions.push({
        type: 'content',
        alt: section.title,
        description: `تصویر مرتبط با ${section.title}`,
        position: `section-${index + 1}`,
        keywords: section.keywords || [keyword],
      });
    });

    // اینفوگرافیک (برای Pillar)
    if (contentItem.type === 'pillar') {
      suggestions.push({
        type: 'infographic',
        alt: `اینفوگرافیک ${keyword}`,
        description: `خلاصه بصری اطلاعات ${keyword}`,
        position: 'middle',
        keywords: [keyword, 'اینفوگرافیک'],
      });
    }

    return suggestions;
  }

  /**
   * شمارش کلمات
   */
  countWords(html) {
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  /**
   * محاسبه زمان خواندن
   */
  calculateReadingTime(html) {
    const wordCount = this.countWords(html);
    const wordsPerMinute = 200; // فارسی
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * ذخیره محتوا
   */
  async saveContent(article) {
    await fs.mkdir(this.dataPath, { recursive: true });

    // ذخیره JSON
    const jsonPath = path.join(this.dataPath, `${article.slug}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(article, null, 2), 'utf-8');

    // ذخیره HTML
    const htmlPath = path.join(this.dataPath, `${article.slug}.html`);
    await fs.writeFile(htmlPath, article.content, 'utf-8');
  }

  /**
   * بارگذاری محتوا
   */
  async loadContent(slug) {
    try {
      const jsonPath = path.join(this.dataPath, `${slug}.json`);
      const data = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * تولید محتوا برای چند آیتم
   */
  async generateBatchContent(contentItems, relatedContentMap = {}) {
    console.log(chalk.blue(`\n✍️  تولید ${contentItems.length} محتوا...\n`));

    const results = [];

    for (const item of contentItems) {
      const relatedContent = relatedContentMap[item.slug] || [];
      const article = await this.generateContent(item, relatedContent);
      results.push(article);

      // تاخیر کوتاه
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(chalk.green(`\n✓ ${results.length} محتوا تولید شد\n`));

    return results;
  }
}

export default ContentGenerator;
