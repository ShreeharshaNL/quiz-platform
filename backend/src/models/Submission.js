const mongoose = require('mongoose');

const answerRecordSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionText: {
      type: String,
      default: ''
    },
    selectedOptionIndex: {
      type: Number,
      default: null
    },
    correctOptionIndex: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    pointsAwarded: {
      type: Number,
      default: 0
    },
    maxPoints: {
      type: Number,
      default: 1
    }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: {
      type: [answerRecordSchema],
      default: []
    },
    totalScore: {
      type: Number,
      required: true,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true,
      default: 0
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    },
    passed: {
      type: Boolean,
      required: true,
      default: false
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
