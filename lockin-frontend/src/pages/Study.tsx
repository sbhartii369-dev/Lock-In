import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';
import { StudySession } from '../types';
import { AlertTriangle } from 'lucide-react';

export default function Study() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State
  const [phase, setPhase] = useState<'setup' | 'committed' | 'active'>('setup');
  const [form, setForm] = useState({ 
    subject: '', 
    goal: '', 
    duration: 50, 
    technique: searchParams.get('technique') || 'Deep Focus' 
  });
  const [session, setSession] = useState<StudySession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [interrupted, setInterrupted] = useState(false);

  // Restore active session on mount
  useEffect(() => {
    const active = storageService.getActiveSession();
    if (active) {
      const now = Date.now();
      const elapsed = Math.floor((now - active.startTime) / 1000);
      const remaining = (active.duration * 60) - elapsed;
      
      if (remaining > 0) {
        setSession(active);
        setTimeLeft(remaining);
        setPhase('active');
        setForm({ subject: active.subject, goal: active.goal, duration: active.duration, technique: active.technique });
      } else {
        // Session ended while away
        active.status = 'completed';
        storageService.saveSession(active);
        storageService.setActiveSession(null);
        navigate('/break', { state: { sessionId: active.id } });
      }
    }
  }, [navigate]);

  // Timer & Visibility Tracking
  useEffect(() => {
    let timer: number;
    
    if (phase === 'active' && session) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setInterrupted(true);
          const updated = { ...session, tabSwitches: session.tabSwitches + 1 };
          setSession(updated);
          storageService.setActiveSession(updated);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [phase, session]);

  const startSession = () => {
    const newSession: StudySession = {
      id: uuidv4(),
      subject: form.subject,
      goal: form.goal,
      duration: form.duration,
      technique: form.technique,
      status: 'in_progress',
      startTime: Date.now(),
      tabSwitches: 0,
      timeAway: 0,
      distractions: []
    };
    storageService.setActiveSession(newSession);
    setSession(newSession);
    setTimeLeft(form.duration * 60);
    setPhase('active');
    setInterrupted(false);
  };

  const completeSession = () => {
    if (session) {
      session.status = 'completed';
      session.endTime = Date.now();
      storageService.saveSession(session);
      storageService.setActiveSession(null);
      
      // Update user profile stats
      const profile = storageService.getProfile();
      profile.totalFocusedTime += session.duration;
      profile.focusScore += 5; // Simplified scoring
      storageService.saveProfile(profile);

      navigate('/break', { state: { sessionId: session.id } });
    }
  };

  const endSessionEarly = () => {
    if (window.confirm("Are you sure you want to end your session? It will be marked as interrupted.")) {
      if (session) {
        session.status = 'interrupted';
        session.endTime = Date.now();
        storageService.saveSession(session);
        storageService.setActiveSession(null);
      }
      navigate('/');
    }
  };

  const logDistraction = () => {
    const reason = window.prompt("What distracted you? (e.g., Phone, Social Media, Sleepy)");
    if (reason && session) {
      const updated = { ...session, distractions: [...session.distractions, reason] };
      setSession(updated);
      storageService.setActiveSession(updated);
      alert("Distraction logged. Get back to focus!");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      
      {phase === 'setup' && (
        <div className="bg-surface border border-border p-8 rounded-2xl max-w-xl mx-auto w-full shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">Configure Session</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-muted mb-2">Subject</label>
              <input className="w-full bg-surface-hover border border-border p-3 rounded-lg focus:outline-none focus:border-primary" placeholder="e.g. DBMS" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Goal</label>
              <input className="w-full bg-surface-hover border border-border p-3 rounded-lg focus:outline-none focus:border-primary" placeholder="e.g. Complete Normalization" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-muted mb-2">Duration (min)</label>
                <input type="number" className="w-full bg-surface-hover border border-border p-3 rounded-lg focus:outline-none focus:border-primary" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-muted mb-2">Technique</label>
                <select className="w-full bg-surface-hover border border-border p-3 rounded-lg focus:outline-none focus:border-primary" value={form.technique} onChange={e => setForm({...form, technique: e.target.value})}>
                  <option>Pomodoro</option>
                  <option>Deep Focus</option>
                  <option>Deep Work</option>
                  <option>52/17</option>
                </select>
              </div>
            </div>
            <button 
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg mt-4 disabled:opacity-50 transition-colors"
              onClick={() => setPhase('committed')}
              disabled={!form.subject || !form.goal}
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {phase === 'committed' && (
        <div className="bg-surface border border-border p-10 rounded-2xl max-w-xl mx-auto w-full text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-orange-400">Study Commitment</h2>
          <p className="text-xl mb-10 leading-relaxed">
            &quot;I commit to studying <strong className="text-primary">{form.subject}</strong> for <strong>{form.duration} minutes</strong> and completing my goal: <strong className="text-primary">{form.goal}</strong>.&quot;
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 border border-border rounded-lg hover:bg-surface-hover font-medium transition-colors" onClick={() => setPhase('setup')}>Go Back</button>
            <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors" onClick={startSession}>I&apos;M COMMITTED</button>
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="text-center w-full">
          {interrupted && (
            <div className="bg-error/20 border border-error text-error p-4 rounded-lg mb-8 inline-flex items-center gap-3">
              <AlertTriangle /> 
              <span className="font-medium">⚠️ You left your focus session. Stay locked in!</span>
            </div>
          )}
          
          <div className="text-2xl text-muted font-medium mb-2">{form.subject} &mdash; {form.technique}</div>
          <div className="text-4xl font-bold mb-16 text-primary">{form.goal}</div>
          
          <div className="text-[10rem] font-black font-mono leading-none tracking-tighter text-shadow-glow">
            {formatTime(timeLeft)}
          </div>

          <div className="mt-20 flex justify-center gap-6">
            <button className="px-6 py-3 border border-error text-error hover:bg-error/10 rounded-lg font-medium transition-colors" onClick={endSessionEarly}>
              End Session
            </button>
            <button className="px-6 py-3 border border-border hover:bg-surface-hover rounded-lg font-medium transition-colors" onClick={logDistraction}>
              I&apos;m Distracted
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
