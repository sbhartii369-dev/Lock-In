export interface UserSettings {
  theme: 'light' | 'dark';
  sound: boolean;
  breakDuration: number; // in minutes
  defaultStudyDuration: number; // in minutes
  notifications: boolean;
}

export interface UserProfile {
  name: string;
  focusScore: number;
  currentStreak: number;
  totalFocusedTime: number; // in minutes
  settings: UserSettings;
}

export interface StudySession {
  id: string;
  subject: string;
  goal: string;
  duration: number; // in minutes
  technique: string;
  status: 'completed' | 'interrupted' | 'in_progress';
  startTime: number; // unix timestamp
  endTime?: number;
  tabSwitches: number;
  timeAway: number; // in seconds
  distractions: string[];
}

export interface Goal {
  id: string;
  subject: string;
  title: string;
  deadline?: number; // timestamp
  targetSessions: number;
  completedSessions: number;
  isCompleted: boolean;
}

export interface Reflection {
  id: string;
  sessionId: string;
  learned: string;
  difficult: string;
  remember: string;
  revise: string;
  timestamp: number;
}
