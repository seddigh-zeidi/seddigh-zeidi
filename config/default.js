import dotenv from 'dotenv';
dotenv.config();

export default {
  wordpress: {
    url: process.env.WORDPRESS_URL,
    username: process.env.WORDPRESS_USERNAME,
    appPassword: process.env.WORDPRESS_APP_PASSWORD,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    cseId: process.env.GOOGLE_CSE_ID,
  },
  content: {
    dailyCount: parseInt(process.env.DAILY_CONTENT_COUNT) || 3,
    minWordCount: parseInt(process.env.MIN_WORD_COUNT) || 1500,
    maxWordCount: parseInt(process.env.MAX_WORD_COUNT) || 3000,
    language: process.env.CONTENT_LANGUAGE || 'fa',
  },
  paths: {
    categories: './data/categories',
    keywords: './data/keywords',
    content: './data/content',
    calendar: './data/calendar',
  },
};
