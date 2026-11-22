const {
  validateRegisterInput,
  validateLoginInput,
  validateQuizInput
} = require('../../src/utils/validator');

describe('Whitebox Test Suite: Payload Validators', () => {
  // WB-07
  test('WB-07: validateRegisterInput accepts complete and valid registration data', () => {
    const validData = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'securePassword123',
      role: 'student'
    };

    const result = validateRegisterInput(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // WB-08
  test('WB-08: validateRegisterInput rejects invalid emails and short passwords (<6 chars)', () => {
    const invalidData = {
      name: 'A',
      email: 'not-an-email',
      password: '123',
      role: 'invalid_role'
    };

    const result = validateRegisterInput(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/email/i),
        expect.stringMatching(/password/i),
        expect.stringMatching(/role/i)
      ])
    );
  });

  // WB-09
  test('WB-09: validateQuizInput accepts well-formed quiz structure with valid questions and indices', () => {
    const validQuiz = {
      title: 'JavaScript Fundamentals',
      timeLimitMinutes: 15,
      passingScorePercent: 70,
      questions: [
        {
          questionText: 'What is typeof null in JavaScript?',
          options: ['"null"', '"object"', '"undefined"', '"number"'],
          correctOptionIndex: 1,
          points: 2
        }
      ]
    };

    const result = validateQuizInput(validQuiz);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // WB-10
  test('WB-10: validateQuizInput rejects quiz when a question has fewer than 2 options', () => {
    const invalidQuiz = {
      title: 'Math Quiz',
      questions: [
        {
          questionText: 'Is 2+2=4?',
          options: ['Yes'], // Only 1 option
          correctOptionIndex: 0
        }
      ]
    };

    const result = validateQuizInput(invalidQuiz);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((err) => err.includes('at least 2 options'))).toBe(true);
  });

  // WB-11
  test('WB-11: validateQuizInput rejects quiz when correctOptionIndex is out of bounds or negative', () => {
    const invalidQuiz = {
      title: 'History Quiz',
      questions: [
        {
          questionText: 'When was the Declaration of Independence signed?',
          options: ['1776', '1789', '1812'],
          correctOptionIndex: 5 // Out of bounds (length is 3)
        }
      ]
    };

    const result = validateQuizInput(invalidQuiz);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((err) => err.includes('correct option index'))).toBe(true);
  });
});
