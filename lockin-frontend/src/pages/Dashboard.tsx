import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Flame, BrainCircuit, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

const weeklyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.8 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.2 },
  { day: 'Fri', hours: 3.0 },
  { day: 'Sat', hours: 5.5 },
  { day: 'Sun', hours: 2.0 },
];

export default function Dashboard() {
  const [profile] = useState(storageService.getProfile());
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    const sessions = storageService.getSessions();
    setSessionsCompleted(sessions.filter(s => s.status === 'completed').length);
  }, []);

  const latestPrediction = storageService.getPredictionHistory()[0];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold">Welcome back, {profile.name}!</h1>
      <p className="text-muted text-sm md:text-lg">Stop planning. Start focusing.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Focused Time" value={`${Math.floor(profile.totalFocusedTime / 60)}h ${profile.totalFocusedTime % 60}m`} icon={<BrainCircuit className="text-primary" />} />
        <StatCard title="Sessions" value={`${sessionsCompleted}`} icon={<Target className="text-secondary" />} />
        <StatCard title="Current Streak" value={`${profile.currentStreak} days`} icon={<Flame className="text-orange" />} />
        <StatCard title="Focus Score" value={`${profile.focusScore}/100`} icon={<CheckCircle className="text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-surface p-4 md:p-6 rounded-2xl border border-border overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Weekly Study Hours</h2>
          <div className="h-48 md:h-64 -ml-4 md:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PERFORMANCE FORECAST */}
        <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative">
              <BrainCircuit className="text-primary" size={24} /> 
              Performance Forecast
            </h2>
            
            {latestPrediction ? (
              <div className="space-y-4 relative">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-foreground">{latestPrediction.result.score}</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded border ${
                    latestPrediction.result.category === 'Excellent' ? 'border-primary text-primary bg-primary/10' :
                    latestPrediction.result.category === 'Good' ? 'border-blue-400 text-blue-400 bg-blue-400/10' :
                    latestPrediction.result.category === 'Needs Improvement' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                    'border-error text-error bg-error/10'
                  }`}>
                    {latestPrediction.result.category}
                  </span>
                </div>
                <div className="text-muted flex items-center gap-2 font-medium">
                  Trend: <span className={latestPrediction.result.trend === 'Improving' ? 'text-primary' : latestPrediction.result.trend === 'Declining' ? 'text-error' : ''}>{latestPrediction.result.trend}</span>
                  {latestPrediction.result.trend === 'Improving' && <TrendingUp size={16} className="text-primary" />}
                </div>
              </div>
            ) : (
              <div className="text-muted italic relative py-4">
                Your performance forecast is waiting.
              </div>
            )}
          </div>

          <Link to="/prediction" className="mt-6 w-full py-3 px-4 bg-surface-hover hover:bg-surface border border-border rounded-lg text-center font-bold transition-colors relative">
            {latestPrediction ? 'View Prediction' : 'Generate Forecast'}
          </Link>
        </div>

        {/* Daily Plan */}
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <h2 className="text-xl font-bold mb-6">Today's Plan</h2>
          <div className="space-y-4">
            <PlanItem time="09:00" subject="DBMS" status="Completed" />
            <PlanItem time="10:00" subject="DSA" status="In progress" />
            <PlanItem time="17:00" subject="Aptitude" status="Upcoming" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
      <div className="p-4 bg-surface-hover rounded-xl">{icon}</div>
      <div>
        <div className="text-muted text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function PlanItem({ time, subject, status }: { time: string, subject: string, status: string }) {
  const statusColors = {
    'Completed': 'text-success bg-success/10',
    'In progress': 'text-blue-500 bg-blue-500/10',
    'Upcoming': 'text-muted bg-surface-hover'
  };
  return (
    <div className="flex justify-between items-center p-4 border border-border rounded-xl">
      <div>
        <div className="text-sm text-muted">{time}</div>
        <div className="font-semibold">{subject}</div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${(statusColors as any)[status]}`}>
        {status}
      </div>
    </div>
  );
}
