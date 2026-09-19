import type { UserProfile, StudySession, Goal, Reflection, PredictionHistoryRecord } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'lockin_user_profile',
  SESSIONS: 'lockin_sessions',
  GOALS: 'lockin_goals',
  REFLECTIONS: 'lockin_reflections',
  ACTIVE_SESSION: 'lockin_active_session', // to survive reloads
  PREDICTIONS: 'lockin_predictions',
};

const defaultProfile: UserProfile = {
  name: 'Student',
  focusScore: 0,
  currentStreak: 0,
  totalFocusedTime: 0,
  settings: {
    theme: 'dark',
    sound: true,
    breakDuration: 5,
    defaultStudyDuration: 50,
    notifications: true,
  }
};

export const storageService = {
  // --- Profile ---
  getProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : defaultProfile;
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },
  
  // --- Sessions ---
  getSessions(): StudySession[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSession(session: StudySession): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  
  // --- Active Session (Survives Reloads) ---
  getActiveSession(): StudySession | null {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return data ? JSON.parse(data) : null;
  },
  setActiveSession(session: StudySession | null): void {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },

  // --- Goals ---
  getGoals(): Goal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },
  saveGoal(goal: Goal): void {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },
  deleteGoal(goalId: string): void {
    const goals = this.getGoals().filter(g => g.id !== goalId);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  // --- Reflections ---
  getReflections(): Reflection[] {
    const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveReflection(reflection: Reflection): void {
    const refs = this.getReflections();
    refs.push(reflection);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(refs));
  },

  // --- Predictions ---
  getPredictionHistory(): PredictionHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  savePredictionRecord(record: PredictionHistoryRecord): void {
    const history = this.getPredictionHistory();
    history.push(record);
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(history));
  },
  deletePredictionRecord(id: string): void {
    const history = this.getPredictionHistory().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(history));
  },
  clearPredictionHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
  },

  // --- Reset ---
  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
