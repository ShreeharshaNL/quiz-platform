import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, User, LogOut, Shield, Award, Sparkles, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  // Determine role/section subtitle based on current route
  const getRoleSubtitle = () => {
    if (location.pathname.startsWith('/admin/create')) {
      return 'Role: Instructor/Admin';
    }
    if (location.pathname.startsWith('/admin')) {
      return 'Admin Panel';
    }
    if (location.pathname.startsWith('/quiz') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/results')) {
      return 'Student Portal';
    }
    return null;
  };

  const roleSubtitle = getRoleSubtitle();

  // Avatar initial
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="top-navbar">
      {/* Brand & Subtitle */}
      <div className="top-nav-left">
        <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="brand-logo-link">
          <div className="brand-icon-box">Q</div>
          <span className="brand-text">QuizVerse</span>
        </Link>

        {roleSubtitle && (
          <div className="nav-role-badge">
            <span>{roleSubtitle}</span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="top-nav-right">
        {isAuthenticated && !isAdmin && (
          <div className="streak-pill">
            <span>★</span>
            <span>Student rank</span>
          </div>
        )}

        {/* Notifications Icon with dot */}
        <button
          type="button"
          className="icon-bell-btn"
          title="Notifications"
          onClick={() => alert('No new notifications')}
        >
          <Bell size={18} />
          <span className="bell-dot" />
        </button>

        {/* User Session */}
        {isAuthenticated ? (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              className="user-avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="avatar-circle">{avatarLetter}</div>
              <ChevronDown size={14} color="#cbd5e1" />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-name">{user?.name || 'User'}</div>
                  <div className="profile-dropdown-email">{user?.email || ''}</div>
                  <div style={{ marginTop: '0.4rem' }}>
                    <span className={`badge-pill ${isAdmin ? 'badge-amber' : 'badge-teal'}`}>
                      {isAdmin ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>

                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="profile-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  {isAdmin ? <Shield size={16} /> : <BookOpen size={16} />}
                  <span>{isAdmin ? 'Admin Dashboard' : 'Student Library'}</span>
                </Link>

                <button
                  type="button"
                  className="profile-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/login"
              style={{
                color: '#cbd5e1',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '0.4rem 0.85rem'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-teal btn-sm"
              style={{ borderRadius: '6px' }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
