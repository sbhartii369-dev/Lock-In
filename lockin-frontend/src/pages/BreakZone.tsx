import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BreakZone() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes default
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Break Complete! Ready to start your next session?");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center text-center space-y-8">
      <h1 className="text-4xl font-bold text-primary">🎉 You earned a break!</h1>
      <p className="text-xl text-muted mb-8">Take a moment to refresh your mind.</p>

      <div className="text-6xl font-black font-mono text-primary mb-12">
        {formatTime(timeLeft)}
      </div>

      {!activeGame ? (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose a Refresh Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="bg-surface hover:bg-surface-hover border border-border p-6 rounded-2xl flex flex-col items-center gap-4 transition-colors" onClick={() => setActiveGame('memory')}>
              <span className="text-4xl">🧠</span>
              <span className="font-bold text-lg">Memory Match</span>
            </button>
            <button className="bg-surface hover:bg-surface-hover border border-border p-6 rounded-2xl flex flex-col items-center gap-4 transition-colors" onClick={() => setActiveGame('breathing')}>
              <span className="text-4xl">🌿</span>
              <span className="font-bold text-lg">Breathing Exercise</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-surface border border-border p-8 rounded-2xl flex flex-col items-center">
          <button className="self-start text-muted mb-4 hover:text-primary" onClick={() => setActiveGame(null)}>← Back to Activities</button>
          
          {activeGame === 'memory' && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Memory Match (Placeholder)</h3>
              <p className="text-muted">A functional mini-game would go here!</p>
            </div>
          )}
          
          {activeGame === 'breathing' && (
            <div className="text-center py-12 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-12">Breathing Exercise</h3>
              <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  Inhale
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button className="mt-12 px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors" onClick={() => navigate('/study')}>
        Start Next Session
      </button>
    </div>
  );
}
