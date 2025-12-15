const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

class QuizService {
  async createQuiz(req) {
    const quiz = new Quiz({
      title: req.title,
      description: req.description,
      category: req.category,
      difficulty: req.difficulty,
      isPublished: req.isPublished,
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

  async getAll(query = {}) {
    const { page = 1, limit = 10, search, category, difficulty, isPublished } = query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const quizzes = await Quiz.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Quiz.countDocuments(filter);

    return {
      quizzes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalQuizzes: count
    };
  }

  async getById(id) {
    return await Quiz.findById(id);
  }

  async updateQuiz(id, req) {
    const quiz = await Quiz.findById(id);
    if (!quiz) return null;

    quiz.title = req.title || quiz.title;
    quiz.description = req.description || quiz.description;
    quiz.category = req.category || quiz.category;
    quiz.difficulty = req.difficulty || quiz.difficulty;
    if (req.isPublished !== undefined) quiz.isPublished = req.isPublished;
    
    if (req.questions) {
      quiz.questions = req.questions.map(q => ({
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
      }));
    }

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

  async getLeaderboard(quizId) {
    const results = await QuizResult.find({ quizId })
      .sort({ score: -1, createdAt: 1 })
      .limit(10)
      .populate('userId', 'username email'); // Assuming User model has username
    return results;
  }
}

module.exports = new QuizService();