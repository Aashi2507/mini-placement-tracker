import React, { useState } from 'react';
import { ArrowRight, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Login({ onLogin }) {
  const [users, setUsers] = useLocalStorage('auth_users', []);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState("What was your first pet's name?");
  const [answer, setAnswer] = useState('');
  
  const [foundUser, setFoundUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setFoundUser(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      onLogin({ name: user.name, email: user.email });
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('User with this email already exists.');
      return;
    }
    const newUser = { name, email, password, question, answer: answer.toLowerCase() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('auth_users', JSON.stringify(updatedUsers));
    onLogin({ name, email });
  };

  const handleForgotSearch = (e) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setFoundUser(user);
    } else {
      setError('No account found with that email.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (answer.toLowerCase() === foundUser.answer) {
       setUsers(users.map(u => u.email === foundUser.email ? { ...u, password: newPassword } : u));
       switchMode('login');
       setSuccess('Password reset successfully! Please login.');
       setPassword('');
       setAnswer('');
    } else {
       setError('Incorrect answer to security question.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-color)', width: '100vw' }}>
      <div className="glass-panel animate-slide-up" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="logo-circle" style={{ width: 64, height: 64, fontSize: '2rem' }}>P</div>
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Placement Hub</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>
          {mode === 'login' ? 'Sign in to access your dashboard.' : mode === 'register' ? 'Create a secure local account.' : 'Reset your password.'}
        </p>

        {error && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(217, 83, 79, 0.1)', padding: '0.8rem', borderRadius: '8px', borderLeft: '3px solid var(--danger)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}><AlertCircle size={16}/> {error}</div>}
        {success && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(58, 177, 121, 0.1)', padding: '0.8rem', borderRadius: '8px', borderLeft: '3px solid var(--success)', color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}><Lock size={16}/> {success}</div>}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" className="input-field" placeholder="john@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-pill" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>Login <ArrowRight size={18}/></button>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => switchMode('register')}>Create account</span>
              <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => switchMode('forgot')}>Forgot password?</span>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
              <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" className="input-field" placeholder="john@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" className="input-field" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={4} />
            </div>
            <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}><KeyRound size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Security Question</label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Used if you forget your password.</p>
              <select className="input-field" value={question} onChange={e => setQuestion(e.target.value)} style={{ marginBottom: '1rem' }}>
                <option>What was your first pet's name?</option>
                <option>What is your mother's maiden name?</option>
                <option>What city were you born in?</option>
              </select>
              <input type="text" className="input-field" placeholder="Your Answer" value={answer} onChange={e => setAnswer(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-pill" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>Register <ArrowRight size={18}/></button>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => switchMode('login')}>Already have an account? Login</span>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'left' }}>
            {!foundUser ? (
              <form onSubmit={handleForgotSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Account Email</label>
                  <input type="email" className="input-field" placeholder="Enter your registered email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-pill" style={{ padding: '0.8rem' }}>Find Account</button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Security Question</label>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 500 }}>{foundUser.question}</p>
                  <input type="text" className="input-field" placeholder="Answer" value={answer} onChange={e => setAnswer(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>New Password</label>
                  <input type="password" className="input-field" placeholder="Create new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={4} />
                </div>
                <button type="submit" className="btn btn-primary btn-pill" style={{ padding: '0.8rem' }}>Reset Password <Lock size={18}/></button>
              </form>
            )}
            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => switchMode('login')}>Back to Login</span>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
