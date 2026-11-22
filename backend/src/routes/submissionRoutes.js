const express = require('express');
const router = express.Router();
const {
  getMySubmissions,
  getSubmissionById
} = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/my', getMySubmissions);
router.get('/:id', getSubmissionById);

module.exports = router;
