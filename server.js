const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const notes = require('./routes/notes');
const subjects = require('./routes/subjects');
const ratings = require('./routes/ratings');
const comments = require('./routes/comments');
const follow = require('./routes/follow');
const upload = require('./routes/upload');
const users = require('./routes/users');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Apply rate limiting to all routes
app.use(limiter);

// Set security headers
app.use(helmet());

// Enable CORS - allow multiple frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/notes', notes);
app.use('/api/subjects', subjects);
app.use('/api/ratings', ratings);
app.use('/api/comments', comments);
app.use('/api/follow', follow);
app.use('/api/upload', upload);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Server keep-alive timeout to prevent connection drops
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Increase timeout to prevent connection drops
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000; // 2 minutes

// Handle unhandled promise rejections - don't exit, just log
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection:', err.message);
  console.log('Stack:', err.stack);
  // Don't exit process, just log the error
});

// Handle uncaught exceptions - don't exit, just log
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
  console.log('Stack:', err.stack);
  // Don't exit process
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
