import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Target, BarChart2, LayoutDashboard, BrainCircuit, Settings, BookOpen } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Techniques from './pages/Techniques';
import BreakZone from './pages/BreakZone';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Navigation */}
        <nav className="bg-bg-secondary w-full md:w-64 flex-shrink-0 border-r border-border p-4 flex flex-col gap-8">
          <div className="text-2xl font-bold text-primary flex items-center gap-2 px-2">
            <Target size={28} /> Lock In
          </div>
          
          <div className="flex flex-col gap-2">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/study" icon={<Target size={20} />} label="Study Timer" />
            <NavLink to="/techniques" icon={<BookOpen size={20} />} label="Techniques" />
            <NavLink to="/break" icon={<BrainCircuit size={20} />} label="Break Zone" />
            <NavLink to="/goals" icon={<Target size={20} />} label="Goals" />
            <NavLink to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
          </div>

          <div className="mt-auto">
            <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study" element={<Study />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/break" element={<BreakZone />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<div className="p-8">Settings (WIP)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default App;
