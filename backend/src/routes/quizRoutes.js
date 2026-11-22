const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizAnalytics
} = require('../controllers/quizController');
const {
  submitQuiz,
  getQuizSubmissions
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

// All quiz routes require authentication
router.use(protect);

// Base quiz routes
router.route('/')
  .get(getAllQuizzes)
  .post(authorize('admin'), createQuiz);

// Quiz specific routes
router.route('/:id')
  .get(getQuizById)
  .put(authorize('admin'), updateQuiz)
  .delete(authorize('admin'), deleteQuiz);

// Analytics & Submissions per quiz (Admin only)
router.get('/:id/analytics', authorize('admin'), getQuizAnalytics);
router.get('/:id/submissions', authorize('admin'), getQuizSubmissions);

// Quiz submission (Student)
router.post('/:id/submit', submitQuiz);

module.exports = router;
