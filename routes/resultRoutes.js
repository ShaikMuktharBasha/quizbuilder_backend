const express = require('express');
const ResultsController = require('../controllers/ResultsController');

const router = express.Router();

router.get('/quiz-results/users/:userId', ResultsController.getResultsByUser);
router.get('/quiz-results/:quizId', ResultsController.getResultsByQuiz);
router.get('/quiz-results', ResultsController.getAllResults);

module.exports = router;