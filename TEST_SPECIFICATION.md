# Test Specification & Verification Matrix

This document provides complete documentation for the **34 test cases** implemented for the MERN Quiz Platform. The suite combines **Whitebox Testing** (internal structural logic, unit calculations, and branch execution) and **Blackbox Testing** (API endpoints, integration, request/response contracts, and role-based security).

---

## 1. Summary Overview

| Category | Suite | Test Cases | Execution Command | Result |
| :--- | :--- | :---: | :--- | :---: |
| **Whitebox Testing** | `scoreCalculator.test.js` | 6 | `npm run test:whitebox` | **PASS (6/6)** |
| **Whitebox Testing** | `validator.test.js` | 5 | `npm run test:whitebox` | **PASS (5/5)** |
| **Whitebox Testing** | `tokenHelper.test.js` | 3 | `npm run test:whitebox` | **PASS (3/3)** |
| **Whitebox Testing** | `rbacMiddleware.test.js` | 3 | `npm run test:whitebox` | **PASS (3/3)** |
| **Blackbox Testing** | `auth.blackbox.test.js` | 8 | `npm run test:blackbox` | **PASS (8/8)** |
| **Blackbox Testing** | `quiz.blackbox.test.js` | 9 | `npm run test:blackbox` | **PASS (9/9)** |
| **Total** | **6 Suites** | **34 Tests** | `npm test` | **PASS (34/34)** |

---

## 2. Whitebox Test Cases (17 Tests)

Whitebox testing examines internal program structures, control flows, boundary logic, and exception paths.

### Suite A: Score Calculator Engine (`backend/tests/whitebox/scoreCalculator.test.js`)

| Test ID | Test Scenario | Input / Conditions | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **WB-01** | 100% correct answers calculation | 3 sample questions, student selects matching `correctOptionIndex` for all | `totalScore = 10`, `maxScore = 10`, `percentage = 100%`, `passed = true` |
| **WB-02** | 0% score when all answers wrong | 3 sample questions, student selects non-matching option indices | `totalScore = 0`, `maxScore = 10`, `percentage = 0%`, `passed = false` |
| **WB-03** | Partial score calculation with weighted points | 3 questions with points 2, 3, 5; student answers Q1 and Q3 correctly | `totalScore = 7`, `maxScore = 10`, `percentage = 70%`, `passed = true` |
| **WB-04** | Graceful handling of unattempted / skipped questions | Student answers only 1 out of 3 questions | Calculates attempted question points, leaves unattempted answers null without crashing |
| **WB-05** | Zero-state handling for empty or null questions input | Empty array `[]` or `null` passed to `calculateQuizScore` | Returns safe zero object `{ totalScore: 0, maxScore: 0, percentage: 0, passed: false }` |
| **WB-06** | Dynamic passing percentage threshold evaluation | Student achieves 50% score; test against threshold of 50% vs 75% | Threshold 50% returns `passed = true`; Threshold 75% returns `passed = false` |

### Suite B: Payload Validator (`backend/tests/whitebox/validator.test.js`)

| Test ID | Test Scenario | Input / Conditions | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **WB-07** | Valid registration payload validation | Complete object `{ name, email, password, role: 'student' }` | `isValid = true`, `errors` array is empty |
| **WB-08** | Rejection of malformed registration data | Invalid email, short password (<6 chars), invalid role string | `isValid = false`, returns array of specific error messages |
| **WB-09** | Valid quiz structure validation | Quiz with title, duration, valid options array and correct index | `isValid = true`, `errors` array is empty |
| **WB-10** | Enforce minimum 2 options per question | Question provided with only 1 option string | `isValid = false`, error contains `'at least 2 options'` |
| **WB-11** | Enforce valid `correctOptionIndex` bounds | Question with 3 options provided with `correctOptionIndex = 5` | `isValid = false`, error contains `'correct option index'` |

### Suite C: JWT Token Helper (`backend/tests/whitebox/tokenHelper.test.js`)

| Test ID | Test Scenario | Input / Conditions | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **WB-12** | Valid signed token generation | Payload `{ id, role, email }` with expiration | Produces a 3-part signed JWT string (`header.payload.signature`) |
| **WB-13** | Accurate token verification and decoding | Valid token signed with test secret | Decoded object matches original payload ID, role, and email |
| **WB-14** | Rejection of tampered or null token | Corrupted signature or `null` input | Throws an error preventing unauthorized access |

### Suite D: RBAC Middleware Unit Verification (`backend/tests/whitebox/rbacMiddleware.test.js`)

| Test ID | Test Scenario | Input / Conditions | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **WB-15** | Authorized role invokes `next()` | `req.user.role = 'admin'`, middleware requires `'admin'` | `next()` is called, response status is untouched |
| **WB-16** | Unauthorized role blocked with 403 Forbidden | `req.user.role = 'student'`, middleware requires `'admin'` | Returns HTTP 403 Forbidden with error message |
| **WB-17** | Unauthenticated user blocked with 401 Unauthorized | `req.user = null` (missing session) | Returns HTTP 401 Unauthorized |

---

## 3. Blackbox Test Cases (17 Tests)

Blackbox testing treats the system as a black box and verifies API inputs, outputs, status codes, and authorization rules from the client's perspective using Supertest.

### Suite E: Authentication API Endpoints (`backend/tests/blackbox/auth.blackbox.test.js`)

| Test ID | Endpoint & Method | Test Scenario | Expected Status & Response |
| :--- | :--- | :--- | :--- |
| **BB-01** | `POST /api/auth/register` | Register new student with valid credentials | **201 Created**, returns JWT token & sanitized user object with `role: 'student'` |
| **BB-02** | `POST /api/auth/register` | Register new admin with valid role specified | **201 Created**, returns JWT token with `role: 'admin'` |
| **BB-03** | `POST /api/auth/register` | Attempt duplicate registration with existing email | **400 Bad Request**, error message indicates account already exists |
| **BB-04** | `POST /api/auth/register` | Registration with missing required fields | **400 Bad Request**, returns field validation errors |
| **BB-05** | `POST /api/auth/login` | Successful login with registered credentials | **200 OK**, returns valid JWT token and user profile |
| **BB-06** | `POST /api/auth/login` | Login failure with incorrect password | **401 Unauthorized**, invalid email or password message |
| **BB-07** | `POST /api/auth/login` | Login failure with non-existent email | **401 Unauthorized**, invalid email or password message |
| **BB-08** | `GET /api/auth/me` | Fetch authenticated user profile with Bearer token vs no token | **200 OK** with valid token; **401 Unauthorized** when token omitted |

### Suite F: Quiz Management & Submissions (`backend/tests/blackbox/quiz.blackbox.test.js`)

| Test ID | Endpoint & Method | Test Scenario | Expected Status & Response |
| :--- | :--- | :--- | :--- |
| **BB-09** | `POST /api/quizzes` | Admin creates quiz with questions and options | **201 Created**, returns newly created quiz object with `_id` |
| **BB-10** | `POST /api/quizzes` | Student attempts to create quiz (RBAC restriction) | **403 Forbidden**, unauthorized role message |
| **BB-11** | `POST /api/quizzes` | Unauthenticated user attempts to create quiz | **401 Unauthorized**, token missing |
| **BB-12** | `GET /api/quizzes` | Authenticated user fetches published quizzes list | **200 OK**, returns array of quizzes |
| **BB-13** | `GET /api/quizzes/:id` | Student fetches quiz for test taking (Answer Leak Prevention) | **200 OK**, `correctOptionIndex` is strictly stripped from questions |
| **BB-14** | `POST /api/quizzes/:id/submit` | Student submits answers to quiz | **200 OK**, returns computed score, percentage, and pass/fail result |
| **BB-15** | `GET /api/submissions/my` | Student fetches personal submission history | **200 OK**, returns student's past attempts with scores |
| **BB-16** | `DELETE /api/quizzes/:id` | Student attempts to delete a quiz | **403 Forbidden**, permission denied |
| **BB-17** | `DELETE /api/quizzes/:id` | Admin deletes quiz | **200 OK**, quiz and associated submissions deleted |

---

## 4. Running the Tests

To run all 34 tests:
```bash
npm test
```

To run only the 17 Whitebox unit tests:
```bash
npm run test:whitebox
```

To run only the 17 Blackbox integration tests:
```bash
npm run test:blackbox
```
