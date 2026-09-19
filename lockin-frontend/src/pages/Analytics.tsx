import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export default function Analytics() {
  const [profile, setProfile] = useState(storageService.getProfile());

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border p-6 rounded-2xl text-center shadow-sm">
          <div className="text-muted mb-2">Total Focused Time</div>
          <div className="text-3xl font-bold text-primary">{Math.floor(profile.totalFocusedTime / 60)}h {profile.totalFocusedTime % 60}m</div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl text-center shadow-sm">
          <div className="text-muted mb-2">Focus Score</div>
          <div className="text-3xl font-bold text-blue-500">{profile.focusScore}</div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl text-center shadow-sm">
          <div className="text-muted mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-orange-500">{profile.currentStreak} 🔥</div>
        </div>
      </div>
      
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm text-center py-16 text-muted">
        Advanced charts and distraction patterns will render here using Recharts.
      </div>
    </div>
  );
}
