import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import type { Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ subject: '', title: '', target: 1 });

  useEffect(() => {
    setGoals(storageService.getGoals());
  }, []);

  const addGoal = () => {
    if (!newGoal.subject || !newGoal.title) return;
    const goal: Goal = {
      id: uuidv4(),
      subject: newGoal.subject,
      title: newGoal.title,
      targetSessions: newGoal.target,
      completedSessions: 0,
      isCompleted: false
    };
    storageService.saveGoal(goal);
    setGoals([...goals, goal]);
    setNewGoal({ subject: '', title: '', target: 1 });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Study Goals</h1>
      
      <div className="bg-surface border border-border p-6 rounded-2xl mb-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input className="flex-1 bg-surface-hover border border-border p-3 rounded-lg" placeholder="Subject (e.g. Math)" value={newGoal.subject} onChange={e => setNewGoal({...newGoal, subject: e.target.value})} />
          <input className="flex-2 bg-surface-hover border border-border p-3 rounded-lg" placeholder="Goal (e.g. Chapter 4)" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
          <input type="number" min="1" className="w-24 bg-surface-hover border border-border p-3 rounded-lg" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value)})} />
          <button className="bg-primary hover:bg-primary-hover text-white px-6 rounded-lg font-medium" onClick={addGoal}>Add</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(g => (
          <div key={g.id} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-muted mb-1">{g.subject}</div>
            <h3 className="text-xl font-bold mb-4">{g.title}</h3>
            <div className="w-full bg-surface-hover rounded-full h-3 mb-2">
              <div className="bg-primary h-3 rounded-full" style={{ width: `${(g.completedSessions / g.targetSessions) * 100}%` }}></div>
            </div>
            <div className="text-sm text-right text-muted">{g.completedSessions} / {g.targetSessions} Sessions</div>
          </div>
        ))}
        {goals.length === 0 && <p className="text-muted">No goals created yet. Start setting targets!</p>}
      </div>
    </div>
  );
}
