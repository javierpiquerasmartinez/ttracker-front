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
import { formatDate, formatHours, formatMinutes } from '../utils/date';
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

  useEffect(() => { loadData(); }, [id]);

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
  if (!project) return <div className="p-6 text-center text-gray-500">Proyecto no encontrado</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => navigate('/')} className="text-sm text-brand-600 hover:text-brand-700 mb-4 inline-block cursor-pointer font-medium">
        &larr; Volver al Dashboard
      </button>

      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Cliente: {project.client?.name || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatMinutes(totalMinutes)}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="success" onClick={handleExport}>Exportar PDF</Button>
        </div>
      </Card>

      {records.length === 0 ? (
        <Card className="py-2">
          <EmptyState title="Sin registros" description="No hay registros para este proyecto" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-900">{formatDate(r.date)}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{r.description || '-'}</td>
                  <td className="px-6 py-3 text-sm">
                    <Badge tone={r.record_type === 'automatic' ? 'brand' : 'amber'}>
                      {r.record_type === 'automatic' ? 'Auto' : 'Manual'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono tabular-nums whitespace-nowrap">{formatHours(r.duration_minutes)}</td>
                  <td className="px-6 py-3 text-sm text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => setEditingRecord(r)} className="text-brand-600 hover:text-brand-700 cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(r)} className="text-red-600 hover:text-red-700 cursor-pointer">Eliminar</button>
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
