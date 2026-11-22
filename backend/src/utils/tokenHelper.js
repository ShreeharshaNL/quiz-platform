const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  return process.env.JWT_SECRET || 'default_jwt_secret_for_dev_mode';
};

const getJwtExpiry = () => {
  return process.env.JWT_EXPIRE || '7d';
};

/**
 * Generate a signed JWT token
 * @param {Object} payload - { id, role, email }
 * @param {String} [expiresIn] - optional expiration override
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }
  const secret = getJwtSecret();
  const options = {
    expiresIn: expiresIn || getJwtExpiry()
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Verify and decode a JWT token
 * @param {String} token - JWT token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token string is required');
  }
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
  getJwtSecret,
  getJwtExpiry
};
