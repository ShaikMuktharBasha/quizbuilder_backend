const express = require('express');
const QuizController = require('../controllers/QuizController');

const router = express.Router();

// Specific routes MUST come before parameterized routes (/:id)
router.post('/generate', QuizController.generateQuiz);
router.get('/myquizzes/:userId', QuizController.getMyQuizzes);

router.post('/', QuizController.createQuiz);
router.get('/', QuizController.getAll);
router.get('/:id', QuizController.getOne);
router.put('/:id', QuizController.update);
router.delete('/:id', QuizController.delete);
router.post('/:id/submit', QuizController.submit);
router.get('/:id/leaderboard', QuizController.getLeaderboard);

module.exports = router;