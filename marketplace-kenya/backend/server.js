require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const favoriteRoutes = require('./routes/favorites');
const messageRoutes = require('./routes/messages');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const notificationRoutes = require('./routes/notifications');
const storageRoutes = require('./routes/storage');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS: allow all origins ──────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.options('*', cors());

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

// ── Health checks ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API', version: '1.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/storage', storageRoutes);

// ── 404 & error handlers ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛒 Sokoni Kenya API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Keep-alive ping every 14 min to prevent Render sleep
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(() => {
      const url = new URL('/api/health', baseUrl);
      const lib = url.protocol === 'https:' ? require('https') : require('http');
      lib.get(url.toString(), r => console.log(`Keep-alive: ${r.statusCode}`))
         .on('error', e => console.log('Keep-alive error:', e.message));
    }, 14 * 60 * 1000);
    console.log(`Keep-alive pinger started → ${baseUrl}/api/health`);
  }
});

module.exports = app;
