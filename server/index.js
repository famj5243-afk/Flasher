const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const emailRoutes = require('./routes/emailRoutes');
const templateRoutes = require('./routes/templateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Educational disclaimer middleware - adds to all responses
app.use((req, res, next) => {
  res.setHeader('X-Educational-Platform', 'true');
  res.setHeader('X-Disclaimer', 'This is a simulation for educational purposes only');
  next();
});

// Routes
app.use('/api/emails', emailRoutes);
app.use('/api/templates', templateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    disclaimer: process.env.EDUCATIONAL_FOOTER || 'This is a simulation for educational purposes only.'
  });
});

// Root endpoint with educational disclaimer
app.get('/', (req, res) => {
  res.json({
    message: 'Flasher - Educational Email Simulation Platform',
    version: '1.0.0',
    disclaimer: 'This is a simulation for educational purposes only.',
    warning: 'This platform is strictly for educational and testing purposes. Do not use for real communications or to impersonate real entities.',
    endpoints: {
      health: '/api/health',
      emails: '/api/emails',
      templates: '/api/templates'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    disclaimer: 'This is a simulation for educational purposes only.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    disclaimer: 'This is a simulation for educational purposes only.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🎓 EDUCATIONAL SIMULATION PLATFORM`);
  console.log(`========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n⚠️  IMPORTANT DISCLAIMER:`);
  console.log(`This is a simulation for educational purposes only.`);
  console.log(`Do not use for real communications or fraud.`);
  console.log(`========================================\n`);
});

module.exports = app;
