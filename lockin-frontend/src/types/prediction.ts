export interface PredictionInput {
  studentName?: string;
  educationLevel: 'School' | 'College' | 'Competitive Exam';
  academicScore: number;
  attendance: number;
  studyHoursPerDay: number;
  quizAverage: number;
  assignmentCompletion: number;
  sessionsPerWeek: number;
  distractionFrequency: 'Low' | 'Medium' | 'High';
  sleepHours: number;
  previousTrend: 'Improving' | 'Stable' | 'Declining';
}

export interface PredictionResult {
  score: number;
  category: 'Excellent' | 'Good' | 'Needs Improvement' | 'At Risk';
  trend: 'Improving' | 'Stable' | 'Declining';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface PredictionHistoryRecord {
  id: string;
  date: number;
  inputs: PredictionInput;
  result: PredictionResult;
}
