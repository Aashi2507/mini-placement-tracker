import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { PlayCircle, AlertCircle, BookOpen, CheckCircle, Shield, Lock, Circle, ArrowRight, Code } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const RESOURCE_MAP = {
  'Array': { title: 'NeetCode: Advanced Arrays', url: 'https://youtube.com' },
  'String': { title: 'NeetCode: Sliding Window', url: 'https://youtube.com' },
  'Linked List': { title: 'Striver: Pointers Deep Dive', url: 'https://youtube.com' },
  'Trees': { title: 'NeetCode: Tree Traversals', url: 'https://youtube.com' },
  'Graphs': { title: 'WilliamFiset: Graph Theory', url: 'https://youtube.com' },
  'Dynamic Programming': { title: 'Striver: DP Mastery Playlist', url: 'https://youtube.com' }
};

const CATEGORIES = ['Array', 'String', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming'];
const PIE_COLORS = ['#fb7d13', '#8a4fff', '#12b76a', '#f79009'];

export default function Dashboard() {
  const [dsaTopics] = useLocalStorage('dsa_topics', []);
  const [companies] = useLocalStorage('companies', []);
  const [session] = useLocalStorage('user_session', { name: '' });

  const activeCompanies = companies.filter(c => c.stage !== 'Rejected').slice(0, 3);
  const cardsToRender = activeCompanies.map((c, i) => ({ type: 'INTERVIEW', title: `${c.name} - ${c.stage}`, date: 'Upcoming', time: '--', loc: c.role, registered: 'Pipeline status', id: i }));

  const weakTopics = dsaTopics.filter(t => t.confidence === 'Low' || t.status === 'In Progress');
  const weakCategories = [...new Set(weakTopics.map(t => t.category))].slice(0, 3);
  const smartResources = weakCategories.map(cat => ({ category: cat, ...RESOURCE_MAP[cat] }));

  const graphData = CATEGORIES.map(cat => ({
    name: cat,
    solved: dsaTopics.filter(t => t.category === cat && t.status === 'Done').length,
    remaining: dsaTopics.filter(t => t.category === cat && t.status !== 'Done').length
  })).filter(d => d.solved > 0 || d.remaining > 0);

  const platforms = [...new Set(dsaTopics.map(t => t.platform))].filter(Boolean);
  const platformData = platforms.map(p => ({
    name: p,
    value: dsaTopics.filter(t => t.platform === p).length
  })).filter(p => p.value > 0);

  const completedCount = dsaTopics.filter(t => t.status === 'Done').length;
  const completionPercentage = dsaTopics.length ? Math.round((completedCount / dsaTopics.length) * 100) : 0;

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      
      {/* Hero Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap', gap: '5rem' }}>
        <div style={{ flex: '1 1 500px', paddingBottom: '3rem' }}>
          <div className="badge-pill">
            <Shield size={14} /> SECURED LOCAL TRACKING
          </div>
          <h1>
            Your placement,<br/>
            <span className="text-gradient-accent">secured</span> in the<br/>
            tracker.
          </h1>
          <p className="subtitle" style={{ maxWidth: '85%', marginBottom: '2.5rem', fontSize: '1.2rem' }}>
            Experience lightning-fast problem logging and smart pipeline management with Placement Tracker. Secure, reliable, and accessible entirely offline.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dsa" className="btn btn-primary" style={{ padding: '1rem 1.5rem', fontSize: '1.05rem', borderRadius: '12px' }}>
              Start Tracking Free <ArrowRight size={18}/>
            </Link>
            <Link to="/kanban" className="btn btn-secondary" style={{ padding: '1rem 1.5rem', fontSize: '1.05rem', borderRadius: '12px' }}>
              Company Pipelines
            </Link>
          </div>
        </div>

        {/* Abstract Graphic */}
        <div style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', maxWidth: '500px', height: '350px', 
            background: 'var(--surface-color)', 
            borderRadius: '24px', border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.02)', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4 }} viewBox="0 0 500 350">
              <path d="M100 150 L400 80 L380 280 L140 250 Z" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>
            <Circle size={20} fill="var(--primary)" color="transparent" style={{ position: 'absolute', top: '140px', left: '90px', opacity: 0.6 }} />
            <Circle size={24} fill="#c4a5ff" color="transparent" style={{ position: 'absolute', top: '70px', right: '90px', opacity: 0.8 }} />
            <Circle size={28} fill="var(--primary)" color="transparent" style={{ position: 'absolute', bottom: '90px', left: '125px', opacity: 0.4 }} />
            <Circle size={16} fill="#c4a5ff" color="transparent" style={{ position: 'absolute', bottom: '60px', right: '110px', opacity: 0.9 }} />

            <div style={{ 
              width: '120px', height: '120px', borderRadius: '24px', 
              border: '1px solid #e9d5ff', background: '#faf5ff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(138, 79, 255, 0.05)', zIndex: 2
            }}>
               <Lock size={36} color="var(--secondary)" strokeWidth={2.5} style={{ marginBottom: '0.5rem' }}/>
               <div style={{ width: '40px', height: '3px', background: 'var(--secondary)', borderRadius: '2px', opacity: 0.5 }}></div>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4rem 0' }} />

      {/* Analytics Row: Progression Chart & Platform Spread */}
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        
        {/* Left: Recharts Progress Graph */}
        <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Topic Progression</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Comparing solved volume vs pending catalog.</span>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  itemStyle={{ fontSize: '0.9rem', color: 'var(--text-main)' }}
                />
                <Bar dataKey="solved" stackId="a" fill="var(--success)" radius={[0, 0, 4, 4]} name="Solved" />
                <Bar dataKey="remaining" stackId="a" fill="var(--border-color)" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center: Platform Pie Chart Stats */}
        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Platform Spread</h2>
            <Code size={20} color="var(--primary)" />
          </div>
          <div style={{ width: '100%', height: '200px' }}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={platformData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {platformData.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                  {p.name}
                </span>
                <span style={{ fontWeight: 600 }}>{p.value} problems</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weakness Targeted Resources */}
        <div style={{ flex: '1 1 300px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={20} color="var(--warning)"/> Targeted Study</h2>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Struggling with <strong style={{ color: 'var(--text-main)' }}>{weakCategories.join(', ') || 'these topics'}</strong>? Watch these to shore up your skills:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {smartResources.length > 0 ? smartResources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fafafa', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '3px solid var(--primary)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'} onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}>
                    <PlayCircle size={24} color="var(--primary)" />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{res.title}</h4>
                    </div>
                  </div>
                </a>
              )) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                  <CheckCircle color="var(--success)" size={32} style={{ marginBottom: '1rem' }}/>
                  <p>No weak areas detected!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
