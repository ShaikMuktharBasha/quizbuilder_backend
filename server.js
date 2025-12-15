const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 9096;

app.use(cors());
app.use(express.json());

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/', (req, res) => {
  res.send('Quiz Builder Backend API - Available endpoints: /api/users, /api/quizzes, /api/results');
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