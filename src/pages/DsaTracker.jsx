import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProblemWorkspace from '../components/ProblemWorkspace';
import { Search, Plus, Play, ExternalLink } from 'lucide-react';
import { format, addDays } from 'date-fns';
import clsx from 'clsx';

const CATEGORIES = ['All', 'Array', 'String', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming'];

export default function DsaTracker() {
  const [dsaTopics, setDsaTopics] = useLocalStorage('dsa_topics', []);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Array', platform: 'LeetCode', difficulty: 'Medium', link: '' });

  const filteredTopics = dsaTopics.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateTask = (updatedTask) => {
    setDsaTopics(topics => topics.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task = {
      ...newTask,
      id: Date.now().toString(),
      status: 'Not Started',
      confidence: '-',
      time_taken: 0,
      code: '',
      notes: ''
    };
    setDsaTopics([task, ...dsaTopics]);
    setIsAddMode(false);
    setNewTask({ title: '', category: 'Array', platform: 'LeetCode', difficulty: 'Medium', link: '' });
  };

  if (activeTaskId) {
    const activeTask = dsaTopics.find(t => t.id === activeTaskId);
    return <ProblemWorkspace task={activeTask} onClose={() => setActiveTaskId(null)} onSave={(t) => { handleUpdateTask(t); setActiveTaskId(null); }} />;
  }

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>DSA Tracker</h1>
          <p style={{ color: 'var(--text-muted)' }}>Master your data structures with an interactive workflow.</p>
        </div>
        <button onClick={() => setIsAddMode(true)} className="btn btn-primary"><Plus size={18}/> Add Problem</button>
      </header>

      {isAddMode && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
               <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Problem Title</label>
               <input type="text" className="input-field" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} autoFocus required/>
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label>
               <select className="input-field" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                 {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
               </select>
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty</label>
               <select className="input-field" value={newTask.difficulty} onChange={e => setNewTask({...newTask, difficulty: e.target.value})}>
                 <option>Easy</option><option>Medium</option><option>Hard</option>
               </select>
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform</label>
               <select className="input-field" value={newTask.platform} onChange={e => setNewTask({...newTask, platform: e.target.value})}>
                 <option>LeetCode</option><option>GFG</option><option>HackerRank</option><option>Other</option>
               </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button type="submit" className="btn btn-primary" style={{flex:1}}>Add</button>
               <button type="button" className="btn btn-secondary" onClick={() => setIsAddMode(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="input-field" 
            style={{ paddingLeft: '2.8rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={clsx('btn btn-secondary', { 'btn-primary': activeCategory === cat })}
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>Problem</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>Difficulty</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTopics.map((topic) => (
              <tr key={topic.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem 1.2rem', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     {topic.title}
                     {topic.link && <a href={topic.link} target="_blank" rel="noreferrer" style={{color:'var(--primary)'}}><ExternalLink size={14}/></a>}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.2rem' }}>
                  <span className="badge">
                    {topic.category}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.2rem' }}>
                  <select 
                    value={topic.status}
                    onChange={(e) => handleUpdateTask({...topic, status: e.target.value})}
                    style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td style={{ padding: '1rem 1.2rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: topic.difficulty === 'Hard' ? 'var(--danger)' : topic.difficulty === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                    {topic.difficulty || 'Medium'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                  <button onClick={() => setActiveTaskId(topic.id)} className="btn" style={{ background: 'rgba(108, 90, 221, 0.15)', color: 'var(--primary)', padding: '0.5rem 1rem' }}>
                    <Play size={14} style={{ marginRight: '0.3rem' }}/> Solve Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTopics.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No problems found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
