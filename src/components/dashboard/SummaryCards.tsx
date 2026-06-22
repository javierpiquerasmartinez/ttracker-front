import { Card } from '../common/ui/Card';
import { formatMinutes } from '../../utils/date';

interface Props {
  totalHours: number;
  avgHoursPerDay: number;
  daysWorked: number;
}

const cards = [
  {
    key: 'total',
    label: 'Total Horas',
    accent: 'from-brand-500 to-brand-700',
    icon: (
      <path d="M12 8v4l3 2M12 21a9 9 0 110-18 9 9 0 010 18z" />
    ),
  },
  {
    key: 'avg',
    label: 'Promedio / día',
    accent: 'from-emerald-500 to-emerald-700',
    icon: <path d="M3 12h4l3-9 4 18 3-9h4" />,
  },
  {
    key: 'days',
    label: 'Días trabajados',
    accent: 'from-amber-500 to-amber-600',
    icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />,
  },
] as const;

export function SummaryCards({ totalHours, avgHoursPerDay, daysWorked }: Props) {
  const values: Record<string, string | number> = {
    total: formatMinutes(Math.round(totalHours * 60)),
    avg: formatMinutes(Math.round(avgHoursPerDay * 60)),
    days: daysWorked,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c) => (
        <Card key={c.key} className="p-5 overflow-hidden relative">
          <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${c.accent}`} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1.5">{c.label}</p>
              <p className="text-[2rem] leading-none font-bold text-slate-900 tabular-nums tracking-tight">
                {values[c.key]}
              </p>
            </div>
            <div className={`flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br ${c.accent} text-white shadow-xs`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5"
              >
                {c.icon}
              </svg>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
