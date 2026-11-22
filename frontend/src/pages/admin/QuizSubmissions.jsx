import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Users, CheckCircle2, XCircle, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const QuizSubmissions = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsAndSubmissions = async () => {
      try {
        setLoading(true);
        const [analyticsRes, submissionsRes] = await Promise.all([
          api.get(`/quizzes/${id}/analytics`),
          api.get(`/quizzes/${id}/submissions`)
        ]);

        setData({
          analytics: analyticsRes.data.analytics,
          submissions: submissionsRes.data.submissions,
          quizTitle: submissionsRes.data.quizTitle
        });
      } catch (err) {
        setError('Failed to load submissions and analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsAndSubmissions();
  }, [id]);

  if (loading) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="quizzes" />
        <main className="main-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>Loading analytics and submissions...</div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="quizzes" />
        <main className="main-viewport">
          <Link to="/admin" className="btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            {error || 'Data not found'}
          </div>
        </main>
      </div>
    );
  }

  const { analytics, submissions, quizTitle } = data;

  return (
    <div className="workspace-wrapper">
      <Sidebar activeTab="quizzes" />

      <main className="main-viewport">
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/admin" className="btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Admin Panel</span>
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {quizTitle} — Performance Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Student submission records, scoring distributions, and pass rates.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="stats-summary-grid">
          <div className="stat-metric-card">
            <div>
              <div className="stat-metric-val">{analytics.totalSubmissions}</div>
              <div className="stat-metric-label">Total Submissions</div>
            </div>
            <div className="stat-icon-badge teal">
              <Users size={22} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div>
              <div className="stat-metric-val" style={{ color: analytics.passRate >= 60 ? '#16a34a' : '#dc2626' }}>
                {analytics.passRate}%
              </div>
              <div className="stat-metric-label">Passing Rate</div>
            </div>
            <div className="stat-icon-badge green">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div>
              <div className="stat-metric-val">{analytics.averageScore}%</div>
              <div className="stat-metric-label">Average Score</div>
            </div>
            <div className="stat-icon-badge amber">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="theme-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Student Submissions ({submissions.length})
          </h2>

          {submissions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>
              No students have attempted this quiz yet.
            </p>
          ) : (
            <div className="table-container-theme">
              <table className="theme-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Time Taken</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td style={{ fontWeight: 700 }}>{sub.studentId?.name || 'Unknown'}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{sub.studentId?.email || 'N/A'}</td>
                      <td>{sub.totalScore} / {sub.maxScore}</td>
                      <td style={{ fontWeight: 700 }}>{sub.percentage}%</td>
                      <td>
                        <span className={`badge-pill ${sub.passed ? 'badge-green' : 'badge-red'}`}>
                          {sub.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {sub.timeSpentSeconds ? `${Math.floor(sub.timeSpentSeconds / 60)}m ${sub.timeSpentSeconds % 60}s` : 'N/A'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizSubmissions;
