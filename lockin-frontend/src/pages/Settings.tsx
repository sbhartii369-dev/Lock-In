import { useState } from 'react';
import { Settings as SettingsIcon, User, Moon, Sun, Monitor, Bell, Volume2, Database, Info, Shield, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const [profile, setProfile] = useState(storageService.getProfile());
  const { theme, setTheme } = useTheme();

  const handleUpdateProfile = (updates: Partial<typeof profile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleUpdateSettings = (updates: Partial<typeof profile.settings>) => {
    const updated = { ...profile, settings: { ...profile.settings, ...updates } };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all your local data? This cannot be undone.")) {
      storageService.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-primary" size={32} />
          Settings
        </h1>
        <p className="text-muted mt-2 text-sm md:text-base">
          Manage your account preferences and app behavior.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* PROFILE SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-hover border-b border-border flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h2 className="font-bold">Profile</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Display Name</label>
              <input 
                type="text" 
                className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-foreground"
                value={profile.name}
                onChange={e => handleUpdateProfile({ name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Default Study Duration (min)</label>
                <input 
                  type="number" 
                  min="5"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-foreground"
                  value={profile.settings.defaultStudyDuration}
                  onChange={e => handleUpdateSettings({ defaultStudyDuration: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Default Break Duration (min)</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-foreground"
                  value={profile.settings.breakDuration}
                  onChange={e => handleUpdateSettings({ breakDuration: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* APPEARANCE SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-hover border-b border-border flex items-center gap-2">
            <Moon size={18} className="text-secondary" />
            <h2 className="font-bold">Appearance</h2>
          </div>
          <div className="p-4 md:p-6">
            <label className="block text-sm font-medium text-muted mb-3">Theme Preference</label>
            <div className="grid grid-cols-3 gap-3">
              <ThemeButton 
                active={theme === 'dark'} 
                onClick={() => setTheme('dark')} 
                icon={<Moon size={20} />} 
                label="Dark" 
              />
              <ThemeButton 
                active={theme === 'light'} 
                onClick={() => setTheme('light')} 
                icon={<Sun size={20} />} 
                label="Light" 
              />
              <ThemeButton 
                active={theme === 'system'} 
                onClick={() => setTheme('system')} 
                icon={<Monitor size={20} />} 
                label="System" 
              />
            </div>
          </div>
        </section>

        {/* PREFERENCES SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-hover border-b border-border flex items-center gap-2">
            <Bell size={18} className="text-orange-500" />
            <h2 className="font-bold">Preferences</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <ToggleRow 
              label="Push Notifications" 
              description="Receive reminders for scheduled study sessions."
              checked={profile.settings.notifications}
              onChange={val => handleUpdateSettings({ notifications: val })}
              icon={<Bell size={20} className="text-muted" />}
            />
            <div className="border-t border-border my-2" />
            <ToggleRow 
              label="Sound Effects" 
              description="Play sounds when timers complete."
              checked={profile.settings.sound}
              onChange={val => handleUpdateSettings({ sound: val })}
              icon={<Volume2 size={20} className="text-muted" />}
            />
          </div>
        </section>

        {/* DATA SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-hover border-b border-border flex items-center gap-2">
            <Database size={18} className="text-violet-500" />
            <h2 className="font-bold">Data & Privacy</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <div className="font-medium">Reset Local Data</div>
                <div className="text-sm text-muted">Permanently delete all sessions, goals, and analytics from this device.</div>
              </div>
              <button 
                onClick={handleResetData}
                className="w-full md:w-auto px-4 py-2 border border-error text-error hover:bg-error/10 rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                Reset Data
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-hover border-b border-border flex items-center gap-2">
            <Info size={18} className="text-muted" />
            <h2 className="font-bold">About</h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield size={24} className="text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg">Lock In</div>
                <div className="text-sm text-muted">Version 1.0.0</div>
              </div>
            </div>
            <p className="text-sm text-muted">
              Designed for students to maintain deep focus, track academic goals, and optimize study performance without distractions.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

function ThemeButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-4 flex flex-col items-center gap-2 rounded-xl border transition-all ${
        active 
          ? 'border-primary bg-primary/10 text-primary' 
          : 'border-border bg-surface-hover text-muted hover:text-foreground hover:border-muted'
      }`}
    >
      {active && (
        <div className="absolute top-2 right-2 text-primary">
          <Check size={14} />
        </div>
      )}
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange, icon }: { label: string, description: string, checked: boolean, onChange: (val: boolean) => void, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-surface-hover rounded-lg hidden sm:block">
          {icon}
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted">{description}</div>
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-primary' : 'bg-surface-hover border border-border'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
