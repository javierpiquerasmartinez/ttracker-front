import { Card } from '../common/ui/Card';
import { formatMinutes } from '../../utils/date';

interface Props {
  totalHours: number;
  avgHoursPerDay: number;
  daysWorked: number;
}

const cards = [
  { key: 'total', label: 'Total Horas', accent: 'bg-brand-500' },
  { key: 'avg', label: 'Promedio / día', accent: 'bg-green-500' },
  { key: 'days', label: 'Días trabajados', accent: 'bg-amber-500' },
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
          <div className={`absolute top-0 left-0 h-1 w-full ${c.accent}`} />
          <p className="text-sm text-gray-500 mb-1">{c.label}</p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">{values[c.key]}</p>
        </Card>
      ))}
    </div>
  );
}
