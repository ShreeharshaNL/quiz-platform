import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Clock,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Award,
  LogIn,
  Check,
  BookOpen,
  HelpCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  // Interactive live preview card state
  const [selectedOption, setSelectedOption] = useState(1);

  const previewOptions = [
    { id: 0, text: 'var counter = 0;', isCorrect: false },
    { id: 1, text: 'let counter = 0;', isCorrect: true },
    { id: 2, text: 'function counter() {}', isCorrect: false },
    { id: 3, text: 'counter = 0;', isCorrect: false }
  ];

  return (
    <div className="landing-page">
      {/* ====================================================================
          1. Hero Section
          ==================================================================== */}
      <section className="landing-hero">
        <div className="landing-pill">
          <Sparkles size={14} />
          <span>Modern Quiz & Assessment Engine</span>
        </div>

        <h1 className="landing-title">
          Assess with precision.{' '}
          <span className="landing-title-highlight">Learn with confidence.</span>
        </h1>

        <p className="landing-subtitle">
          A minimalist platform designed for educators to craft timed challenges and students
          to master concepts with real-time automated scoring and instant feedback.
        </p>

        {isAuthenticated ? (
          <div>
            <div className="landing-auth-banner">
              <span style={{ color: 'var(--text-muted)' }}>Signed in as:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
              <span className={`badge-pill ${isAdmin ? 'badge-amber' : 'badge-teal'}`}>
                {isAdmin ? 'Instructor / Admin' : 'Student'}
              </span>
            </div>

            <div className="landing-cta-group">
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="btn-teal"
                style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
              >
                <span>Continue to {isAdmin ? 'Admin Dashboard' : 'Student Library'}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="landing-cta-group">
            <Link
              to="/register"
              className="btn-teal"
              style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="btn-outline"
              style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          </div>
        )}

        {/* Micro Trust / Feature highlights */}
        <div className="landing-trust-row">
          <div className="landing-trust-item">
            <Clock size={16} color="var(--teal-primary)" />
            <span>Precision Timed Quizzes</span>
          </div>
          <div className="landing-trust-item">
            <Zap size={16} color="#d97706" />
            <span>Instant Automated Grading</span>
          </div>
          <div className="landing-trust-item">
            <ShieldCheck size={16} color="var(--teal-primary)" />
            <span>Role-Based Permissions</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. Interactive Live Preview Card
          ==================================================================== */}
      <section style={{ width: '100%' }}>
        <div className="landing-preview-card">
          {/* Mock Header */}
          <div className="landing-preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block'
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Live Quiz Preview: Modern JavaScript Essentials
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                background: '#f1f5f9',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px'
              }}
            >
              <Clock size={14} color="var(--teal-primary)" />
              <span>04:42</span>
            </div>
          </div>

          {/* Mock Question Body */}
          <div className="landing-preview-body">
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--teal-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.4rem'
              }}
            >
              Question 1 of 5 • 10 Points
            </div>

            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                lineHeight: 1.4
              }}
            >
              Which JavaScript keyword declares a variable with true block scope?
            </div>

            {/* Options */}
            <div>
              {previewOptions.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`landing-preview-option ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedOption(opt.id)}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--teal-primary)' : '2px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--teal-primary)'
                          }}
                        />
                      )}
                    </div>
                    <code style={{ fontSize: '0.92rem', color: isSelected ? 'var(--teal-primary)' : 'inherit' }}>
                      {opt.text}
                    </code>
                  </div>
                );
              })}
            </div>

            {/* Interactive Feedback Pill */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: previewOptions[selectedOption]?.isCorrect ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${previewOptions[selectedOption]?.isCorrect ? '#bbf7d0' : '#fde68a'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem'
              }}
            >
              {previewOptions[selectedOption]?.isCorrect ? (
                <>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span style={{ color: '#166534', fontWeight: 600 }}>
                    Correct! <code>let</code> and <code>const</code> provide block scoping, preventing variable leaks.
                  </span>
                </>
              ) : (
                <>
                  <HelpCircle size={16} color="#d97706" />
                  <span style={{ color: '#92400e', fontWeight: 500 }}>
                    Click option B (<code>let</code>) to see automated validation.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mock Footer */}
          <div className="landing-preview-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={14} color="var(--teal-primary)" />
              <span>Passing threshold: 70%</span>
            </div>
            <div>Automated instantaneous scoring</div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. Core Pillars (3-Column Minimal Grid)
          ==================================================================== */}
      <section>
        <div className="landing-section-header">
          <h2 className="landing-section-title">Designed for focus and speed</h2>
          <p className="landing-section-desc">
            Everything you need for seamless assessments, without the unnecessary clutter.
          </p>
        </div>

        <div className="landing-grid-3">
          {/* Card 1 */}
          <div className="landing-card">
            <div className="landing-icon-badge" style={{ background: '#ccfbf1', color: '#0f766e' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Precision Timers
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Set custom duration limits for quizzes. Live countdowns with visual alerts and automated submission on expiry guarantee fairness.
            </p>
          </div>

          {/* Card 2 */}
          <div className="landing-card">
            <div className="landing-icon-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Instant Scoring Engine
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              No waiting for test results. Objective score algorithms calculate points immediately, delivering question-by-question review and feedback.
            </p>
          </div>

          {/* Card 3 */}
          <div className="landing-card">
            <div className="landing-icon-badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Anti-Leak Security
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Strict role-based access control hides answer keys from the client payload until submission is safely verified and recorded.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. How It Works (3 Steps)
          ==================================================================== */}
      <section>
        <div className="landing-section-header">
          <h2 className="landing-section-title">How QuizVerse works</h2>
          <p className="landing-section-desc">
            Simple 3-step workflow from authoring questions to reviewing performance.
          </p>
        </div>

        <div className="landing-grid-3">
          <div className="landing-card" style={{ borderTop: '3px solid var(--teal-primary)' }}>
            <div className="landing-step-num">01</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Create or Pick
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Instructors publish timed quizzes with custom passing bars; students browse available subjects directly from their library.
            </p>
          </div>

          <div className="landing-card" style={{ borderTop: '3px solid #0284c7' }}>
            <div className="landing-step-num">02</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Engage & Solve
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Test your knowledge in a distraction-free exam runner with intuitive navigation and real-time timer warnings.
            </p>
          </div>

          <div className="landing-card" style={{ borderTop: '3px solid #10b981' }}>
            <div className="landing-step-num">03</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Review & Grow
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Receive instantaneous scorecards, inspect correct answers, and track historical progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. Role-Tailored Portals (Students & Educators)
          ==================================================================== */}
      <section>
        <div className="landing-section-header">
          <h2 className="landing-section-title">Built for both roles</h2>
          <p className="landing-section-desc">
            Whether you are learning or evaluating, QuizVerse provides dedicated tools for your workflow.
          </p>
        </div>

        <div className="landing-grid-2">
          {/* Student Portal Card */}
          <div className="landing-role-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: '#ccfbf1',
                    color: '#0f766e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    For Students
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive learning</span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Master subjects at your pace or challenge yourself against strict exam timers with instant scoring.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--teal-primary)" />
                  <span>Curated quiz library across multiple subjects</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--teal-primary)" />
                  <span>Live countdown clock with automatic submission</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--teal-primary)" />
                  <span>Question-by-question explanations and review</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--teal-primary)" />
                  <span>Attempt history and personal score tracking</span>
                </div>
              </div>
            </div>

            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn-outline"
              style={{ justifyContent: 'center' }}
            >
              <span>{isAuthenticated ? 'Open Student Portal' : 'Start as Student'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Educator / Admin Portal Card */}
          <div className="landing-role-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    For Instructors & Admins
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assessment management</span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Author comprehensive quizzes with dynamic questions, configure passing thresholds, and review analytics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Dynamic question builder with customizable points</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Configurable time limits and passing criteria</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Student submission records and pass rate metrics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Secure API endpoints with anti-leak protection</span>
                </div>
              </div>
            </div>

            <Link
              to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/register'}
              className="btn-outline"
              style={{ justifyContent: 'center' }}
            >
              <span>{isAuthenticated ? 'Open Admin Panel' : 'Start as Instructor'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. Bottom Call to Action Banner
          ==================================================================== */}
      <section className="landing-banner">
        <h2 className="landing-banner-title">
          Ready to test your knowledge?
        </h2>
        <p className="landing-banner-subtitle">
          Join QuizVerse today to explore timed challenges, measure performance, and experience modern educational assessments.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/register'}
            className="btn-teal"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#0d9488',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
            }}
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}</span>
            <ArrowRight size={18} />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'background 0.15s'
              }}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
