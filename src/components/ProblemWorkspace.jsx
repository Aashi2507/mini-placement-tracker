import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Play, Pause, Save, CheckCircle } from 'lucide-react';

export default function ProblemWorkspace({ task, onClose, onSave }) {
  const [seconds, setSeconds] = useState(task.time_taken || 0);
  const [timerActive, setTimerActive] = useState(false);
  const [code, setCode] = useState(task.code || '');
  const [notes, setNotes] = useState(task.notes || '');

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${min.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleMarkSolved = () => {
    setTimerActive(false);
    onSave({
      ...task,
      code,
      notes,
      time_taken: seconds,
      status: 'Done',
      confidence: 'High' // default to high upon immediate solve, they can adjust later
    });
  };

  const handleSaveProgress = () => {
    onSave({
      ...task,
      code,
      notes,
      time_taken: seconds
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onClose} className="btn" style={{ padding: '0.5rem', background: 'var(--surface-color)' }}><ArrowLeft size={20}/></button>
          <div>
            <h2 style={{ fontSize: '1.5rem', lineHeight: 1.2 }}>{task.title}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)' }}>{task.platform}</span> • {task.category} • {task.difficulty}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {task.link && (
            <a href={task.link} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              <ExternalLink size={16}/> Open Problem
            </a>
          )}
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem' }}>
             <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(seconds)}</span>
             <button onClick={() => setTimerActive(!timerActive)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
               {timerActive ? <Pause size={18} color="var(--warning)"/> : <Play size={18} color="var(--success)"/>}
             </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Editor Area */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '65vh' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Solution Draft</h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write or paste your solution here..."
            style={{
              flex: 1, padding: '1.5rem', background: 'transparent', color: '#c9d1d9', border: 'none',
              fontFamily: 'monospace', fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: 1.5
            }}
            spellCheck="false"
          />
        </div>

        {/* Notes Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '65vh' }}>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Learnings & Mistakes</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What specifically tripped you up? What pattern did you use?"
              style={{
                flex: 1, padding: '1.5rem', background: 'transparent', color: 'var(--text-main)', border: 'none',
                fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: 1.5
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={handleSaveProgress} className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }}>
              <Save size={18}/> Save Progress
            </button>
            <button onClick={handleMarkSolved} className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: 'var(--success)', boxShadow: '0 0 15px rgba(58, 177, 121, 0.4)' }}>
              <CheckCircle size={18}/> Mark as Solved
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
