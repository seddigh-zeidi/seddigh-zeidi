import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

class PillarClusterSystem {
  constructor(config) {
    this.config = config;
    this.dataPath = config.paths.keywords;
  }

  /**
   * ایجاد ساختار Pillar-Cluster
   */
  async createPillarClusterStructure(category, keywords) {
    console.log(chalk.blue(`\n🏗️  ایجاد ساختار Pillar-Cluster برای "${category.name}"...\n`));

    // شناسایی Pillar Content (محتوای اصلی)
    const pillarContent = {
      title: category.name,
      slug: category.slug,
      type: 'pillar',
      keyword: this.findMainKeyword(keywords),
      description: category.description,
      clusters: [],
    };

    // گروه‌بندی کلمات کلیدی به Clusters
    const clusters = this.groupKeywordsIntoClusters(keywords);

    clusters.forEach((cluster, index) => {
      pillarContent.clusters.push({
        id: `cluster-${index + 1}`,
        name: cluster.name,
        keywords: cluster.keywords,
        priority: cluster.priority,
      });
    });

    // ذخیره ساختار
    await this.savePillarStructure(category.slug, pillarContent);

    console.log(chalk.green(`✓ ساختار Pillar با ${clusters.length} Cluster ایجاد شد\n`));

    return pillarContent;
  }

  /**
   * یافتن کلمه کلیدی اصلی
   */
  findMainKeyword(keywords) {
    // کلمه کلیدی با بیشترین حجم جستجو و کمترین سختی
    const scored = keywords.map(kw => ({
      ...kw,
      score: (kw.searchVolume / 100) - (kw.difficulty / 10),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  /**
   * گروه‌بندی کلمات کلیدی به Clusters
   */
  groupKeywordsIntoClusters(keywords) {
    const clusters = {
      informational: [],
      transactional: [],
      commercial: [],
      navigational: [],
    };

    // گروه‌بندی بر اساس نوع
    keywords.forEach(kw => {
      if (clusters[kw.type]) {
        clusters[kw.type].push(kw);
      }
    });

    // تبدیل به آرایه با اولویت‌بندی
    const result = [];

    // Informational content (آموزشی) - اولویت بالا
    if (clusters.informational.length > 0) {
      result.push({
        name: 'محتوای آموزشی و اطلاعاتی',
        keywords: this.selectTopKeywords(clusters.informational, 15),
        priority: 1,
        type: 'informational',
      });
    }

    // Commercial content (مقایسه‌ای)
    if (clusters.commercial.length > 0) {
      result.push({
        name: 'محتوای تجاری و مقایسه‌ای',
        keywords: this.selectTopKeywords(clusters.commercial, 10),
        priority: 2,
        type: 'commercial',
      });
    }

    // Transactional content (خرید)
    if (clusters.transactional.length > 0) {
      result.push({
        name: 'محتوای خرید و معاملاتی',
        keywords: this.selectTopKeywords(clusters.transactional, 8),
        priority: 3,
        type: 'transactional',
      });
    }

    // Navigational content
    if (clusters.navigational.length > 0) {
      result.push({
        name: 'محتوای راهبری',
        keywords: this.selectTopKeywords(clusters.navigational, 7),
        priority: 4,
        type: 'navigational',
      });
    }

    return result;
  }

  /**
   * انتخاب برترین کلمات کلیدی
   */
  selectTopKeywords(keywords, count) {
    return keywords
      .sort((a, b) => {
        // امتیازدهی بر اساس حجم جستجو و سختی
        const scoreA = (a.searchVolume * 0.7) - (a.difficulty * 0.3);
        const scoreB = (b.searchVolume * 0.7) - (b.difficulty * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, count);
  }

  /**
   * ایجاد Mind Map
   */
  async generateMindMap(pillarStructure) {
    const mindMap = {
      name: pillarStructure.title,
      type: 'pillar',
      children: [],
    };

    pillarStructure.clusters.forEach(cluster => {
      const clusterNode = {
        name: cluster.name,
        type: 'cluster',
        priority: cluster.priority,
        children: [],
      };

      cluster.keywords.forEach(keyword => {
        clusterNode.children.push({
          name: keyword.keyword,
          type: 'content',
          searchVolume: keyword.searchVolume,
          difficulty: keyword.difficulty,
        });
      });

      mindMap.children.push(clusterNode);
    });

    return mindMap;
  }

  /**
   * تولید خروجی Markdown برای Mind Map
   */
  generateMindMapMarkdown(mindMap) {
    let markdown = `# ${mindMap.name}\n\n`;
    markdown += `> ساختار Pillar-Cluster برای سئو\n\n`;

    mindMap.children.forEach((cluster, clusterIndex) => {
      markdown += `## ${clusterIndex + 1}. ${cluster.name}\n`;
      markdown += `**اولویت:** ${cluster.priority}\n\n`;

      cluster.children.forEach((content, contentIndex) => {
        markdown += `   ${contentIndex + 1}. **${content.name}**\n`;
        markdown += `      - حجم جستجو: ${content.searchVolume}\n`;
        markdown += `      - سختی: ${content.difficulty}\n\n`;
      });

      markdown += '\n';
    });

    return markdown;
  }

  /**
   * تولید خروجی JSON برای تجسم گرافیکی
   */
  generateMindMapJSON(mindMap) {
    return JSON.stringify(mindMap, null, 2);
  }

  /**
   * ذخیره ساختار Pillar
   */
  async savePillarStructure(categorySlug, structure) {
    const filePath = path.join(this.dataPath, `${categorySlug}-pillar.json`);
    await fs.writeFile(filePath, JSON.stringify(structure, null, 2), 'utf-8');
  }

  /**
   * ذخیره Mind Map
   */
  async saveMindMap(categorySlug, mindMap) {
    // ذخیره JSON
    const jsonPath = path.join(this.dataPath, `${categorySlug}-mindmap.json`);
    await fs.writeFile(jsonPath, this.generateMindMapJSON(mindMap), 'utf-8');

    // ذخیره Markdown
    const mdPath = path.join(this.dataPath, `${categorySlug}-mindmap.md`);
    await fs.writeFile(mdPath, this.generateMindMapMarkdown(mindMap), 'utf-8');

    console.log(chalk.green(`✓ Mind Map ذخیره شد:`));
    console.log(chalk.gray(`  JSON: ${jsonPath}`));
    console.log(chalk.gray(`  Markdown: ${mdPath}\n`));
  }

  /**
   * بارگذاری ساختار Pillar
   */
  async loadPillarStructure(categorySlug) {
    try {
      const filePath = path.join(this.dataPath, `${categorySlug}-pillar.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * نمایش ساختار Pillar
   */
  displayPillarStructure(pillarStructure) {
    console.log(chalk.blue(`\n📊 ساختار Pillar-Cluster: ${pillarStructure.title}\n`));
    console.log(chalk.cyan(`Pillar Keyword: ${pillarStructure.keyword.keyword}`));
    console.log(`حجم جستجو: ${pillarStructure.keyword.searchVolume}`);
    console.log(`سختی: ${pillarStructure.keyword.difficulty}\n`);

    console.log(chalk.yellow('Clusters:\n'));

    pillarStructure.clusters.forEach((cluster, index) => {
      console.log(chalk.green(`${index + 1}. ${cluster.name}`));
      console.log(`   اولویت: ${cluster.priority}`);
      console.log(`   تعداد محتوا: ${cluster.keywords.length}`);
      console.log(`   نوع: ${cluster.type}\n`);
    });
  }

  /**
   * ایجاد ساختار برای همه دسته‌بندی‌ها
   */
  async createAllPillarStructures(categories, allKeywords) {
    console.log(chalk.blue('\n🏗️  ایجاد ساختارهای Pillar-Cluster...\n'));

    const structures = [];

    for (const category of categories) {
      const keywords = allKeywords[category.slug] || [];

      if (keywords.length === 0) {
        console.log(chalk.yellow(`⚠ هیچ کلمه کلیدی برای ${category.name} یافت نشد`));
        continue;
      }

      const pillarStructure = await this.createPillarClusterStructure(category, keywords);
      const mindMap = await this.generateMindMap(pillarStructure);
      await this.saveMindMap(category.slug, mindMap);

      structures.push(pillarStructure);
    }

    console.log(chalk.green(`\n✓ ${structures.length} ساختار Pillar-Cluster ایجاد شد\n`));
    return structures;
  }
}

export default PillarClusterSystem;
