const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [3, 'Question text must be at least 3 characters long']
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 2;
        },
        message: 'A question must have at least 2 options'
      }
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: [0, 'Index cannot be negative']
    },
    points: {
      type: Number,
      default: 1,
      min: [1, 'Points must be at least 1']
    },
    explanation: {
      type: String,
      default: ''
    }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    timeLimitMinutes: {
      type: Number,
      required: [true, 'Time limit is required'],
      default: 10,
      min: [1, 'Time limit must be at least 1 minute'],
      max: [180, 'Time limit cannot exceed 180 minutes']
    },
    passingScorePercent: {
      type: Number,
      default: 60,
      min: [0, 'Passing score must be between 0 and 100'],
      max: [100, 'Passing score must be between 0 and 100']
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: {
      type: [questionSchema],
      required: [true, 'Questions are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'A quiz must contain at least one question'
      }
    }
  },
  {
    timestamps: true
  }
);

// Method to sanitize quiz for students (strip out correct answers and explanations during quiz taking)
quizSchema.methods.toStudentView = function () {
  const quizObj = this.toObject();
  quizObj.questions = quizObj.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    points: q.points
    // correctOptionIndex and explanation are deliberately omitted
  }));
  return quizObj;
};

module.exports = mongoose.model('Quiz', quizSchema);
