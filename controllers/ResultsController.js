const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

class ResultsController {
  async getResultsByUser(req, res) {
    try {
      const results = await QuizResult.findAll({
        where: { userId: req.params.userId },
        include: [Quiz, User],
      });
      const dtos = results.map(r => ({
        username: r.User.username,
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.Quiz.title,
        quizDescription: r.Quiz.description,
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResultsByQuiz(req, res) {
    try {
      const results = await QuizResult.findAll({
        where: { quizId: req.params.quizId },
        include: [Quiz, User],
      });
      const dtos = results.map(r => ({
        username: r.User.username,
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.Quiz.title,
        quizDescription: r.Quiz.description,
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllResults(req, res) {
    try {
      const results = await QuizResult.findAll({
        include: [Quiz, User],
      });
      const dtos = results.map(r => ({
        username: r.User.username,
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.Quiz.title,
        quizDescription: r.Quiz.description,
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResultsController();