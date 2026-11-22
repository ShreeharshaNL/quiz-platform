const request = require('supertest');
const app = require('../../src/app');
const { connectTestDB, closeTestDB, clearTestDB } = require('../setup');

describe('Blackbox Test Suite: Quiz Management & Submissions Endpoints', () => {
  let adminToken;
  let studentToken;
  let studentId;
  let createdQuizId;

  const validQuizData = {
    title: 'React Fundamentals Quiz',
    description: 'A test of essential React concepts and hooks',
    timeLimitMinutes: 15,
    passingScorePercent: 60,
    questions: [
      {
        questionText: 'What hook is used to manage side effects in React?',
        options: ['useState', 'useEffect', 'useReducer', 'useCallback'],
        correctOptionIndex: 1,
        points: 2
      },
      {
        questionText: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON with Style'],
        correctOptionIndex: 0,
        points: 2
      }
    ]
  };

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Register admin
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@quiz.com',
      password: 'adminPassword123',
      role: 'admin'
    });
    adminToken = adminRes.body.token;

    // Register student
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Student User',
      email: 'student@quiz.com',
      password: 'studentPassword123',
      role: 'student'
    });
    studentToken = studentRes.body.token;
    studentId = studentRes.body.user.id;

    // Seed one quiz by admin
    const quizRes = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validQuizData);
    createdQuizId = quizRes.body.quiz._id;
  });

  // BB-09
  test('BB-09: POST /api/quizzes - Admin can create a new quiz successfully (201 Created)', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Node.js Mastery',
        timeLimitMinutes: 20,
        questions: [
          {
            questionText: 'Which module is used to create an HTTP server in Node?',
            options: ['http', 'url', 'path', 'fs'],
            correctOptionIndex: 0,
            points: 1
          }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz.title).toBe('Node.js Mastery');
    expect(res.body.quiz._id).toBeDefined();
  });

  // BB-10
  test('BB-10: POST /api/quizzes - Student is forbidden from creating a quiz (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(validQuizData);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Forbidden/i);
  });

  // BB-11
  test('BB-11: POST /api/quizzes - Unauthenticated user cannot create a quiz (401 Unauthorized)', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .send(validQuizData);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // BB-12
  test('BB-12: GET /api/quizzes - Authenticated user can fetch all published quizzes (200 OK)', async () => {
    const res = await request(app)
      .get('/api/quizzes')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.quizzes)).toBe(true);
    expect(res.body.quizzes.length).toBeGreaterThanOrEqual(1);
  });

  // BB-13
  test('BB-13: GET /api/quizzes/:id - Student gets quiz without exposed correct answers (200 OK)', async () => {
    const res = await request(app)
      .get(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz.questions).toBeDefined();

    // Verify correctOptionIndex is NOT leaked in student view
    res.body.quiz.questions.forEach((q) => {
      expect(q.correctOptionIndex).toBeUndefined();
    });
  });

  // BB-14
  test('BB-14: POST /api/quizzes/:id/submit - Student submits answers and receives computed result (200 OK)', async () => {
    // Get quiz questions to extract question IDs
    const quizRes = await request(app)
      .get(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    const q1Id = quizRes.body.quiz.questions[0]._id;
    const q2Id = quizRes.body.quiz.questions[1]._id;

    const res = await request(app)
      .post(`/api/quizzes/${createdQuizId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: [
          { questionId: q1Id, selectedOptionIndex: 1 }, // Correct
          { questionId: q2Id, selectedOptionIndex: 0 }  // Correct
        ],
        timeSpentSeconds: 120
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.totalScore).toBe(4);
    expect(res.body.result.maxScore).toBe(4);
    expect(res.body.result.percentage).toBe(100);
    expect(res.body.result.passed).toBe(true);
  });

  // BB-15
  test('BB-15: GET /api/submissions/my - Student can fetch their personal quiz submission history (200 OK)', async () => {
    // Submit quiz first
    const quizRes = await request(app)
      .get(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    const q1Id = quizRes.body.quiz.questions[0]._id;

    await request(app)
      .post(`/api/quizzes/${createdQuizId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: [{ questionId: q1Id, selectedOptionIndex: 1 }],
        timeSpentSeconds: 60
      });

    const res = await request(app)
      .get('/api/submissions/my')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.submissions)).toBe(true);
    expect(res.body.submissions.length).toBe(1);
    expect(res.body.submissions[0].quizId.title).toBe(validQuizData.title);
  });

  // BB-16
  test('BB-16: DELETE /api/quizzes/:id - Student is forbidden from deleting a quiz (403 Forbidden)', async () => {
    const res = await request(app)
      .delete(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // BB-17
  test('BB-17: DELETE /api/quizzes/:id - Admin can delete quiz successfully (200 OK)', async () => {
    const res = await request(app)
      .delete(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is deleted
    const verifyRes = await request(app)
      .get(`/api/quizzes/${createdQuizId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(verifyRes.status).toBe(404);
  });
});
