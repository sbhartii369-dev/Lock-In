import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Flame, BrainCircuit, CheckCircle } from 'lucide-react';
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
  const [profile, setProfile] = useState(storageService.getProfile());
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    const sessions = storageService.getSessions();
    setSessionsCompleted(sessions.filter(s => s.status === 'completed').length);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Welcome back, {profile.name}!</h1>
      <p className="text-muted text-lg">Stop planning. Start focusing.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Focused Time" value={`${Math.floor(profile.totalFocusedTime / 60)}h ${profile.totalFocusedTime % 60}m`} icon={<BrainCircuit className="text-primary" />} />
        <StatCard title="Sessions" value={`${sessionsCompleted}`} icon={<Target className="text-blue-500" />} />
        <StatCard title="Current Streak" value={`${profile.currentStreak} days`} icon={<Flame className="text-orange-500" />} />
        <StatCard title="Focus Score" value={`${profile.focusScore}/100`} icon={<CheckCircle className="text-green-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="col-span-2 bg-surface p-6 rounded-2xl border border-border">
          <h2 className="text-xl font-bold mb-6">Weekly Study Hours</h2>
          <div className="h-64">
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
