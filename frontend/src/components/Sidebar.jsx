import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Home,
  BookOpen,
  History,
  Award
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (isAdmin) {
    const adminItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { id: 'quizzes', label: 'Quizzes', icon: FileText, path: '/admin' },
      { id: 'users', label: 'Users', icon: Users, path: '/admin' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/admin' }
    ];

    return (
      <aside className="app-sidebar">
        <nav className="sidebar-nav">
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab ? activeTab === item.id : (item.id === 'dashboard' && location.pathname === '/admin');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`sidebar-link ${isTabActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Student Navigation
  const studentItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'library', label: 'Library', icon: BookOpen, path: '/dashboard' },
    { id: 'history', label: 'History', icon: History, path: '/dashboard' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award, path: '/dashboard' }
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {studentItems.map((item) => {
          const Icon = item.icon;
          const isTabActive = activeTab ? activeTab === item.id : (item.id === 'home' || item.id === 'library');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`sidebar-link ${isTabActive ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
