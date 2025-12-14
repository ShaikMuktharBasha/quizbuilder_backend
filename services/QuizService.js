const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

class QuizService {
  async createQuiz(req) {
    const quiz = new Quiz({
      title: req.title,
      description: req.description,
      createdBy: req.createdBy,
      questions: req.questions.map(q => ({
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
      })),
    });

    await quiz.save();
    return quiz;
  }

  async getAll() {
    return await Quiz.find();
  }

  async getById(id) {
    return await Quiz.findById(id);
  }

  async updateQuiz(id, req) {
    const quiz = await Quiz.findById(id);
    if (!quiz) return null;

    quiz.title = req.title;
    quiz.description = req.description;
    quiz.questions = req.questions.map(q => ({
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
    }));

    await quiz.save();
    return quiz;
  }

  async deleteQuiz(id) {
    await Quiz.findByIdAndDelete(id);
  }

  async score(id, submission) {
    const quiz = await Quiz.findById(id);
    if (!quiz) return { score: 0 };

    let score = 0;
    for (const q of quiz.questions) {
      const submitted = submission.answers[q._id.toString()];
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
    return quiz;
  }

  async getMyQuizzes(userId) {
    const quizzes = await Quiz.find({ createdBy: userId });
    return quizzes;
  }
}

module.exports = new QuizService();