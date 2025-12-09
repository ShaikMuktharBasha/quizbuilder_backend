const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
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

app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', resultRoutes); // since results are under /api/quizzes

// Database synchronization for Serverless (Vercel)
// This ensures the DB is connected and tables exist before handling requests
const dbReady = sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Unable to sync database:', err);
});

// Middleware to wait for DB connection
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Export the app for Vercel
module.exports = app;

// Only start server if run directly (local development)
if (require.main === module) {
  dbReady.then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}