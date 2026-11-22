const { calculateQuizScore } = require('../../src/utils/scoreCalculator');

describe('Whitebox Test Suite: Score Calculator Engine', () => {
  const sampleQuestions = [
    {
      _id: 'q1',
      questionText: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language'],
      correctOptionIndex: 0,
      points: 2
    },
    {
      _id: 'q2',
      questionText: 'Which keyword defines a constant in JavaScript?',
      options: ['var', 'let', 'const'],
      correctOptionIndex: 2,
      points: 3
    },
    {
      _id: 'q3',
      questionText: 'Is Node.js single threaded?',
      options: ['Yes', 'No'],
      correctOptionIndex: 0,
      points: 5
    }
  ];

  // WB-01
  test('WB-01: Calculate score when student answers 100% of questions correctly', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 },
      { questionId: 'q2', selectedOptionIndex: 2 },
      { questionId: 'q3', selectedOptionIndex: 0 }
    ];

    const result = calculateQuizScore(sampleQuestions, answers, 60);

    expect(result.totalScore).toBe(10);
    expect(result.maxScore).toBe(10);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.answerDetails.every((a) => a.isCorrect)).toBe(true);
  });

  // WB-02
  test('WB-02: Calculate score when student answers 0% of questions correctly', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 1 },
      { questionId: 'q2', selectedOptionIndex: 0 },
      { questionId: 'q3', selectedOptionIndex: 1 }
    ];

    const result = calculateQuizScore(sampleQuestions, answers, 50);

    expect(result.totalScore).toBe(0);
    expect(result.maxScore).toBe(10);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.answerDetails.every((a) => !a.isCorrect)).toBe(true);
  });

  // WB-03
  test('WB-03: Calculate partial score when mixed questions are answered (some correct, some wrong)', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 }, // Correct (+2)
      { questionId: 'q2', selectedOptionIndex: 1 }, // Wrong (0)
      { questionId: 'q3', selectedOptionIndex: 0 }  // Correct (+5)
    ];

    const result = calculateQuizScore(sampleQuestions, answers, 60);

    expect(result.totalScore).toBe(7);
    expect(result.maxScore).toBe(10);
    expect(result.percentage).toBe(70);
    expect(result.passed).toBe(true);
    expect(result.answerDetails[0].isCorrect).toBe(true);
    expect(result.answerDetails[1].isCorrect).toBe(false);
    expect(result.answerDetails[2].isCorrect).toBe(true);
  });

  // WB-04
  test('WB-04: Handle unattempted / skipped questions gracefully without throwing errors', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 } // Only 1 question answered
    ];

    const result = calculateQuizScore(sampleQuestions, answers, 50);

    expect(result.totalScore).toBe(2);
    expect(result.maxScore).toBe(10);
    expect(result.percentage).toBe(20);
    expect(result.passed).toBe(false);
    expect(result.answerDetails[1].selectedOptionIndex).toBeNull();
    expect(result.answerDetails[1].isCorrect).toBe(false);
  });

  // WB-05
  test('WB-05: Handle empty or non-array questions input returning default zero-state object', () => {
    const emptyResult = calculateQuizScore([], []);
    expect(emptyResult.totalScore).toBe(0);
    expect(emptyResult.maxScore).toBe(0);
    expect(emptyResult.percentage).toBe(0);
    expect(emptyResult.passed).toBe(false);
    expect(emptyResult.answerDetails).toEqual([]);

    const nullResult = calculateQuizScore(null, null);
    expect(nullResult.totalScore).toBe(0);
    expect(nullResult.maxScore).toBe(0);
  });

  // WB-06
  test('WB-06: Pass/fail determination correctly matches custom passing percentage threshold', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 }, // 2 pts
      { questionId: 'q2', selectedOptionIndex: 2 }  // 3 pts => total 5/10 = 50%
    ];

    const passAt50 = calculateQuizScore(sampleQuestions, answers, 50);
    expect(passAt50.passed).toBe(true);

    const failAt75 = calculateQuizScore(sampleQuestions, answers, 75);
    expect(failAt75.passed).toBe(false);
  });
});
