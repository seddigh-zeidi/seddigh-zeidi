import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import categoriesRouter from './routes/categories.js';
import keywordsRouter from './routes/keywords.js';
import pillarRouter from './routes/pillar.js';
import calendarRouter from './routes/calendar.js';
import contentRouter from './routes/content.js';
import publishRouter from './routes/publish.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/keywords', keywordsRouter);
app.use('/api/pillar', pillarRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/content', contentRouter);
app.use('/api/publish', publishRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'سیستم سئو فعال است' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'خطای سرور',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 سرور در حال اجرا در پورت ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});
