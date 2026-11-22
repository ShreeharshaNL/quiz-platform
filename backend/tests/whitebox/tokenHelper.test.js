const { generateToken, verifyToken } = require('../../src/utils/tokenHelper');

describe('Whitebox Test Suite: JWT Token Helper', () => {
  // WB-12
  test('WB-12: generateToken generates a valid signed JWT string containing encoded payload', () => {
    const payload = { id: 'user_12345', role: 'admin', email: 'admin@quiz.com' };
    const token = generateToken(payload, '1h');

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // Header.Payload.Signature
  });

  // WB-13
  test('WB-13: verifyToken successfully decodes a valid token matching original payload', () => {
    const payload = { id: 'user_98765', role: 'student', email: 'student@quiz.com' };
    const token = generateToken(payload, '2h');

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.exp).toBeDefined();
  });

  // WB-14
  test('WB-14: verifyToken throws error when invalid or tampered token string is provided', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature';
    expect(() => {
      verifyToken(invalidToken);
    }).toThrow();

    expect(() => {
      verifyToken(null);
    }).toThrow('Token string is required');
  });
});
