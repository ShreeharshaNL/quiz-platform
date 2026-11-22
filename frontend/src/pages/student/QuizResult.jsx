import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { CheckCircle2, XCircle, ArrowLeft, Award, Clock, HelpCircle, Check, X } from 'lucide-react';

const QuizResult = () => {
  const { id } = useParams();
  const location = useLocation();

  const [submission, setSubmission] = useState(location.state?.result ? {
    ...location.state.result,
    quizId: { title: 'Quiz Results' }
  } : null);
  const [loading, setLoading] = useState(!submission);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!submission) {
      const fetchSubmission = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/submissions/${id}`);
          setSubmission(res.data.submission);
        } catch (err) {
          setError('Failed to load submission review.');
        } finally {
          setLoading(false);
        }
      };

      fetchSubmission();
    }
  }, [id, submission]);

  if (loading) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="history" />
        <main className="main-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Calculating your quiz results...</div>
        </main>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="history" />
        <main className="main-viewport">
          <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error || 'Results not found'}
            </div>
            <Link to="/dashboard" className="btn-navy">Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const isPassed = submission.passed;
  const answers = submission.answers || [];

  return (
    <div className="workspace-wrapper">
      <Sidebar activeTab="history" />

      <main className="main-viewport">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Link to="/dashboard" className="btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Quiz Library</span>
            </Link>
          </div>

          {/* Hero Result Banner */}
          <div
            className="theme-card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
              backgroundColor: isPassed ? '#f0fdf4' : '#fef2f2',
              borderColor: isPassed ? '#bbf7d0' : '#fecaca'
            }}
          >
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              {isPassed ? (
                <CheckCircle2 size={54} color="#16a34a" />
              ) : (
                <XCircle size={54} color="#dc2626" />
              )}
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {isPassed ? 'Congratulations! Quiz Passed' : 'Quiz Not Passed'}
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              {isPassed
                ? 'You met the required passing threshold for this assessment.'
                : 'You did not achieve the required passing score. Review the breakdown below to improve.'}
            </p>

            {/* Score Breakdown Cards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--card-border)', padding: '1rem 1.75rem', borderRadius: '10px', minWidth: '150px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal-primary)', marginTop: '0.2rem' }}>
                  {submission.totalScore} / {submission.maxScore}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--card-border)', padding: '1rem 1.75rem', borderRadius: '10px', minWidth: '150px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Percentage</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: isPassed ? '#16a34a' : '#dc2626', marginTop: '0.2rem' }}>
                  {submission.percentage}%
                </div>
              </div>

              {submission.timeSpentSeconds !== undefined && (
                <div style={{ background: '#ffffff', border: '1px solid var(--card-border)', padding: '1rem 1.75rem', borderRadius: '10px', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Time Spent</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {Math.floor(submission.timeSpentSeconds / 60)}m {submission.timeSpentSeconds % 60}s
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Detailed Question Review ({answers.length})
            </h2>

            {answers.map((ans, idx) => (
              <div
                key={idx}
                className="theme-card"
                style={{
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  borderLeft: `4px solid ${ans.isCorrect ? '#16a34a' : '#dc2626'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {idx + 1}. {ans.questionText || `Question ${idx + 1}`}
                  </h3>
                  <span className={`badge-pill ${ans.isCorrect ? 'badge-green' : 'badge-red'}`}>
                    {ans.isCorrect ? `+${ans.pointsAwarded || ans.maxPoints} pts` : `0 / ${ans.maxPoints} pts`}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Your Selected Answer:</span>
                    <strong style={{ color: ans.isCorrect ? '#16a34a' : '#dc2626' }}>
                      {ans.selectedOptionIndex !== null ? `Option ${ans.selectedOptionIndex + 1}` : 'Unanswered'}
                    </strong>
                    {ans.isCorrect ? (
                      <Check size={16} color="#16a34a" />
                    ) : (
                      <X size={16} color="#dc2626" />
                    )}
                  </div>

                  {!ans.isCorrect && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Correct Answer:</span>
                      <strong>Option {ans.correctOptionIndex + 1}</strong>
                    </div>
                  )}

                  {ans.explanation && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                      <em>Note: {ans.explanation}</em>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link to="/dashboard" className="btn-navy" style={{ padding: '0.75rem 2rem' }}>
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResult;
