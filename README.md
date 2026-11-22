# QuizVerse - Full-Stack MERN Quiz Platform with Role-Based Authentication

A full-stack, production-ready Quiz Platform built using the **MERN** stack (MongoDB, Express.js, React, Node.js) featuring strict **Role-Based Access Control (RBAC)**, an interactive timed quiz taker, and **34 automated test cases** spanning both **Whitebox** and **Blackbox** testing methodologies.

---

## 🚀 Key Features

### 🔐 Role-Based Access Control (RBAC)
- **Admin / Quiz Creator**:
  - Create and configure quizzes with title, time limits, and custom passing score thresholds.
  - Interactive question builder: add multiple-choice questions, dynamic options, select correct answers, and assign points.
  - Analytics Dashboard: review all student submissions, view pass rates, average scores, and delete quizzes.
- **Student**:
  - Browse available published quizzes.
  - Interactive Quiz Taking Interface with **live countdown timer** and warning alerts.
  - **Auto-Submission** when the time limit expires.
  - Answer Leak Protection: Student API responses deliberately omit correct answers until after submission.
  - Immediate score calculation with question-by-question review, explanations, and personal submission history.

### 🧪 Comprehensive Testing Suite (34 Test Cases)
- **17 Whitebox Tests**: Score calculation engine, input validators, JWT helpers, and RBAC authorization middleware.
- **17 Blackbox Tests**: REST API endpoints for authentication, quiz creation, student submissions, and permission barriers.

---

## 📁 Project Architecture

```
quiz/
├── .env                         # Root environment configuration (MongoDB URI, JWT secret, etc.)
├── .env.example                 # Root environment template
├── package.json                 # Root script runner (runs tests, starts apps)
├── TEST_SPECIFICATION.md        # Detailed breakdown of all 34 Whitebox & Blackbox test cases
├── README.md                    # Project documentation
│
├── backend/                     # Node.js & Express REST API Server
│   ├── .env                     # Backend environment configuration
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Backend dependencies (express, mongoose, jest, supertest, etc.)
│   ├── server.js                # Server entry point
│   ├── src/
│   │   ├── app.js               # Express app configuration & middleware
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, me
│   │   │   ├── quizController.js       # Quiz CRUD, analytics
│   │   │   └── submissionController.js # Quiz submission, student history
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification & RBAC authorize() middleware
│   │   │   └── errorHandler.js  # Global error & exception handler
│   │   ├── models/
│   │   │   ├── Quiz.js          # Quiz & Question Mongoose schema
│   │   │   ├── Submission.js    # Student submission & score schema
│   │   │   └── User.js          # User schema with bcrypt password hashing
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── quizRoutes.js
│   │   │   └── submissionRoutes.js
│   │   └── utils/
│   │       ├── scoreCalculator.js      # Core scoring and pass/fail engine
│   │       ├── tokenHelper.js          # JWT signing and verification
│   │       └── validator.js            # Payload schema validator
│   └── tests/
│       ├── setup.js             # In-memory MongoDB test server setup
│       ├── whitebox/            # 17 Whitebox unit tests
│       │   ├── scoreCalculator.test.js (6 tests)
│       │   ├── validator.test.js       (5 tests)
│       │   ├── tokenHelper.test.js     (3 tests)
│       │   └── rbacMiddleware.test.js  (3 tests)
│       └── blackbox/            # 17 Blackbox API integration tests
│           ├── auth.blackbox.test.js   (8 tests)
│           └── quiz.blackbox.test.js   (9 tests)
│
└── frontend/                    # Vite + React Client Application
    ├── .env                     # Frontend environment configuration
    ├── .env.example             # Frontend environment template
    ├── package.json             # Frontend dependencies (react, react-router-dom, axios, lucide)
    ├── vite.config.js           # Vite dev server & proxy settings
    ├── index.html               # Web HTML entry
    └── src/
        ├── App.jsx              # Routing & application shell
        ├── main.jsx             # React DOM root
        ├── index.css            # Modern styling & design system
        ├── context/
        │   └── AuthContext.jsx  # Global authentication & role state
        ├── components/
        │   ├── Navbar.jsx       # Navigation bar with role badges
        │   └── ProtectedRoute.jsx # Role-based route guard
        ├── pages/
        │   ├── Home.jsx         # Landing page
        │   ├── Login.jsx        # Login page with role redirection
        │   ├── Register.jsx     # Registration with Student/Admin role selector
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx  # Quiz manager & stats
        │   │   ├── CreateQuiz.jsx      # Dynamic quiz and question builder
        │   │   └── QuizSubmissions.jsx # Performance analytics & student results
        │   └── student/
        │       ├── StudentDashboard.jsx# Available quizzes & past attempts
        │       ├── TakeQuiz.jsx        # Interactive quiz session with timer
        │       └── QuizResult.jsx      # Instant score card & answer review
        └── services/
            └── api.js           # Axios client with JWT auto-injection
```

---

## ⚙️ Configuration (.env)

The `.env` file is generated at the root and inside the `backend/` directory.

Open `.env` (or `backend/.env`) and configure your values:

```env
# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# MongoDB Connection String (Replace with your local Mongo URI or MongoDB Atlas URI)
MONGO_URI=mongodb://localhost:27017/quiz_platform

# JSON Web Token Secret (Change to any secret string)
JWT_SECRET=super_secret_jwt_key_change_in_production_123456
JWT_EXPIRE=7d

# Frontend CORS Origin URL
CLIENT_URL=http://localhost:5173

# Frontend Vite API URL (in frontend/.env)
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup

### 1. Install Dependencies
Run the installation script from the project root:
```bash
npm run install:all
```
*(Or install each folder individually with `cd backend && npm install` and `cd frontend && npm install`)*

---

### 2. Run Automated Tests (34 Tests)
The tests use an in-memory MongoDB server (`mongodb-memory-server`), so **no local or external MongoDB server is needed** to run tests!

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

---

### 3. Start the Development Servers

#### Option A: Running in separate terminals

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```
*The API will start on `http://localhost:5000` (or the PORT configured in `.env`).*

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
*The React application will start on `http://localhost:5173`.*

#### Option B: Running from root
```bash
# Terminal 1:
npm run backend

# Terminal 2:
npm run frontend
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`student` or `admin`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Quizzes (`/api/quizzes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes` | Private | List all published quizzes (answers stripped for students) |
| `POST` | `/api/quizzes` | Admin only | Create a new quiz with questions and options |
| `GET` | `/api/quizzes/:id` | Private | Get quiz by ID (student view hides correct answers) |
| `PUT` | `/api/quizzes/:id` | Admin only | Update quiz details |
| `DELETE` | `/api/quizzes/:id` | Admin only | Delete quiz and its submissions |
| `GET` | `/api/quizzes/:id/analytics` | Admin only | Get submission stats, pass rate, average scores |
| `POST` | `/api/quizzes/:id/submit` | Private (Student) | Submit quiz answers and receive instant score |
| `GET` | `/api/quizzes/:id/submissions` | Admin only | View all student submissions for a specific quiz |

### Submissions (`/api/submissions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/submissions/my` | Private (Student) | Fetch logged-in student's submission history |
| `GET` | `/api/submissions/:id` | Private (Student/Admin)| View submission result details & question review |

---

## 👥 Roles & Workflows

### Admin Workflow
1. Register with role **Admin / Creator**.
2. Visit `/admin` to view your created quizzes and performance metrics.
3. Click **"Create New Quiz"** (`/admin/create`), enter quiz title, time limit (minutes), passing percentage, and dynamically add questions.
4. For each question, supply options, choose the correct answer radio button, and specify points.
5. Save the quiz.
6. When students complete quizzes, click **"Results"** on the dashboard to view detailed analytics (pass rates, average score, attempt timestamps).

### Student Workflow
1. Register with role **Student**.
2. Visit `/dashboard` to see all available quizzes.
3. Click **"Start Quiz"** (`/quiz/:id`).
4. Read questions and pick choices with the active countdown timer running.
5. If the countdown reaches 0:00, the system automatically submits your answers.
6. Submit answers to receive immediate grading: score, percentage, Pass/Fail banner, and question-level review.
7. Re-visit `/dashboard` anytime to review past quiz attempt scores.
