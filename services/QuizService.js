const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');

class QuizService {
  async createQuiz(req) {
    const quiz = await Quiz.create({
      title: req.title,
      description: req.description,
      createdBy: req.createdBy,
    });

    const questions = req.questions.map(q => ({
      quizId: quiz.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
    }));

    await Question.bulkCreate(questions);

    return quiz;
  }

  async getAll() {
    return await Quiz.findAll({ include: Question });
  }

  async getById(id) {
    return await Quiz.findByPk(id, { include: Question });
  }

  async updateQuiz(id, req) {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) return null;

    await quiz.update({
      title: req.title,
      description: req.description,
    });

    await Question.destroy({ where: { quizId: id } });

    const questions = req.questions.map(q => ({
      quizId: id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
    }));

    await Question.bulkCreate(questions);

    return await Quiz.findByPk(id, { include: Question });
  }

  async deleteQuiz(id) {
    await Quiz.destroy({ where: { id } });
  }

  async score(id, submission) {
    const quiz = await Quiz.findByPk(id, { include: Question });
    if (!quiz) return { score: 0 };

    let score = 0;
    for (const q of quiz.Questions) {
      const submitted = submission.answers[q.id];
      if (submitted && q.correctOption.toLowerCase() === submitted.toLowerCase()) {
        score++;
      }
    }

    await QuizResult.create({
      userId: submission.userId,
      quizId: id,
      score,
    });

    return { score };
  }

  toResponse(quiz) {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: quiz.Questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
      })),
    };
  }

  async getMyQuizzes(userId) {
    const quizzes = await Quiz.findAll({
      where: { createdBy: userId },
      include: Question,
    });
    return quizzes.map(q => this.toResponse(q));
  }
}

module.exports = new QuizService();