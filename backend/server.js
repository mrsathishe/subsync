const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment file based on ENV_FILE variable or default to .env
const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
console.log(`🔧 Using environment file: ${envFile}`);

const db = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting - disabled for local development
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SubSync API is running' });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/subscriptions', require('./src/routes/subscriptions'));
app.use('/api/users', require('./src/routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`SubSync API server running on port ${PORT}`);
});

module.exports = app;