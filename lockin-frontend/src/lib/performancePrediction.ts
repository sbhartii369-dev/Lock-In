import type { PredictionInput, PredictionResult } from '../types';

/**
 * Calculates a performance prediction score based on a transparent rules engine.
 * 
 * Formula factors (Base 100):
 * - Academic History (25% weight): Maps past score directly.
 * - Attendance (15% weight): High attendance increases score.
 * - Study Hours (15% weight): Sweet spot is 3-6 hours. Too little or too much (burnout) reduces weight.
 * - Quiz Average (15% weight): Maps directly to recent practical performance.
 * - Assignment Completion (10% weight): Maps directly.
 * - Distraction Frequency (-20% potential penalty): High distractions heavily penalize score.
 * - Sleep Hours (10% weight): Sweet spot is 7-9 hours. Less than 5 hours heavily penalizes.
 * - Trend Modifier (+/- 5%): Improving adds bonus, declining adds penalty.
 */
export function calculatePrediction(input: PredictionInput): PredictionResult {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // 1. Academic Score (25% weight)
  const academicWeight = (input.academicScore / 100) * 25;
  score += academicWeight;
  if (input.academicScore >= 80) strengths.push('Strong academic foundation');
  else if (input.academicScore < 60) weaknesses.push('Previous academic scores indicate gaps in understanding');

  // 2. Attendance (15% weight)
  const attendanceWeight = (input.attendance / 100) * 15;
  score += attendanceWeight;
  if (input.attendance >= 90) strengths.push('Excellent attendance and consistency');
  else if (input.attendance < 75) weaknesses.push('Low attendance is hurting your learning continuity');

  // 3. Study Hours (15% weight)
  let studyWeight = 0;
  if (input.studyHoursPerDay >= 3 && input.studyHoursPerDay <= 6) {
    studyWeight = 15;
    strengths.push('Optimal daily study hours');
  } else if (input.studyHoursPerDay > 6) {
    studyWeight = 12; // Slight penalty for potential burnout
    weaknesses.push('High study hours might lead to burnout');
    recommendations.push('Ensure you are taking adequate breaks to avoid burnout and maintain retention.');
  } else {
    studyWeight = (input.studyHoursPerDay / 3) * 10;
    weaknesses.push('Low daily study hours');
    recommendations.push('Gradually increase your daily study time by 30 minutes each week.');
  }
  score += studyWeight;

  // 4. Quiz Average (15% weight)
  const quizWeight = (input.quizAverage / 100) * 15;
  score += quizWeight;
  if (input.quizAverage >= 80) strengths.push('High retention on quizzes');
  else weaknesses.push('Quiz scores suggest poor retention of studied material');

  // 5. Assignment Completion (10% weight)
  const assignmentWeight = (input.assignmentCompletion / 100) * 10;
  score += assignmentWeight;
  if (input.assignmentCompletion >= 90) strengths.push('Consistent assignment completion');

  // 6. Sleep Hours (10% weight)
  let sleepWeight = 0;
  if (input.sleepHours >= 7 && input.sleepHours <= 9) {
    sleepWeight = 10;
    strengths.push('Healthy sleep schedule');
  } else if (input.sleepHours < 5) {
    sleepWeight = 0; // Heavy penalty
    weaknesses.push('Severe lack of sleep impairs cognitive function');
    recommendations.push('Prioritize getting at least 7 hours of sleep. Pulling all-nighters hurts memory consolidation.');
  } else {
    sleepWeight = 5;
    recommendations.push('Try to get a full 7-8 hours of sleep to improve focus and memory.');
  }
  score += sleepWeight;

  // 7. Distraction Frequency (Penalty)
  let distractionPenalty = 0;
  if (input.distractionFrequency === 'High') {
    distractionPenalty = 15;
    weaknesses.push('High distraction rate during sessions');
    recommendations.push('Use the "Deep Focus" timer technique and put your phone in another room.');
  } else if (input.distractionFrequency === 'Medium') {
    distractionPenalty = 5;
    recommendations.push('Identify your main distractions and remove them from your study environment.');
  } else {
    strengths.push('Excellent ability to maintain focus without distractions');
  }
  score -= distractionPenalty;

  // 8. Trend Modifier
  if (input.previousTrend === 'Improving') {
    score += 5;
    strengths.push('Performance is on an upward trajectory');
  } else if (input.previousTrend === 'Declining') {
    score -= 5;
    weaknesses.push('Performance trend is currently declining');
    recommendations.push('Review what changed recently in your routine that caused the decline and adjust back.');
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Categorize
  let category: PredictionResult['category'];
  if (score >= 85) category = 'Excellent';
  else if (score >= 70) category = 'Good';
  else if (score >= 50) category = 'Needs Improvement';
  else category = 'At Risk';

  // Fallback recommendations if empty
  if (recommendations.length === 0) {
    recommendations.push('Maintain your current habits, they are working perfectly!');
    recommendations.push('Try setting harder goals to challenge yourself further.');
  }

  // Determine predicted trend
  let trend: PredictionResult['trend'] = 'Stable';
  if (score > input.academicScore + 5) trend = 'Improving';
  else if (score < input.academicScore - 5) trend = 'Declining';

  return {
    score,
    category,
    trend,
    strengths,
    weaknesses,
    recommendations
  };
}
