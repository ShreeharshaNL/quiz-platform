/**
 * Validator Utility
 * Validates request payloads for authentication and quiz management.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate registration input
 * @param {Object} data - { name, email, password, role }
 * @returns {Object} { isValid, errors }
 */
const validateRegisterInput = (data = {}) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  if (!data.email || typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (data.role && !['admin', 'student'].includes(data.role)) {
    errors.push('Role must be either "admin" or "student"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login input
 * @param {Object} data - { email, password }
 * @returns {Object} { isValid, errors }
 */
const validateLoginInput = (data = {}) => {
  const errors = [];

  if (!data.email || typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!data.password || typeof data.password !== 'string' || data.password.trim() === '') {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate quiz creation / update input
 * @param {Object} data - { title, description, timeLimitMinutes, questions }
 * @returns {Object} { isValid, errors }
 */
const validateQuizInput = (data = {}) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Quiz title is required and must be at least 3 characters long');
  }

  if (data.timeLimitMinutes !== undefined) {
    const timeLimit = Number(data.timeLimitMinutes);
    if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) {
      errors.push('Time limit must be a number between 1 and 180 minutes');
    }
  }

  if (data.passingScorePercent !== undefined) {
    const passing = Number(data.passingScorePercent);
    if (isNaN(passing) || passing < 0 || passing > 100) {
      errors.push('Passing score percentage must be between 0 and 100');
    }
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push('A quiz must have at least one question');
  } else {
    data.questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim().length < 3) {
        errors.push(`Question ${qNum}: Text is required and must be at least 3 characters`);
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Question ${qNum}: Must have at least 2 options`);
      } else {
        const hasEmptyOption = q.options.some((opt) => typeof opt !== 'string' || opt.trim() === '');
        if (hasEmptyOption) {
          errors.push(`Question ${qNum}: Options cannot be empty strings`);
        }
      }
      if (
        typeof q.correctOptionIndex !== 'number' ||
        q.correctOptionIndex < 0 ||
        (Array.isArray(q.options) && q.correctOptionIndex >= q.options.length)
      ) {
        errors.push(`Question ${qNum}: Valid correct option index is required`);
      }
      if (q.points !== undefined && (isNaN(Number(q.points)) || Number(q.points) < 1)) {
        errors.push(`Question ${qNum}: Points must be a positive number of at least 1`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateQuizInput
};
