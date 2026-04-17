import React from 'react';
import { subDays, format, isSameDay } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ActivityHeatmap() {
  const [activityData] = useLocalStorage('activity_logs', []);
  
  // Generate last 60 days
  const today = new Date();
  const days = Array.from({ length: 60 }).map((_, i) => subDays(today, 59 - i));

  // Determine activity level (0-4) based on solved problems/actions
  const getLevel = (date) => {
    const record = activityData.find(d => isSameDay(new Date(d.date), date));
    if (!record || record.count === 0) return 0;
    if (record.count <= 2) return 1;
    if (record.count <= 5) return 2;
    if (record.count <= 8) return 3;
    return 4;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'var(--primary-glow)';
      case 2: return 'rgba(251, 125, 19, 0.5)';
      case 3: return 'rgba(251, 125, 19, 0.8)';
      case 4: return 'var(--primary)';
      default: return 'var(--surface-color)';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Activity Heatmap</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {days.map((day, idx) => {
          const level = getLevel(day);
          return (
            <div
              key={idx}
              title={`${format(day, 'MMM d, yyyy')}: ${level} activity`}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                backgroundColor: getLevelColor(level),
                border: level === 0 ? '1px solid var(--border-color)' : 'none',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Less</span>
        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: getLevelColor(0), border: '1px solid var(--border-color)' }} />
        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: getLevelColor(1) }} />
        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: getLevelColor(2) }} />
        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: getLevelColor(3) }} />
        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: getLevelColor(4) }} />
        <span>More</span>
      </div>
    </div>
  );
}
