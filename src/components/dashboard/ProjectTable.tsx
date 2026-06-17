import { useNavigate } from 'react-router-dom';
import { exportPdf } from '../../services/timeRecords.service';
import { useToast } from '../../context/ToastContext';
import { formatDecimalHours } from '../../utils/date';
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
      <div className="text-center py-12 text-gray-500">
        <p>No hay registros para este período</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Proyecto</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Horas</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">%</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((p) => (
            <tr
              key={p.projectId}
              onClick={() => navigate(`/projects/${p.projectId}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 text-sm text-gray-900">{p.clientName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.projectName}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">{formatDecimalHours(p.minutes)}h</td>
              <td className="px-6 py-4 text-sm text-right text-gray-500">{p.percentage.toFixed(1)}%</td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/projects/${p.projectId}`); }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver
                </button>
                <button
                  onClick={(e) => handleExport(e, p.projectId)}
                  className="text-green-600 hover:text-green-800"
                >
                  Exportar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
