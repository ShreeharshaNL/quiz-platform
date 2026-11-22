import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Shield, GraduationCap } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-viewport" style={{ maxWidth: '480px', marginTop: '1rem' }}>
      <div className="theme-card" style={{ padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 0.75rem auto', width: '42px', height: '42px' }}>
            Q
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Join QuizVerse
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Create an account to start taking or creating quizzes
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection Tabs */}
          <div className="form-field">
            <label className="form-label-theme">Select Account Type:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => handleRoleSelect('student')}
                style={{
                  border: `2px solid ${formData.role === 'student' ? 'var(--teal-primary)' : 'var(--card-border)'}`,
                  background: formData.role === 'student' ? '#f0fdfa' : '#ffffff',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <GraduationCap
                  size={24}
                  color={formData.role === 'student' ? 'var(--teal-primary)' : '#64748b'}
                  style={{ margin: '0 auto 0.3rem auto' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'student' ? 'var(--teal-primary)' : 'var(--text-primary)' }}>
                  Student
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Take Quizzes</div>
              </div>

              <div
                onClick={() => handleRoleSelect('admin')}
                style={{
                  border: `2px solid ${formData.role === 'admin' ? 'var(--teal-primary)' : 'var(--card-border)'}`,
                  background: formData.role === 'admin' ? '#f0fdfa' : '#ffffff',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <Shield
                  size={24}
                  color={formData.role === 'admin' ? 'var(--teal-primary)' : '#64748b'}
                  style={{ margin: '0 auto 0.3rem auto' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'admin' ? 'var(--teal-primary)' : 'var(--text-primary)' }}>
                  Instructor / Admin
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Create & Analyze</div>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label-theme" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="form-input-theme"
              placeholder="e.g. Jordan Smith"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label-theme" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="form-input-theme"
              placeholder="e.g. jordan@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label-theme" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={6}
              className="form-input-theme"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-teal"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            <UserPlus size={16} />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--teal-primary)', fontWeight: 700 }}>
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
