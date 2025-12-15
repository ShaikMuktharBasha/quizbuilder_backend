const express = require('express');
const QuizController = require('../controllers/QuizController');

const router = express.Router();

router.post('/', QuizController.createQuiz);
router.get('/', QuizController.getAll);
router.get('/:id', QuizController.getOne);
router.put('/:id', QuizController.update);
router.delete('/:id', QuizController.delete);
router.post('/:id/submit', QuizController.submit);
router.get('/:id/leaderboard', QuizController.getLeaderboard);
router.get('/myquizzes/:userId', QuizController.getMyQuizzes);

module.exports = router;