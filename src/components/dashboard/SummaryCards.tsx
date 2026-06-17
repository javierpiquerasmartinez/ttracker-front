import { formatHours } from '../../utils/date';

interface Props {
  totalHours: number;
  avgHoursPerDay: number;
  daysWorked: number;
}

export function SummaryCards({ totalHours, avgHoursPerDay, daysWorked }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-1">Total Horas</p>
        <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-1">Promedio / día</p>
        <p className="text-3xl font-bold text-gray-900">{avgHoursPerDay.toFixed(1)}h</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-1">Días trabajados</p>
        <p className="text-3xl font-bold text-gray-900">{daysWorked}</p>
      </div>
    </div>
  );
}
