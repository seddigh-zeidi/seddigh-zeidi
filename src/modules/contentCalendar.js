import fs from 'fs/promises';
import path from 'path';
import { addDays, format, startOfDay } from 'date-fns';
import chalk from 'chalk';

class ContentCalendar {
  constructor(config) {
    this.config = config;
    this.dataPath = config.paths.calendar;
    this.dailyCount = config.content.dailyCount;
  }

  /**
   * ایجاد تقویم محتوایی
   */
  async generateCalendar(pillarStructures, durationDays = 30) {
    console.log(chalk.blue('\n📅 ایجاد تقویم محتوایی...\n'));

    const calendar = [];
    const allContent = this.extractAllContent(pillarStructures);

    let currentDate = startOfDay(new Date());
    let contentIndex = 0;

    for (let day = 0; day < durationDays; day++) {
      const dayContent = [];

      for (let i = 0; i < this.dailyCount && contentIndex < allContent.length; i++) {
        dayContent.push({
          ...allContent[contentIndex],
          scheduledDate: currentDate.toISOString(),
          status: 'scheduled',
        });
        contentIndex++;
      }

      if (dayContent.length > 0) {
        calendar.push({
          date: currentDate.toISOString(),
          dateFormatted: format(currentDate, 'yyyy-MM-dd'),
          dayOfWeek: format(currentDate, 'EEEE'),
          content: dayContent,
        });
      }

      currentDate = addDays(currentDate, 1);

      if (contentIndex >= allContent.length) {
        break;
      }
    }

    await this.saveCalendar(calendar);

    console.log(chalk.green(`✓ تقویم محتوایی برای ${calendar.length} روز ایجاد شد`));
    console.log(chalk.gray(`  کل محتوا: ${allContent.length}`));
    console.log(chalk.gray(`  محتوا در روز: ${this.dailyCount}\n`));

    return calendar;
  }

  /**
   * استخراج تمام محتواها از ساختار Pillar
   */
  extractAllContent(pillarStructures) {
    const allContent = [];

    pillarStructures.forEach(pillar => {
      // ابتدا محتوای Pillar اصلی
      allContent.push({
        type: 'pillar',
        title: pillar.title,
        slug: pillar.slug,
        keyword: pillar.keyword,
        category: pillar.slug,
        priority: 1,
        internalLinks: [], // برای بعد
      });

      // سپس محتوای Clusters بر اساس اولویت
      pillar.clusters
        .sort((a, b) => a.priority - b.priority)
        .forEach(cluster => {
          cluster.keywords.forEach((keyword, index) => {
            allContent.push({
              type: 'cluster',
              title: keyword.keyword,
              slug: this.generateSlug(keyword.keyword),
              keyword: keyword,
              category: pillar.slug,
              clusterName: cluster.name,
              priority: cluster.priority,
              pillarSlug: pillar.slug,
              internalLinks: [pillar.slug], // لینک به Pillar
            });
          });
        });
    });

    // اولویت‌بندی نهایی
    return this.prioritizeContent(allContent);
  }

  /**
   * اولویت‌بندی محتوا
   */
  prioritizeContent(content) {
    return content.sort((a, b) => {
      // ابتدا Pillar ها
      if (a.type === 'pillar' && b.type !== 'pillar') return -1;
      if (a.type !== 'pillar' && b.type === 'pillar') return 1;

      // سپس بر اساس اولویت cluster
      if (a.priority !== b.priority) return a.priority - b.priority;

      // در نهایت بر اساس حجم جستجو
      const volumeA = a.keyword?.searchVolume || 0;
      const volumeB = b.keyword?.searchVolume || 0;
      return volumeB - volumeA;
    });
  }

  /**
   * تولید slug از متن فارسی
   */
  generateSlug(text) {
    // تبدیل فاصله‌ها به خط تیره
    return text
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * ذخیره تقویم
   */
  async saveCalendar(calendar) {
    await fs.mkdir(this.dataPath, { recursive: true });

    // ذخیره JSON کامل
    const jsonPath = path.join(this.dataPath, 'calendar.json');
    await fs.writeFile(jsonPath, JSON.stringify(calendar, null, 2), 'utf-8');

    // ذخیره نسخه Markdown
    const mdPath = path.join(this.dataPath, 'calendar.md');
    await fs.writeFile(mdPath, this.generateCalendarMarkdown(calendar), 'utf-8');

    console.log(chalk.green(`\n✓ تقویم ذخیره شد:`));
    console.log(chalk.gray(`  ${jsonPath}`));
    console.log(chalk.gray(`  ${mdPath}`));
  }

  /**
   * تولید Markdown تقویم
   */
  generateCalendarMarkdown(calendar) {
    let md = `# تقویم محتوایی\n\n`;
    md += `> تاریخ ایجاد: ${format(new Date(), 'yyyy-MM-dd HH:mm')}\n\n`;
    md += `**آمار کلی:**\n`;
    md += `- تعداد روزها: ${calendar.length}\n`;
    md += `- کل محتوا: ${calendar.reduce((sum, day) => sum + day.content.length, 0)}\n\n`;
    md += `---\n\n`;

    calendar.forEach((day, index) => {
      md += `## روز ${index + 1}: ${day.dateFormatted} (${day.dayOfWeek})\n\n`;

      day.content.forEach((item, itemIndex) => {
        const icon = item.type === 'pillar' ? '🎯' : '📄';
        md += `${itemIndex + 1}. ${icon} **${item.title}**\n`;
        md += `   - نوع: ${item.type === 'pillar' ? 'Pillar Content' : 'Cluster Content'}\n`;
        md += `   - دسته: ${item.category}\n`;
        if (item.keyword) {
          md += `   - حجم جستجو: ${item.keyword.searchVolume}\n`;
          md += `   - سختی: ${item.keyword.difficulty}\n`;
        }
        md += `   - وضعیت: ${item.status}\n\n`;
      });

      md += `---\n\n`;
    });

    return md;
  }

  /**
   * بارگذاری تقویم
   */
  async loadCalendar() {
    try {
      const jsonPath = path.join(this.dataPath, 'calendar.json');
      const data = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * دریافت محتوای امروز
   */
  async getTodayContent() {
    const calendar = await this.loadCalendar();
    if (!calendar) return [];

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = calendar.find(day => day.dateFormatted === today);

    return todayEntry ? todayEntry.content : [];
  }

  /**
   * دریافت محتوای تاریخ خاص
   */
  async getContentByDate(date) {
    const calendar = await this.loadCalendar();
    if (!calendar) return [];

    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    const dayEntry = calendar.find(day => day.dateFormatted === dateStr);

    return dayEntry ? dayEntry.content : [];
  }

  /**
   * به‌روزرسانی وضعیت محتوا
   */
  async updateContentStatus(date, contentIndex, status) {
    const calendar = await this.loadCalendar();
    if (!calendar) return;

    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    const dayIndex = calendar.findIndex(day => day.dateFormatted === dateStr);

    if (dayIndex !== -1 && calendar[dayIndex].content[contentIndex]) {
      calendar[dayIndex].content[contentIndex].status = status;
      calendar[dayIndex].content[contentIndex].updatedAt = new Date().toISOString();

      await this.saveCalendar(calendar);
    }
  }

  /**
   * نمایش تقویم
   */
  async displayCalendar(days = 7) {
    const calendar = await this.loadCalendar();
    if (!calendar) {
      console.log(chalk.yellow('تقویم محتوایی یافت نشد'));
      return;
    }

    console.log(chalk.blue('\n📅 تقویم محتوایی\n'));

    calendar.slice(0, days).forEach((day, index) => {
      console.log(chalk.cyan(`\n${day.dateFormatted} (${day.dayOfWeek}):`));

      day.content.forEach((item, itemIndex) => {
        const icon = item.type === 'pillar' ? '🎯' : '📄';
        const statusIcon = item.status === 'published' ? '✓' :
                          item.status === 'draft' ? '✏️' : '⏱️';

        console.log(`  ${itemIndex + 1}. ${icon} ${item.title} ${statusIcon}`);

        if (item.keyword) {
          console.log(chalk.gray(`     جستجو: ${item.keyword.searchVolume} | سختی: ${item.keyword.difficulty}`));
        }
      });
    });

    console.log(chalk.gray(`\n... و ${calendar.length - days} روز دیگر\n`));
  }

  /**
   * دریافت آمار تقویم
   */
  async getCalendarStats() {
    const calendar = await this.loadCalendar();
    if (!calendar) return null;

    const stats = {
      totalDays: calendar.length,
      totalContent: 0,
      pillarContent: 0,
      clusterContent: 0,
      statusBreakdown: {
        scheduled: 0,
        draft: 0,
        published: 0,
      },
    };

    calendar.forEach(day => {
      day.content.forEach(item => {
        stats.totalContent++;

        if (item.type === 'pillar') {
          stats.pillarContent++;
        } else {
          stats.clusterContent++;
        }

        stats.statusBreakdown[item.status] =
          (stats.statusBreakdown[item.status] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * نمایش آمار تقویم
   */
  async displayStats() {
    const stats = await this.getCalendarStats();
    if (!stats) {
      console.log(chalk.yellow('آماری یافت نشد'));
      return;
    }

    console.log(chalk.blue('\n📊 آمار تقویم محتوایی\n'));
    console.log(`تعداد روزها: ${stats.totalDays}`);
    console.log(`کل محتوا: ${stats.totalContent}`);
    console.log(`  - Pillar: ${stats.pillarContent}`);
    console.log(`  - Cluster: ${stats.clusterContent}`);
    console.log(`\nوضعیت محتوا:`);
    console.log(`  - زمان‌بندی شده: ${stats.statusBreakdown.scheduled}`);
    console.log(`  - پیش‌نویس: ${stats.statusBreakdown.draft}`);
    console.log(`  - منتشر شده: ${stats.statusBreakdown.published}`);
    console.log();
  }
}

export default ContentCalendar;
