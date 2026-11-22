import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  BookOpen,
  Check,
  Star,
  Globe,
  Code2,
  Clock,
  Award,
  Layers,
  HelpCircle,
  Play,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('library');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizRes, subRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/submissions/my')
        ]);
        setQuizzes(quizRes.data.quizzes || []);
        setSubmissions(subRes.data.submissions || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute total student score
  const totalScoreEarned = submissions.reduce((acc, sub) => acc + (sub.totalScore || 0), 0);
  const totalCompleted = submissions.length;

  // Helper to pick category icon based on title
  const getCategoryIcon = (title) => {
    const lower = (title || '').toLowerCase();
    if (lower.includes('geo') || lower.includes('world') || lower.includes('earth')) {
      return (
        <div className="quiz-category-icon" style={{ background: '#d1fae5', color: '#059669' }}>
          <Globe size={18} />
        </div>
      );
    }
    if (lower.includes('py') || lower.includes('js') || lower.includes('code') || lower.includes('react')) {
      return (
        <div className="quiz-category-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          <Code2 size={18} />
        </div>
      );
    }
    return (
      <div className="quiz-category-icon" style={{ background: '#e6f4f2', color: '#0f766e' }}>
        <BookOpen size={18} />
      </div>
    );
  };

  return (
    <div className="workspace-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Top Header matching Mockup Bottom-Left */}
        <div className="student-library-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeTab === 'history' ? 'My Attempt History' : activeTab === 'leaderboard' ? 'Leaderboard & Rankings' : 'Student Quiz Library'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '0.2rem' }}>
              Explore interactive curriculum, track performance milestones, and test your knowledge.
            </p>
          </div>

          {/* Top Right Badges: ✓ Progress 3, ⭐ Score 0 */}
          <div className="student-badges-row">
            <div className="student-stat-pill">
              <Check size={16} color="var(--teal-primary)" />
              <span>Progress {totalCompleted}</span>
            </div>
            <div className="student-stat-pill">
              <Star size={16} color="#eab308" fill="#eab308" />
              <span>Score {totalScoreEarned}</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab: Quiz Library Grid */}
        {(activeTab === 'library' || activeTab === 'home') && (
          <div>
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading interactive quizzes...
              </div>
            ) : quizzes.length === 0 ? (
              <div className="theme-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <BookOpen size={44} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  No Quizzes Available
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Your instructors haven't published any quizzes yet. Please check back later.
                </p>
              </div>
            ) : (
              <div className="quiz-library-grid">
                {quizzes.map((quiz, idx) => (
                  <div key={quiz._id} className="quiz-theme-card">
                    <div>
                      <div className="quiz-card-top">
                        <h2 className="quiz-card-title">{quiz.title}</h2>
                        {getCategoryIcon(quiz.title)}
                      </div>

                      <p className="quiz-card-desc">
                        {quiz.description || 'Comprehensive evaluation designed to validate mastery and core competencies.'}
                      </p>

                      <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} /> {quiz.timeLimitMinutes} Mins
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <HelpCircle size={13} /> {quiz.questionCount || 0} Questions
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Award size={13} /> Pass: {quiz.passingScorePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="quiz-card-footer">
                      <div className="quiz-difficulty-stars">
                        <span>Difficulty</span>
                        <span>★ 1</span>
                      </div>

                      <Link
                        to={`/quiz/${quiz._id}`}
                        className="btn-navy btn-sm"
                        style={{ padding: '0.45rem 1.15rem' }}
                      >
                        Start Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: History Table */}
        {activeTab === 'history' && (
          <div className="theme-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Completed Submissions ({submissions.length})
            </h2>

            {submissions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                You have not completed any quizzes yet. Pick a quiz from the library to test your knowledge!
              </p>
            ) : (
              <div className="table-container-theme">
                <table className="theme-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub._id}>
                        <td style={{ fontWeight: 700 }}>{sub.quizId?.title || 'Archived Quiz'}</td>
                        <td>{sub.totalScore} / {sub.maxScore}</td>
                        <td style={{ fontWeight: 700 }}>{sub.percentage}%</td>
                        <td>
                          <span className={`badge-pill ${sub.passed ? 'badge-green' : 'badge-red'}`}>
                            {sub.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link to={`/results/${sub._id}`} className="btn-outline btn-sm">
                            View Breakdown →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="theme-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Class Leaderboard
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Top scoring students across all verified quizzes in QuizVerse.
            </p>
            <div className="table-container-theme">
              <table className="theme-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Total Score</th>
                    <th>Quizzes Passed</th>
                    <th>Badge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge-pill badge-amber">#1</span></td>
                    <td><strong>Alex Rivera</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--teal-primary)' }}>28 pts</td>
                    <td>6 / 6</td>
                    <td><span className="badge-pill badge-green">Master</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge-pill badge-gray">#2</span></td>
                    <td><strong>Jordan Lee</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--teal-primary)' }}>24 pts</td>
                    <td>5 / 6</td>
                    <td><span className="badge-pill badge-teal">Scholar</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge-pill badge-gray">#3</span></td>
                    <td><strong>Taylor Chen</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--teal-primary)' }}>20 pts</td>
                    <td>4 / 5</td>
                    <td><span className="badge-pill badge-teal">Scholar</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
