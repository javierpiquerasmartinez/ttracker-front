import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTimeRecords } from '../services/timeRecords.service';
import { getProjects } from '../services/projects.service';
import { deleteTimeRecord, exportPdf } from '../services/timeRecords.service';
import { Modal } from '../components/common/Modal';
import { TimeRecordForm } from '../components/time-records/TimeRecordForm';
import { Loading } from '../components/common/Loading';
import { Card } from '../components/common/ui/Card';
import { Button } from '../components/common/ui/Button';
import { Badge } from '../components/common/ui/Badge';
import { EmptyState } from '../components/common/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate, formatHours, formatMinutes, utcToLocalDate } from '../utils/date';
import type { TimeRecord, Project } from '../types';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [project, setProject] = useState<Project | null>(null);
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<TimeRecord | null>(null);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        getProjects().then((ps) => ps.find((p) => p.id === id) || null),
        getTimeRecords({ projectId: id, limit: 1000 }).then((d) => d.records),
      ]);
      setProject(p);
      setRecords(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDelete = async (record: TimeRecord) => {
    const ok = await confirm({
      title: 'Eliminar registro',
      message: '¿Eliminar este registro? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await deleteTimeRecord(record.id);
      addToast('Registro eliminado', 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleExport = async () => {
    if (!id) return;
    try {
      const blob = await exportPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      addToast('PDF descargado', 'success');
    } catch {
      addToast('Error al exportar PDF', 'error');
    }
  };

  const totalMinutes = records.reduce((sum, r) => sum + r.duration_minutes, 0);

  if (loading) return <Loading />;
  if (!project)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <EmptyState title="Proyecto no encontrado" description="El proyecto que buscas no existe o fue eliminado" />
        </Card>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-brand-600 hover:text-brand-700 mb-5 inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 11-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
        </svg>
        Volver al Dashboard
      </button>

      <Card className="p-6 mb-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: <span className="text-slate-700 font-medium">{project.client?.name || 'N/A'}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
              {formatMinutes(totalMinutes)}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total</p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-100">
          <Button variant="success" onClick={handleExport}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.3 9.3a1 1 0 011.4 0L9 10.6V3a1 1 0 112 0v7.6l1.3-1.3a1 1 0 111.4 1.4l-3 3a1 1 0 01-1.4 0l-3-3a1 1 0 010-1.4z" clipRule="evenodd" />
            </svg>
            Exportar PDF
          </Button>
        </div>
      </Card>

      {records.length === 0 ? (
        <Card>
          <EmptyState title="Sin registros" description="No hay registros para este proyecto" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/80">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Horas</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                  <td className="px-6 py-3 text-sm text-slate-900">{formatDate(utcToLocalDate(r.start_time, r.date))}</td>
                  <td className="px-6 py-3 text-sm text-slate-500 max-w-xs truncate">{r.description || '-'}</td>
                  <td className="px-6 py-3 text-sm">
                    <Badge tone={r.record_type === 'automatic' ? 'brand' : 'amber'}>
                      {r.record_type === 'automatic' ? 'Auto' : 'Manual'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">
                    {formatHours(r.duration_minutes)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => setEditingRecord(r)}
                      className="text-brand-600 hover:text-brand-700 cursor-pointer transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(r)}
                      className="text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!editingRecord} onClose={() => setEditingRecord(null)} title="Editar Registro">
        {editingRecord && (
          <TimeRecordForm record={editingRecord} onSaved={loadData} onClose={() => setEditingRecord(null)} />
        )}
      </Modal>
    </div>
  );
}
