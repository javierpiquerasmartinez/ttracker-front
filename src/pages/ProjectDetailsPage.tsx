import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTimeRecords } from '../services/timeRecords.service';
import { getProjects } from '../services/projects.service';
import { deleteTimeRecord, exportPdf } from '../services/timeRecords.service';
import { Modal } from '../components/common/Modal';
import { TimeRecordForm } from '../components/time-records/TimeRecordForm';
import { Loading } from '../components/common/Loading';
import { useToast } from '../context/ToastContext';
import { formatDate, formatHours, formatMinutes } from '../utils/date';
import type { TimeRecord, Project } from '../types';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
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
    if (!window.confirm('¿Eliminar este registro?')) return;
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
      <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block cursor-pointer">
        &larr; Volver al Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">Cliente: {project.client?.name || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatMinutes(totalMinutes)}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
        <button onClick={handleExport} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer">
          Exportar PDF
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay registros para este proyecto</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Horas</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{r.description || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.record_type === 'automatic' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.record_type === 'automatic' ? 'Auto' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 font-mono">{formatHours(r.duration_minutes)}</td>
                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    <button onClick={() => setEditingRecord(r)} className="text-blue-600 hover:text-blue-800 cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(r)} className="text-red-600 hover:text-red-800 cursor-pointer">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editingRecord} onClose={() => setEditingRecord(null)} title="Editar Registro">
        {editingRecord && (
          <TimeRecordForm record={editingRecord} onSaved={loadData} onClose={() => setEditingRecord(null)} />
        )}
      </Modal>
    </div>
  );
}
