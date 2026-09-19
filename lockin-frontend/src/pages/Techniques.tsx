import { Link } from 'react-router-dom';

const techniques = [
  {
    name: 'Pomodoro',
    duration: '25/5',
    description: 'Work for 25 minutes, then take a 5-minute break. Perfect for maintaining high focus over long periods.',
    ideal: 'Reading, short assignments, memorization.'
  },
  {
    name: 'Deep Focus',
    duration: '50 minutes',
    description: 'Extended periods of distraction-free concentration. Pushes your cognitive capabilities.',
    ideal: 'Complex problem solving, coding, writing essays.'
  }
];

export default function Techniques() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-2">Study Techniques</h1>
      <p className="text-muted mb-8">Discover the right methodology for your current task.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map(t => (
          <div key={t.name} className="bg-surface border border-border p-6 rounded-2xl flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t.name}</h2>
              <span className="bg-surface-hover px-3 py-1 rounded-full text-xs text-muted">{t.duration}</span>
            </div>
            <p className="text-muted mb-6 flex-1">{t.description}</p>
            <div className="bg-primary/10 text-primary p-4 rounded-xl mb-6 text-sm border border-primary/20">
              <strong>Ideal for:</strong> {t.ideal}
            </div>
            <Link to={`/study?technique=${t.name}`} className="w-full text-center bg-surface-hover hover:bg-border border border-border py-3 rounded-lg font-medium transition-colors">
              Use this technique
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
