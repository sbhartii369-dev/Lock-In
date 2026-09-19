import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Target, BarChart2, LayoutDashboard, BrainCircuit, Settings, BookOpen, Menu, X, Home, Clock } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Techniques from './pages/Techniques';
import BreakZone from './pages/BreakZone';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import PerformancePrediction from './pages/PerformancePrediction';
import SettingsPage from './pages/Settings';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-bg relative">
        
        {/* --- MOBILE HEADER --- */}
        <header className="md:hidden sticky top-0 z-40 bg-surface border-b border-border h-16 px-4 flex items-center justify-between">
          <div className="text-xl font-bold text-primary flex items-center gap-2">
            <Target size={24} /> Lock In
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 text-foreground hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* --- MOBILE DRAWER OVERLAY --- */}
        {isDrawerOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* --- DESKTOP SIDEBAR & MOBILE DRAWER --- */}
        <nav className={`
          fixed md:sticky top-0 left-0 h-full w-[85%] max-w-sm md:w-64 bg-surface border-r border-border p-4 flex flex-col gap-6 z-50
          transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}>
          <div className="flex items-center justify-between px-2">
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <Target size={28} /> Lock In
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="md:hidden p-2 text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto pb-20 md:pb-0">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/study" icon={<Clock size={20} />} label="Study Timer" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/techniques" icon={<BookOpen size={20} />} label="Techniques" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/break" icon={<BrainCircuit size={20} />} label="Break Zone" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/goals" icon={<Target size={20} />} label="Goals" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" onClick={() => setIsDrawerOpen(false)} />
            <NavLink to="/prediction" icon={<BrainCircuit size={20} />} label="AI Prediction" onClick={() => setIsDrawerOpen(false)} />
          </div>

          <div className="mt-auto pt-4 border-t border-border pb-20 md:pb-0">
            <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" onClick={() => setIsDrawerOpen(false)} />
          </div>
        </nav>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study" element={<Study />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/break" element={<BreakZone />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/prediction" element={<PerformancePrediction />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* --- MOBILE BOTTOM NAV --- */}
        <MobileBottomNav onMoreClick={() => setIsDrawerOpen(true)} />
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted hover:text-foreground hover:bg-surface-hover'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileBottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  const location = useLocation();
  
  const bottomLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/study', icon: <Clock size={20} />, label: 'Timer' },
    { to: '/goals', icon: <Target size={20} />, label: 'Goals' },
    { to: '/analytics', icon: <BarChart2 size={20} />, label: 'Insights' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 py-2 pb-safe flex justify-around items-center z-40">
      {bottomLinks.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link 
            key={link.to}
            to={link.to} 
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors rounded-xl ${
              isActive ? 'text-primary' : 'text-muted hover:text-foreground'
            }`}
          >
            {link.icon}
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
      
      <button 
        onClick={onMoreClick}
        className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-muted hover:text-foreground transition-colors rounded-xl"
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  );
}

export default App;
