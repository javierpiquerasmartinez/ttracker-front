import type { Period } from '../../types';

interface Props {
  period: Period;
  onPeriodChange: (p: Period) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (d: string) => void;
  onCustomToChange: (d: string) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
  { value: 'custom', label: 'Custom' },
];

export function PeriodFilter({ period, onPeriodChange, customFrom, customTo, onCustomFromChange, onCustomToChange }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <div className="inline-flex items-center gap-0.5 p-1 bg-slate-100/80 rounded-lg ring-1 ring-slate-200/60">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => onPeriodChange(p.value)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-150 cursor-pointer ${
              period === p.value
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <span className="text-sm text-slate-400">a</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      )}
    </div>
  );
}
