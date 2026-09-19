import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit, Activity, Clock, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storageService';
import type { PredictionInput, PredictionResult, PredictionHistoryRecord } from '../types';
import { calculatePrediction } from '../lib/performancePrediction';

const initialFormState: PredictionInput = {
  studentName: '',
  educationLevel: 'College',
  academicScore: 75,
  attendance: 85,
  studyHoursPerDay: 4,
  quizAverage: 75,
  assignmentCompletion: 80,
  sessionsPerWeek: 10,
  distractionFrequency: 'Medium',
  sleepHours: 7,
  previousTrend: 'Stable',
};

export default function PerformancePrediction() {
  const [form, setForm] = useState<PredictionInput>(initialFormState);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);

  useEffect(() => {
    setHistory(storageService.getPredictionHistory());
  }, []);

  const handlePredict = () => {
    const prediction = calculatePrediction(form);
    setResult(prediction);

    const newRecord: PredictionHistoryRecord = {
      id: uuidv4(),
      date: Date.now(),
      inputs: { ...form },
      result: prediction
    };
    
    storageService.savePredictionRecord(newRecord);
    setHistory([newRecord, ...history]);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all prediction history?")) {
      storageService.clearPredictionHistory();
      setHistory([]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    storageService.deletePredictionRecord(id);
    setHistory(history.filter(h => h.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellent': return 'text-primary';
      case 'Good': return 'text-blue-400';
      case 'Needs Improvement': return 'text-orange-500';
      case 'At Risk': return 'text-error';
      default: return 'text-muted';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BrainCircuit className="text-primary" size={32} />
          Performance Forecast
        </h1>
        <p className="text-muted mt-2">
          Get an AI-based estimate of your future academic performance based on your current habits.
        </p>
      </div>

      {!result ? (
        <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Enter Your Study Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Student Name (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  placeholder="e.g. Alex"
                  value={form.studentName}
                  onChange={e => setForm({...form, studentName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Education Level</label>
                <select 
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.educationLevel}
                  onChange={e => setForm({...form, educationLevel: e.target.value as any})}
                >
                  <option>School</option>
                  <option>College</option>
                  <option>Competitive Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Previous Academic Score (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.academicScore}
                  onChange={e => setForm({...form, academicScore: Math.min(100, Math.max(0, Number(e.target.value)))})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Attendance (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.attendance}
                  onChange={e => setForm({...form, attendance: Math.min(100, Math.max(0, Number(e.target.value)))})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Average Study Hours / Day</label>
                <input 
                  type="number" 
                  min="0" max="24"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.studyHoursPerDay}
                  onChange={e => setForm({...form, studyHoursPerDay: Math.min(24, Math.max(0, Number(e.target.value)))})}
                />
              </div>
            </div>

            {/* Performance Factors */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Quiz/Test Average (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.quizAverage}
                  onChange={e => setForm({...form, quizAverage: Math.min(100, Math.max(0, Number(e.target.value)))})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Assignment Completion (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.assignmentCompletion}
                  onChange={e => setForm({...form, assignmentCompletion: Math.min(100, Math.max(0, Number(e.target.value)))})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Distraction Frequency</label>
                <select 
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.distractionFrequency}
                  onChange={e => setForm({...form, distractionFrequency: e.target.value as any})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Sleep Hours / Night</label>
                <input 
                  type="number" 
                  min="0" max="24"
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.sleepHours}
                  onChange={e => setForm({...form, sleepHours: Math.min(24, Math.max(0, Number(e.target.value)))})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Previous Performance Trend</label>
                <select 
                  className="w-full bg-surface-hover border border-border rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={form.previousTrend}
                  onChange={e => setForm({...form, previousTrend: e.target.value as any})}
                >
                  <option>Improving</option>
                  <option>Stable</option>
                  <option>Declining</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-center md:justify-end">
            <button 
              onClick={handlePredict}
              className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Activity size={20} />
              Generate Forecast
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 text-center bg-surface-hover border-b border-border">
            <h2 className="text-sm font-bold text-muted tracking-widest uppercase mb-4">Your Performance Forecast</h2>
            
            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="72" fill="none" stroke="var(--color-border)" strokeWidth="12" />
                  <circle cx="80" cy="80" r="72" fill="none" stroke="var(--color-primary)" strokeWidth="12" strokeDasharray="452" strokeDashoffset={452 - (452 * (result.score / 100))} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <span className="text-5xl font-black text-foreground">{result.score}</span>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-surface border border-border ${getCategoryColor(result.category)}`}>
              <Target size={16} />
              {result.category}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-muted">
              Trend: <strong className={result.trend === 'Improving' ? 'text-primary' : result.trend === 'Declining' ? 'text-error' : ''}>{result.trend}</strong>
              {result.trend === 'Improving' && <TrendingUp size={16} className="text-primary" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-primary">
                <CheckCircle size={20} /> What&apos;s Helping You
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-orange-500">
                <AlertTriangle size={20} /> What To Improve
              </h3>
              <ul className="space-y-3">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 bg-surface-hover p-6 rounded-xl border border-border mt-4">
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                <Target size={20} className="text-blue-400" /> Your Next Moves
              </h3>
              <ul className="space-y-4">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-foreground">{r}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 bg-surface-hover border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs text-muted italic max-w-xl">
              Note: This is an estimated performance forecast based on the information provided. It is a rule-based indicator, not a guaranteed prediction, and should not be used as an official academic assessment.
            </p>
            <button 
              onClick={() => setResult(null)}
              className="w-full md:w-auto px-6 py-2 border border-border rounded-lg hover:bg-surface font-medium transition-colors"
            >
              Recalculate
            </button>
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Prediction History
            </h2>
            <button 
              onClick={handleClearHistory}
              className="text-sm text-error hover:underline self-end md:self-auto"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {history.map(record => (
              <div key={record.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-border rounded-xl bg-surface-hover gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-lg border ${
                    record.result.category === 'Excellent' ? 'border-primary text-primary bg-primary/10' :
                    record.result.category === 'Good' ? 'border-blue-400 text-blue-400 bg-blue-400/10' :
                    record.result.category === 'Needs Improvement' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                    'border-error text-error bg-error/10'
                  }`}>
                    {record.result.score}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold flex flex-wrap items-center gap-2">
                      {record.inputs.educationLevel}
                      <span className="text-xs font-normal text-muted bg-surface px-2 py-0.5 rounded-md whitespace-nowrap">
                        {record.result.category}
                      </span>
                    </div>
                    <div className="text-sm text-muted">
                      {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6 text-sm text-muted mt-2 md:mt-0 border-t md:border-t-0 border-border pt-3 md:pt-0">
                  <div className="flex items-center gap-6">
                    <span title="Study Hours"><Clock size={14} className="inline mr-1" />{record.inputs.studyHoursPerDay}h</span>
                    <span title="Academic Score"><FileText size={14} className="inline mr-1" />{record.inputs.academicScore}%</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-muted hover:text-error transition-colors p-2"
                    title="Delete record"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
