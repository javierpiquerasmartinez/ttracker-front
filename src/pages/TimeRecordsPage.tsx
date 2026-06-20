import { useState, useEffect } from 'react';
import { getTimeRecords, deleteTimeRecord } from '../services/timeRecords.service';
import { getClients } from '../services/clients.service';
import { getProjects } from '../services/projects.service';
import { Modal } from '../components/common/Modal';
import { TimeRecordForm } from '../components/time-records/TimeRecordForm';
import { Loading } from '../components/common/Loading';
import { Card } from '../components/common/ui/Card';
import { Button } from '../components/common/ui/Button';
import { Badge } from '../components/common/ui/Badge';
import { EmptyState } from '../components/common/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { formatDate, formatHours, utcToLocalDate } from '../utils/date';
import type { TimeRecord, Client, Project } from '../types';

export function TimeRecordsPage() {
  const { addToast } = useToast();
  const { confirm } = useConfirm();
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
      loadRecords(page);
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleApplyFilters = () => {
    loadRecords(1);
  };

  const filterInputClass = 'px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registros de Tiempo</h1>
        <Button onClick={() => setShowManualForm(true)}>+ Registro Manual</Button>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cliente</label>
            <select value={filterClientId} onChange={(e) => setFilterClientId(e.target.value)} className={filterInputClass}>
              <option value="">Todos</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Proyecto</label>
            <select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)} className={filterInputClass}>
              <option value="">Todos</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className={filterInputClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className={filterInputClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Buscar</label>
            <input type="text" placeholder="Descripción..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${filterInputClass} w-40`} />
          </div>
          <Button variant="dark" onClick={handleApplyFilters}>Filtrar</Button>
        </div>
      </Card>

      {loading ? (
        <Loading />
      ) : records.length === 0 ? (
        <Card className="py-2">
          <EmptyState title="Sin registros" description="No hay registros que coincidan con los filtros" />
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-900">{formatDate(utcToLocalDate(r.start_time, r.date))}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{r.project?.name || '-'}</td>
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

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">Total: {total} registros</span>
            <div className="flex gap-2 items-center">
              <button disabled={page <= 1} onClick={() => loadRecords(page - 1)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                Anterior
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700">{page}</span>
              <button disabled={page * 20 >= total} onClick={() => loadRecords(page + 1)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                Siguiente
              </button>
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
