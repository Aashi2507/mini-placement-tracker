import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Building, MoreVertical } from 'lucide-react';

const COLUMNS = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

export default function KanbanBoard() {
  const [companies, setCompanies] = useLocalStorage('companies', [
    { id: '1', name: 'Google', role: 'Software Engineer', stage: 'Interviewing' },
    { id: '2', name: 'Microsoft', role: 'Frontend Developer', stage: 'Applied' },
    { id: '3', name: 'Amazon', role: 'SDE L4', stage: 'Wishlist' },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', role: '', stage: 'Wishlist' });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setCompanies(prev => prev.map(c => 
        c.id === draggableId ? { ...c, stage: destination.droppableId } : c
      ));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCompany.name) return;
    setCompanies([...companies, { ...newCompany, id: Date.now().toString() }]);
    setNewCompany({ name: '', role: '', stage: 'Wishlist' });
    setIsAddOpen(false);
  };

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Company Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your applications from wishlist to offer.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Add Application
        </button>
      </header>

      {isAddOpen && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--surface-color)' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Company Name</label>
              <input type="text" className="input-field" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} placeholder="e.g. Meta" autoFocus />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Role</label>
              <input type="text" className="input-field" value={newCompany.role} onChange={e => setNewCompany({ ...newCompany, role: e.target.value })} placeholder="e.g. SDE Intern" />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Stage</label>
              <select className="input-field" value={newCompany.stage} onChange={e => setNewCompany({ ...newCompany, stage: e.target.value })}>
                {COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board" style={{ flex: 1 }}>
          {COLUMNS.map(col => {
            const colCompanies = companies.filter(c => c.stage === col);
            return (
              <div key={col} className="kanban-column glass-panel" style={{ background: 'var(--surface-color)' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{col}</h3>
                  <span style={{ background: 'var(--surface-hover)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {colCompanies.length}
                  </span>
                </div>
                
                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      style={{ 
                        padding: '1rem', 
                        minHeight: '200px', 
                        flex: 1, 
                        background: snapshot.isDraggingOver ? 'var(--surface-hover)' : 'transparent',
                        transition: 'background 0.2s',
                        borderRadius: '0 0 16px 16px'
                      }}
                    >
                      {colCompanies.map((company, index) => (
                        <Draggable key={company.id} draggableId={company.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                background: 'var(--bg-color)',
                                border: '1px solid var(--border-color)',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '0.8rem',
                                boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Building size={16} color="var(--primary)" />
                                  <strong style={{ fontSize: '1.05rem' }}>{company.name}</strong>
                                </div>
                                <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                              </div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{company.role || 'Unspecified Role'}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
