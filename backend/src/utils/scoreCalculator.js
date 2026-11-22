/**
 * Score Calculator Utility
 * Evaluates student answers against quiz questions, computes points, percentage, and pass/fail status.
 */

/**
 * Calculates the score of a quiz submission
 * @param {Array} questions - Array of quiz question objects
 * @param {Array} answers - Array of submitted answers [{ questionId, selectedOptionIndex }]
 * @param {Number} [passingPercentage=60] - Minimum percentage required to pass
 * @returns {Object} { totalScore, maxScore, percentage, passed, answerDetails }
 */
const calculateQuizScore = (questions = [], answers = [], passingPercentage = 60) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      passed: false,
      answerDetails: []
    };
  }

  // Map answers by questionId string for quick lookup
  const answerMap = new Map();
  if (Array.isArray(answers)) {
    answers.forEach((ans) => {
      if (ans && ans.questionId) {
        answerMap.set(ans.questionId.toString(), ans.selectedOptionIndex);
      }
    });
  }

  let totalScore = 0;
  let maxScore = 0;
  const answerDetails = [];

  questions.forEach((q, index) => {
    const qIdStr = q._id ? q._id.toString() : index.toString();
    const points = typeof q.points === 'number' && q.points > 0 ? q.points : 1;
    maxScore += points;

    const selectedOption = answerMap.has(qIdStr) ? answerMap.get(qIdStr) : null;
    const isCorrect =
      selectedOption !== null &&
      selectedOption !== undefined &&
      typeof selectedOption === 'number' &&
      selectedOption === q.correctOptionIndex;

    const pointsAwarded = isCorrect ? points : 0;
    totalScore += pointsAwarded;

    answerDetails.push({
      questionId: q._id || index,
      questionText: q.questionText || '',
      selectedOptionIndex: selectedOption,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      pointsAwarded,
      maxPoints: points
    });
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100 * 100) / 100 : 0;
  const threshold = typeof passingPercentage === 'number' && passingPercentage >= 0 ? passingPercentage : 60;
  const passed = percentage >= threshold;

  return {
    totalScore,
    maxScore,
    percentage,
    passed,
    answerDetails
  };
};

module.exports = {
  calculateQuizScore
};
