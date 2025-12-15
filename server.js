const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 9096;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Quiz Builder Backend API - Available endpoints: /api/users, /api/quizzes, /api/results');
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  res.json({
    status: 'Server is running',
    database: statusMap[dbStatus] || 'Unknown',
    env: {
      mongoUriSet: !!process.env.MONGODB_URI
    }
  });
});

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message,
      hint: 'Check if MONGODB_URI is set in Vercel Environment Variables'
    });
  }
});

app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', resultRoutes); // since results are under /api/quizzes

// Export the app for Vercel
module.exports = app;

// Only start server if run directly (local development or Railway)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}