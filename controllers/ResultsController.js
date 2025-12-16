const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

class ResultsController {
  async getResultsByUser(req, res) {
    try {
      const results = await QuizResult.find({ userId: req.params.userId })
        .populate('quizId')
        .populate('userId');
      
      const dtos = results.map(r => ({
        quizId: r.quizId ? r.quizId._id : null,
        username: r.userId ? r.userId.username : 'Unknown User',
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.quizId ? r.quizId.title : 'Unknown Quiz',
        quizDescription: r.quizId ? r.quizId.description : '',
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResultsByQuiz(req, res) {
    try {
      const results = await QuizResult.find({ quizId: req.params.quizId })
        .populate('quizId')
        .populate('userId');
      
      const dtos = results.map(r => ({
        quizId: r.quizId ? r.quizId._id : null,
        username: r.userId ? r.userId.username : 'Unknown User',
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.quizId ? r.quizId.title : 'Unknown Quiz',
        quizDescription: r.quizId ? r.quizId.description : '',
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllResults(req, res) {
    try {
      const results = await QuizResult.find()
        .populate('quizId')
        .populate('userId');
      
      const dtos = results.map(r => ({
        quizId: r.quizId ? r.quizId._id : null,
        username: r.userId ? r.userId.username : 'Unknown User',
        score: r.score,
        submittedAt: r.submittedAt,
        quizTitle: r.quizId ? r.quizId.title : 'Unknown Quiz',
        quizDescription: r.quizId ? r.quizId.description : '',
      }));
      res.json(dtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResultsController();