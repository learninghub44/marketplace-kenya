require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API' }));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Sokoni Kenya API' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/seller', require('./routes/seller'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/storage', require('./routes/storage'));

app.use((req, res) => res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ success: false, error: err.message }); });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sokoni Kenya API on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    const base = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(() => {
      const url = new URL('/api/health', base);
      const lib = url.protocol === 'https:' ? require('https') : require('http');
      lib.get(url.toString(), r => console.log(`Keep-alive: ${r.statusCode}`)).on('error', () => {});
    }, 14 * 60 * 1000);
  }
});
module.exports = app;
