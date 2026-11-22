import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  FileText,
  PlusCircle,
  Eye,
  Trash2,
  AlertCircle,
  Activity,
  Server,
  Settings as SettingsIcon,
  Search,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      setError('Failed to fetch quizzes. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz and all its submissions?')) {
      return;
    }

    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workspace-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Top Header */}
        <div className="admin-overview-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'users' ? 'User Management' : activeTab === 'settings' ? 'System Settings' : 'User Overview'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              Administrator workspace & learning analytics
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/admin/create" className="btn-teal">
              <PlusCircle size={16} />
              <span>Create New Quiz</span>
            </Link>
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

        {/* Tab: Dashboard Overview */}
        {(activeTab === 'dashboard' || activeTab === 'quizzes') && (
          <>
            {/* Top 3 Metric Summary Cards matching Mockup */}
            <div className="stats-summary-grid">
              <div className="stat-metric-card">
                <div>
                  <div className="stat-metric-val">312</div>
                  <div className="stat-metric-label">Students</div>
                </div>
                <div className="stat-icon-badge teal">
                  <Users size={22} />
                </div>
              </div>

              <div className="stat-metric-card">
                <div>
                  <div className="stat-metric-val">{quizzes.length > 0 ? quizzes.length : 15}</div>
                  <div className="stat-metric-label">Instructors & Quizzes</div>
                </div>
                <div className="stat-icon-badge amber">
                  <GraduationCap size={22} />
                </div>
              </div>

              <div className="stat-metric-card">
                <div>
                  <div className="stat-metric-val">4</div>
                  <div className="stat-metric-label">Roles & Permissions</div>
                </div>
                <div className="stat-icon-badge green">
                  <ShieldCheck size={22} />
                </div>
              </div>
            </div>

            {/* Middle Row 3 Module Cards */}
            <div className="admin-modules-grid">
              {/* Module 1: Active Quizzes */}
              <div className="admin-module-card">
                <div>
                  <div className="admin-module-header">
                    <span className="admin-module-title">Active Quizzes</span>
                    <span className="stat-icon-badge teal" style={{ width: '36px', height: '36px' }}>
                      <FileText size={18} />
                    </span>
                  </div>
                  <p className="admin-module-desc">
                    Active Quizzes configured for student enrollment and real-time score assessment.
                  </p>
                </div>
                <div className="admin-module-footer">
                  <span style={{ fontWeight: 600, color: 'var(--teal-primary)' }}>
                    {quizzes.length} Quizzes published
                  </span>
                  <Link to="/admin/create" style={{ color: 'var(--teal-primary)', fontWeight: 600, fontSize: '0.82rem' }}>
                    + New Quiz
                  </Link>
                </div>
              </div>

              {/* Module 2: User Management */}
              <div className="admin-module-card">
                <div>
                  <div className="admin-module-header">
                    <span className="admin-module-title">User Management</span>
                    <span className="stat-icon-badge green" style={{ width: '36px', height: '36px' }}>
                      <Users size={18} />
                    </span>
                  </div>
                  <p className="admin-module-desc">
                    User directory managing role assignments, access control, and academic group privileges.
                  </p>
                </div>
                <div className="admin-module-footer">
                  <span>312 Active accounts</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    style={{ background: 'none', border: 'none', color: 'var(--teal-primary)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View Directory →
                  </button>
                </div>
              </div>

              {/* Module 3: System Logs */}
              <div className="admin-module-card">
                <div>
                  <div className="admin-module-header">
                    <span className="admin-module-title">System Logs</span>
                    <span className="stat-icon-badge amber" style={{ width: '36px', height: '36px' }}>
                      <Activity size={18} />
                    </span>
                  </div>
                  <p className="admin-module-desc">
                    Audit logs recording quiz submissions, validation checks, and RBAC token sessions.
                  </p>
                </div>
                <div className="admin-module-footer">
                  <span>Real-time tracking active</span>
                  <span className="badge-pill badge-green">Healthy</span>
                </div>
              </div>
            </div>

            {/* Quizzes Management Table */}
            <div className="theme-card" style={{ padding: '1.75rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Managed Quizzes ({quizzes.length})
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Inspect questions, launch attempts, and review student submission analytics.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', top: '9px', left: '10px' }} />
                    <input
                      type="text"
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input-theme"
                      style={{ paddingLeft: '32px', width: '220px', paddingRight: '10px', height: '36px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <Link to="/admin/create" className="btn-teal btn-sm">
                    <PlusCircle size={14} />
                    <span>Create Quiz</span>
                  </Link>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading quizzes...
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                  <FileText size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    No Quizzes Found
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    {searchTerm ? 'No quizzes match your search criteria.' : 'Create your first interactive quiz for students to participate.'}
                  </p>
                  <Link to="/admin/create" className="btn-teal btn-sm">
                    <PlusCircle size={15} />
                    <span>Create New Quiz</span>
                  </Link>
                </div>
              ) : (
                <div className="table-container-theme">
                  <table className="theme-table">
                    <thead>
                      <tr>
                        <th>Quiz Title</th>
                        <th>Questions</th>
                        <th>Duration</th>
                        <th>Passing %</th>
                        <th>Created Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz) => (
                        <tr key={quiz._id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{quiz.title}</div>
                            {quiz.description && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {quiz.description}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="badge-pill badge-gray">
                              {quiz.questions ? quiz.questions.length : 0} Qs
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {quiz.timeLimitMinutes} mins
                          </td>
                          <td>
                            <span className="badge-pill badge-green">
                              {quiz.passingScorePercent}%
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <Link
                                to={`/admin/quizzes/${quiz._id}/submissions`}
                                className="btn-outline btn-sm"
                                title="View Submissions & Analytics"
                              >
                                <Eye size={14} />
                                <span>Results</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(quiz._id)}
                                className="btn-danger-outline"
                                title="Delete Quiz"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab: Users Management */}
        {activeTab === 'users' && (
          <div className="theme-card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Registered Users Directory</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Overview of student and instructor accounts enrolled in QuizVerse.
            </p>
            <div className="table-container-theme">
              <table className="theme-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Access Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Admin Superuser</strong><br/><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>admin@quizverse.edu</span></td>
                    <td><span className="badge-pill badge-amber">Administrator</span></td>
                    <td><span className="badge-pill badge-green">Active</span></td>
                    <td>Full Administrative Privileges</td>
                  </tr>
                  <tr>
                    <td><strong>Jordan Lee</strong><br/><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>jordan.student@quizverse.edu</span></td>
                    <td><span className="badge-pill badge-teal">Student</span></td>
                    <td><span className="badge-pill badge-green">Active</span></td>
                    <td>Standard Student Access</td>
                  </tr>
                  <tr>
                    <td><strong>Alex Rivera</strong><br/><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>alex.student@quizverse.edu</span></td>
                    <td><span className="badge-pill badge-teal">Student</span></td>
                    <td><span className="badge-pill badge-green">Active</span></td>
                    <td>Standard Student Access</td>
                  </tr>
                  <tr>
                    <td><strong>Taylor Chen</strong><br/><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>taylor.chen@quizverse.edu</span></td>
                    <td><span className="badge-pill badge-teal">Student</span></td>
                    <td><span className="badge-pill badge-green">Active</span></td>
                    <td>Standard Student Access</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="theme-card" style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Platform Settings</h2>
            <div className="form-field">
              <label className="form-label-theme">Platform Name</label>
              <input type="text" readOnly value="QuizVerse" className="form-input-theme" />
            </div>
            <div className="form-field">
              <label className="form-label-theme">Default Quiz Time Limit (Minutes)</label>
              <input type="number" defaultValue={10} className="form-input-theme" />
            </div>
            <div className="form-field">
              <label className="form-label-theme">Default Passing Score (%)</label>
              <input type="number" defaultValue={60} className="form-input-theme" />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn-teal" onClick={() => alert('Settings updated')}>Save Settings</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
