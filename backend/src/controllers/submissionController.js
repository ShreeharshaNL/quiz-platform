const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const { calculateQuizScore } = require('../utils/scoreCalculator');

/**
 * @desc    Submit answers for a quiz
 * @route   POST /api/quizzes/:id/submit
 * @access  Private (Student)
 */
const submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.isPublished && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'This quiz is not available for submissions'
      });
    }

    // Calculate score using scoreCalculator engine
    const evaluation = calculateQuizScore(quiz.questions, answers || [], quiz.passingScorePercent);

    // Save submission record
    const submission = await Submission.create({
      quizId: quiz._id,
      studentId: req.user._id,
      answers: evaluation.answerDetails,
      totalScore: evaluation.totalScore,
      maxScore: evaluation.maxScore,
      percentage: evaluation.percentage,
      passed: evaluation.passed,
      timeSpentSeconds: timeSpentSeconds || 0
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      submissionId: submission._id,
      result: {
        totalScore: evaluation.totalScore,
        maxScore: evaluation.maxScore,
        percentage: evaluation.percentage,
        passed: evaluation.passed,
        passingScorePercent: quiz.passingScorePercent,
        timeSpentSeconds: submission.timeSpentSeconds,
        answers: evaluation.answerDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in student's submissions history
 * @route   GET /api/submissions/my
 * @access  Private
 */
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('quizId', 'title description passingScorePercent')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for a quiz (Admin)
 * @route   GET /api/quizzes/:id/submissions
 * @access  Private (Admin only)
 */
const getQuizSubmissions = async (req, res, next) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const submissions = await Submission.find({ quizId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      quizTitle: quiz.title,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get submission details by ID
 * @route   GET /api/submissions/:id
 * @access  Private
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('quizId', 'title description')
      .populate('studentId', 'name email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Authorization: only student owner or admin can view
    const isOwner = submission.studentId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this submission'
      });
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuiz,
  getMySubmissions,
  getQuizSubmissions,
  getSubmissionById
};
