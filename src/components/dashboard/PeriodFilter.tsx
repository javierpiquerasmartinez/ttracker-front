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
      <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => onPeriodChange(p.value)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all cursor-pointer ${
              period === p.value
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
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
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-400">a</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}
    </div>
  );
}
