const QuizService = require('../services/QuizService');

class QuizController {
  async createQuiz(req, res) {
    try {
      const quiz = await QuizService.createQuiz(req.body);
      const response = QuizService.toResponse(await QuizService.getById(quiz.id));
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const quizzes = await QuizService.getAll();
      const responses = quizzes.map(q => QuizService.toResponse(q));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const quiz = await QuizService.getById(req.params.id);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      res.json(QuizService.toResponse(quiz));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const quiz = await QuizService.updateQuiz(req.params.id, req.body);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      res.json(QuizService.toResponse(quiz));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await QuizService.deleteQuiz(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async submit(req, res) {
    try {
      const result = await QuizService.score(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyQuizzes(req, res) {
    try {
      const quizzes = await QuizService.getMyQuizzes(req.params.userId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QuizController();