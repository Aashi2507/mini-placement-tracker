import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DsaTracker from './pages/DsaTracker';
import KanbanBoard from './pages/KanbanBoard';
import StudyTools from './pages/StudyTools';
import AptitudeTracker from './pages/AptitudeTracker';
import Login from './pages/Login';
import { DSA_TOPICS_DUMMY, COMPANIES_DUMMY, generateHeatmapLogs, APTITUDE_LOGS_DUMMY, APTITUDE_MISTAKES_DUMMY } from './data/dummyData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Hexagon } from 'lucide-react';

const TopNav = ({ user, logout }) => {
  return (
    <nav className="top-nav">
      <div className="top-logo">
        <Hexagon size={32} color="var(--primary)" fill="rgba(251, 125, 19, 0.2)" strokeWidth={2} />
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Placement Tracker</h2>
        </div>
      </div>
      <div className="nav-links">
        <NavLink to="/dsa" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>DSA Tracker</NavLink>
        <NavLink to="/aptitude" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Aptitude</NavLink>
        <NavLink to="/kanban" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pipelines</NavLink>
        <NavLink to="/tools" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Study Tools</NavLink>
        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 1rem' }}></div>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{user?.name}</span>
        <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Logout</button>
        <NavLink to="/" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', marginLeft: '0.5rem' }}>Dashboard</NavLink>
      </div>
    </nav>
  );
};

function App() {
  const [session, setSession] = useLocalStorage('user_session', null);

  useEffect(() => {
    if (!localStorage.getItem('is_seeded')) {
      localStorage.setItem('dsa_topics', JSON.stringify(DSA_TOPICS_DUMMY));
      localStorage.setItem('companies', JSON.stringify(COMPANIES_DUMMY));
      localStorage.setItem('activity_logs', JSON.stringify(generateHeatmapLogs()));
      localStorage.setItem('goals', JSON.stringify({ streak: 21, maxStreak: 35 }));
      localStorage.setItem('is_seeded', 'true');
    }
    if (!localStorage.getItem('apt_seeded')) {
      localStorage.setItem('aptitude_logs', JSON.stringify(APTITUDE_LOGS_DUMMY));
      localStorage.setItem('apt_mistakes', JSON.stringify(APTITUDE_MISTAKES_DUMMY));
      localStorage.setItem('apt_seeded', 'true');
    }
  }, []);

  if (!session) {
    return <Login onLogin={(user) => setSession(user)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <TopNav user={session} logout={() => setSession(null)} />
        <main className="content-area animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dsa" element={<DsaTracker />} />
            <Route path="/aptitude" element={<AptitudeTracker />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/tools" element={<StudyTools />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
