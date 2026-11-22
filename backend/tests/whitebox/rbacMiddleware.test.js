const { authorize } = require('../../src/middleware/auth');

describe('Whitebox Test Suite: RBAC Authorization Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  // WB-15
  test('WB-15: authorize middleware calls next() when req.user.role matches allowed role', () => {
    mockReq.user = { id: 'admin1', role: 'admin' };
    const middleware = authorize('admin');

    middleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  // WB-16
  test('WB-16: authorize middleware returns 403 Forbidden when req.user.role does not match allowed role', () => {
    mockReq.user = { id: 'student1', role: 'student' };
    const middleware = authorize('admin');

    middleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Forbidden')
      })
    );
  });

  // WB-17
  test('WB-17: authorize middleware returns 401 Unauthorized when req.user is undefined or missing', () => {
    mockReq.user = null; // Unauthenticated state
    const middleware = authorize('admin', 'student');

    middleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Authentication required')
      })
    );
  });
});
