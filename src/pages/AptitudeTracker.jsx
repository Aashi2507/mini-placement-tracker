import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Play, Square, Save, AlertTriangle, TrendingUp, CheckCircle, Crosshair, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import clsx from 'clsx';
import { format, isToday } from 'date-fns';

const TOPICS = {
  'Quantitative': ['Time & Work', 'Profit & Loss', 'Ratios', 'Speed & Distance', 'Percentages'],
  'Logical': ['Puzzles', 'Coding-Decoding', 'Blood Relations', 'Syllogism', 'Series'],
  'Verbal': ['Reading Comp', 'Grammar', 'Vocab', 'Para Jumbles']
};

export default function AptitudeTracker() {
  const [logs, setLogs] = useLocalStorage('aptitude_logs', []);
  const [mistakes, setMistakes] = useLocalStorage('apt_mistakes', []);
  const [activeTab, setActiveTab] = useState('practice');

  // Timer State
  const [mainTopic, setMainTopic] = useState('Quantitative');
  const [subTopic, setSubTopic] = useState('Time & Work');
  const [targetMins, setTargetMins] = useState(15);
  const [targetQs, setTargetQs] = useState(10);
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLogging, setIsLogging] = useState(false);

  // Logging State
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);

  // Mistake State
  const [misTopic, setMisTopic] = useState('');
  const [misQ, setMisQ] = useState('');
  const [misExp, setMisExp] = useState('');

  // Daily Goal Logic
  const DAILY_GOAL = 20;
  const questionsToday = logs.filter(l => isToday(new Date(l.date))).reduce((acc, curr) => acc + curr.attempted, 0);

  useEffect(() => {
    let interval;
    if (isSessionActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isSessionActive && timeLeft === 0) {
      setIsSessionActive(false);
      setIsLogging(true);
      setAttempted(targetQs);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, timeLeft]);

  const startSession = () => {
    setTimeLeft(targetMins * 60);
    setIsSessionActive(true);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setIsLogging(true);
  };

  const saveLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      mainTopic,
      subTopic,
      attempted: Number(attempted),
      correct: Number(correct),
      timeTaken: (targetMins * 60) - timeLeft
    };
    setLogs([...logs, newLog]);
    setIsLogging(false);
    setAttempted(0); setCorrect(0);
  };

  const saveMistake = (e) => {
    e.preventDefault();
    if (!misTopic || !misQ) return;
    setMistakes([{ id: Date.now().toString(), topic: misTopic, question: misQ, explanation: misExp }, ...mistakes]);
    setMisTopic(''); setMisQ(''); setMisExp('');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Analytics Data
  const accuracyData = logs.map(l => ({
    date: format(new Date(l.date), 'MMM d'),
    accuracy: Math.round((l.correct / Math.max(l.attempted, 1)) * 100),
    topic: l.subTopic
  }));

  const topicAccuracy = logs.reduce((acc, l) => {
    if (!acc[l.subTopic]) acc[l.subTopic] = { att: 0, cor: 0 };
    acc[l.subTopic].att += l.attempted;
    acc[l.subTopic].cor += l.correct;
    return acc;
  }, {});

  const topicStats = Object.keys(topicAccuracy).map(t => ({
    topic: t,
    accuracy: Math.round((topicAccuracy[t].cor / Math.max(topicAccuracy[t].att, 1)) * 100)
  })).sort((a,b) => b.accuracy - a.accuracy);

  const strongTopics = topicStats.slice(0, 2);
  const weakTopics = topicStats.filter(t => t.accuracy < 60);

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Aptitude <span className="text-gradient-accent">Engine</span></h1>
        <p className="subtitle">Master time-constrained problem solving.</p>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab('practice')} className={clsx('btn', {'btn-primary': activeTab==='practice', 'btn-secondary': activeTab!=='practice'})}>Timed Practice</button>
        <button onClick={() => setActiveTab('analytics')} className={clsx('btn', {'btn-primary': activeTab==='analytics', 'btn-secondary': activeTab!=='analytics'})}>Performance Analysis</button>
        <button onClick={() => setActiveTab('mistakes')} className={clsx('btn', {'btn-primary': activeTab==='mistakes', 'btn-secondary': activeTab!=='mistakes'})}>Mistake Vault</button>
      </div>

      {/* TAB: PRACTICE */}
      {activeTab === 'practice' && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div className="glass-panel" style={{ flex: '1 1 500px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!isSessionActive && !isLogging ? (
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Configure Practice Session</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Main Category</label>
                    <select className="input-field" value={mainTopic} onChange={(e) => { setMainTopic(e.target.value); setSubTopic(TOPICS[e.target.value][0]); }}>
                      {Object.keys(TOPICS).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subtopic</label>
                    <select className="input-field" value={subTopic} onChange={(e) => setSubTopic(e.target.value)}>
                      {TOPICS[mainTopic].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Time (mins)</label>
                      <input type="number" className="input-field" value={targetMins} onChange={e => setTargetMins(e.target.value)} min={1} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Questions</label>
                      <input type="number" className="input-field" value={targetQs} onChange={e => setTargetQs(e.target.value)} min={1} />
                    </div>
                  </div>
                  <button onClick={startSession} className="btn btn-primary btn-pill" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                     <Play size={20}/> Start Stopwatch
                  </button>
                </div>
              </div>
            ) : isSessionActive ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{subTopic} Focus Session</h2>
                <div style={{ fontSize: '5rem', fontWeight: 800, color: timeLeft < 60 ? 'var(--danger)' : 'var(--primary)', fontFamily: 'monospace', lineHeight: 1, marginBottom: '2rem' }}>
                  {formatTime(timeLeft)}
                </div>
                <button onClick={endSession} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  <Square size={18}/> Conclude Early
                </button>
              </div>
            ) : (
               <form onSubmit={saveLog} style={{ width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Log Your Session</h3>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Time taken: {formatTime((targetMins*60)-timeLeft)}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Questions Attempted</label>
                    <input type="number" className="input-field" value={attempted} onChange={e => setAttempted(e.target.value)} required min={1} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Questions Correct</label>
                    <input type="number" className="input-field" value={correct} onChange={e => setCorrect(e.target.value)} required min={0} max={attempted} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                    <Save size={18} /> Save & View Accuracy
                  </button>
                </div>
               </form>
            )}
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Daily Goal Tracker */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Target size={40} color="var(--primary)"/></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Daily Aptitude Quota</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{questionsToday} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {DAILY_GOAL}</span></div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                 <div style={{ width: `${Math.min((questionsToday/DAILY_GOAL)*100, 100)}%`, height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
               <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><TrendingUp size={18} color="var(--primary)"/> Recent Sessions</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {logs.slice(-4).reverse().map((l, i) => {
                    const acc = Math.round((l.correct / Math.max(l.attempted, 1))*100);
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                         <div>
                           <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.subTopic}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.attempted} Attempted</div>
                         </div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 800, color: acc >= 80 ? 'var(--success)' : acc < 50 ? 'var(--danger)' : 'var(--warning)' }}>{acc}%</div>
                      </div>
                    )
                 })}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ flex: '2 1 600px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Accuracy Over Time</h3>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="accuracy" stroke="var(--primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--primary)'}} />
                  <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', borderColor: 'var(--border-color)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(18, 183, 106, 0.05)', border: '1px solid rgba(18, 183, 106, 0.2)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle color="var(--success)" size={18}/> Strong Areas</h3>
              {strongTopics.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{t.topic}</span><strong style={{ color: 'var(--success)' }}>{t.accuracy}%</strong>
                </div>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(240, 68, 56, 0.05)', border: '1px solid rgba(240, 68, 56, 0.2)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle color="var(--danger)" size={18}/> Weak Areas</h3>
               {weakTopics.length > 0 ? weakTopics.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{t.topic}</span><strong style={{ color: 'var(--danger)' }}>{t.accuracy}%</strong>
                </div>
              )) : <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>No major weak areas detected yet!</span>}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MISTAKE VAULT */}
      {activeTab === 'mistakes' && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Crosshair size={20} color="var(--danger)"/> Log Mistake</h3>
            <form onSubmit={saveMistake} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
               <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Topic Concept</label>
                  <input type="text" className="input-field" value={misTopic} onChange={e => setMisTopic(e.target.value)} placeholder="e.g. Syllogism Rule 2" required/>
               </div>
               <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The Question Snippet</label>
                  <textarea className="input-field" value={misQ} onChange={e => setMisQ(e.target.value)} required rows={3}/>
               </div>
               <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The Core Explanation</label>
                  <textarea className="input-field" value={misExp} onChange={e => setMisExp(e.target.value)} required rows={4} placeholder="Why did I fail this logic?"/>
               </div>
               <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem' }}><Save size={18}/> Store in Vault</button>
            </form>
          </div>

          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mistakes.map((m) => (
              <div key={m.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
                <span className="badge" style={{ background: 'rgba(240,68,56,0.1)', color: 'var(--danger)', marginBottom: '1rem' }}>{m.topic}</span>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>"{m.question}"</p>
                <div style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Crucial Takeaway:</strong> {m.explanation}
                </div>
              </div>
            ))}
            {mistakes.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Your vault is empty.</div>}
          </div>
        </div>
      )}

    </div>
  );
}
