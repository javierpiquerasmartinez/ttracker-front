import { useState, useEffect } from 'react';
import { getTimeRecords, deleteTimeRecord } from '../services/timeRecords.service';
import { getClients } from '../services/clients.service';
import { getProjects } from '../services/projects.service';
import { Modal } from '../components/common/Modal';
import { TimeRecordForm } from '../components/time-records/TimeRecordForm';
import { Loading } from '../components/common/Loading';
import { useToast } from '../context/ToastContext';
import { formatDate, formatHours } from '../utils/date';
import type { TimeRecord, Client, Project } from '../types';

export function TimeRecordsPage() {
  const { addToast } = useToast();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [filterClientId, setFilterClientId] = useState('');
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [search, setSearch] = useState('');

  const [editingRecord, setEditingRecord] = useState<TimeRecord | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const loadRecords = async (p = 1) => {
    setLoading(true);
    try {
      const data = await getTimeRecords({
        projectId: filterProjectId || undefined,
        clientId: filterClientId || undefined,
        fromDate: filterFrom || undefined,
        toDate: filterTo || undefined,
        search: search || undefined,
        page: p,
        limit: 20,
      });
      setRecords(data.records);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients().then(setClients).catch(() => {});
  }, []);

  useEffect(() => {
    if (filterClientId) {
      getProjects(filterClientId).then(setProjects).catch(() => {});
    } else {
      setProjects([]);
    }
    setFilterProjectId('');
  }, [filterClientId]);

  useEffect(() => { loadRecords(1); }, [filterClientId, filterProjectId]);

  const handleDelete = async (record: TimeRecord) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      await deleteTimeRecord(record.id);
      addToast('Registro eliminado', 'success');
      loadRecords(page);
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleApplyFilters = () => {
    loadRecords(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registros de Tiempo</h1>
        <button
          onClick={() => setShowManualForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
        >
          + Registro Manual
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cliente</label>
            <select value={filterClientId} onChange={(e) => setFilterClientId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Proyecto</label>
            <select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Buscar</label>
            <input type="text" placeholder="Descripción..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-40" />
          </div>
          <button onClick={handleApplyFilters} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 cursor-pointer">
            Filtrar
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay registros</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Proyecto</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900">{r.project?.name || '-'}</td>
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

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">Total: {total} registros</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => loadRecords(page - 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer">Anterior</button>
              <span className="px-3 py-1 text-sm">{page}</span>
              <button disabled={page * 20 >= total} onClick={() => loadRecords(page + 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer">Siguiente</button>
            </div>
          </div>
        </>
      )}

      <Modal open={showManualForm} onClose={() => setShowManualForm(false)} title="Registrar Horas Trabajadas">
        <TimeRecordForm onSaved={() => loadRecords(page)} onClose={() => setShowManualForm(false)} />
      </Modal>

      <Modal open={!!editingRecord} onClose={() => setEditingRecord(null)} title="Editar Registro">
        {editingRecord && (
          <TimeRecordForm record={editingRecord} onSaved={() => loadRecords(page)} onClose={() => setEditingRecord(null)} />
        )}
      </Modal>
    </div>
  );
}
