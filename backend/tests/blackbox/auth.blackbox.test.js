const request = require('supertest');
const app = require('../../src/app');
const { connectTestDB, closeTestDB, clearTestDB } = require('../setup');

describe('Blackbox Test Suite: Authentication API Endpoints', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  // BB-01
  test('BB-01: POST /api/auth/register - Successfully register student with valid data (201 Created)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Student',
        email: 'john@student.com',
        password: 'password123',
        role: 'student'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe('student');
    expect(res.body.user.email).toBe('john@student.com');
  });

  // BB-02
  test('BB-02: POST /api/auth/register - Successfully register admin with valid role (201 Created)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Professor Admin',
        email: 'prof@admin.com',
        password: 'adminPassword123',
        role: 'admin'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('admin');
  });

  // BB-03
  test('BB-03: POST /api/auth/register - Rejects registration with duplicate email (400 Bad Request)', async () => {
    const userData = {
      name: 'Duplicate User',
      email: 'dup@example.com',
      password: 'password123'
    };

    // First registration
    await request(app).post('/api/auth/register').send(userData);

    // Second registration with same email
    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  // BB-04
  test('BB-04: POST /api/auth/register - Rejects registration with missing required fields (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'incomplete@example.com'
        // Missing name and password
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  // BB-05
  test('BB-05: POST /api/auth/login - Successfully login with valid credentials returning token (200 OK)', async () => {
    // Seed user
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'mypassword123',
      role: 'student'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@test.com',
        password: 'mypassword123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@test.com');
  });

  // BB-06
  test('BB-06: POST /api/auth/login - Rejects login with incorrect password (401 Unauthorized)', async () => {
    // Seed user
    await request(app).post('/api/auth/register').send({
      name: 'Password Test',
      email: 'pwd@test.com',
      password: 'correctPassword123'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'pwd@test.com',
        password: 'wrongPassword999'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  // BB-07
  test('BB-07: POST /api/auth/login - Rejects login with non-existent email (401 Unauthorized)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@nowhere.com',
        password: 'randomPassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  // BB-08
  test('BB-08: GET /api/auth/me - Returns current user profile with valid token (200 OK) and rejects without token (401)', async () => {
    // Register and get token
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Profile User',
      email: 'profile@test.com',
      password: 'password123'
    });
    const token = registerRes.body.token;

    // Authorized request
    const authRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(authRes.status).toBe(200);
    expect(authRes.body.user.email).toBe('profile@test.com');

    // Unauthorized request without token
    const noTokenRes = await request(app).get('/api/auth/me');
    expect(noTokenRes.status).toBe(401);
  });
});
