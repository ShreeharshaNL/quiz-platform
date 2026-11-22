const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const { validateQuizInput } = require('../utils/validator');

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (Admin only)
 */
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, timeLimitMinutes, passingScorePercent, questions, isPublished } = req.body;

    const { isValid, errors } = validateQuizInput({
      title,
      description,
      timeLimitMinutes,
      passingScorePercent,
      questions
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
        errors
      });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      timeLimitMinutes: timeLimitMinutes || 10,
      passingScorePercent: passingScorePercent !== undefined ? passingScorePercent : 60,
      questions,
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quizzes (Students see published quizzes without answers; Admins see all)
 * @route   GET /api/quizzes
 * @access  Private
 */
const getAllQuizzes = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { isPublished: true };

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const sanitizedQuizzes = quizzes.map((quiz) => {
      if (req.user.role === 'admin') {
        return quiz;
      }
      return {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimitMinutes: quiz.timeLimitMinutes,
        passingScorePercent: quiz.passingScorePercent,
        questionCount: quiz.questions.length,
        totalPoints: quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0),
        createdAt: quiz.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: sanitizedQuizzes.length,
      quizzes: sanitizedQuizzes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get quiz by ID (Sanitized for students so answers are not exposed)
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (req.user.role !== 'admin' && !quiz.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This quiz is not currently accessible'
      });
    }

    // If student, strip correct answers
    if (req.user.role === 'student') {
      return res.status(200).json({
        success: true,
        quiz: quiz.toStudentView()
      });
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Admin only)
 */
const updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const { isValid, errors } = validateQuizInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
        errors
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Admin only)
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ quizId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Quiz and associated submissions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analytics for a quiz
 * @route   GET /api/quizzes/:id/analytics
 * @access  Private (Admin only)
 */
const getQuizAnalytics = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const submissions = await Submission.find({ quizId: req.params.id }).populate('studentId', 'name email');

    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter((s) => s.passed).length;
    const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100 * 10) / 10 : 0;

    const scores = submissions.map((s) => s.percentage);
    const averageScore =
      totalSubmissions > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / totalSubmissions) * 10) / 10
        : 0;
    const highestScore = totalSubmissions > 0 ? Math.max(...scores) : 0;
    const lowestScore = totalSubmissions > 0 ? Math.min(...scores) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        quizTitle: quiz.title,
        totalQuestions: quiz.questions.length,
        totalSubmissions,
        passedCount,
        failedCount: totalSubmissions - passedCount,
        passRate,
        averageScore,
        highestScore,
        lowestScore,
        recentSubmissions: submissions.slice(-10).reverse()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizAnalytics
};
