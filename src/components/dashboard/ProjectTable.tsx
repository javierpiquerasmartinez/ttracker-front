import { useNavigate } from 'react-router-dom';
import { exportPdf } from '../../services/timeRecords.service';
import { useToast } from '../../context/ToastContext';
import { Card } from '../common/ui/Card';
import { EmptyState } from '../common/ui/EmptyState';
import { formatHours } from '../../utils/date';
import type { DashboardProject } from '../../types';

interface Props {
  projects: DashboardProject[];
  fromDate: string;
  toDate: string;
}

export function ProjectTable({ projects, fromDate, toDate }: Props) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleExport = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      const blob = await exportPdf(projectId, fromDate, toDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${projectId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      addToast('PDF descargado', 'success');
    } catch {
      addToast('Error al exportar PDF', 'error');
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <EmptyState title="Sin registros" description="No hay registros para este período" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50/70 border-b border-slate-200/80">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyecto</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Horas</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">%</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((p) => (
            <tr
              key={p.projectId}
              onClick={() => navigate(`/projects/${p.projectId}`)}
              className="hover:bg-slate-50/60 cursor-pointer transition-colors duration-150"
            >
              <td className="px-6 py-4 text-sm text-slate-600">{p.clientName}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.projectName}</td>
              <td className="px-6 py-4 text-sm text-right text-slate-900 font-mono tabular-nums">{formatHours(p.minutes)}</td>
              <td className="px-6 py-4 text-sm text-right text-slate-400 tabular-nums">{p.percentage.toFixed(1)}%</td>
              <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${p.projectId}`);
                  }}
                  className="text-brand-600 hover:text-brand-700 font-medium cursor-pointer mr-3 transition-colors"
                >
                  Ver
                </button>
                <button
                  onClick={(e) => handleExport(e, p.projectId)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition-colors"
                >
                  Exportar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
