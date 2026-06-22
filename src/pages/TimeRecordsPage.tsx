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
import { Pagination } from '../components/common/ui/Pagination';
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

  useEffect(() => {
    loadRecords(1);
  }, [filterClientId, filterProjectId]);

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

  const filterInputClass =
    'h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registros de Tiempo</h1>
          <p className="text-sm text-slate-500 mt-0.5">Historial completo de horas trabajadas</p>
        </div>
        <Button onClick={() => setShowManualForm(true)}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Registro Manual
        </Button>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Cliente</label>
            <select
              value={filterClientId}
              onChange={(e) => setFilterClientId(e.target.value)}
              className={filterInputClass}
            >
              <option value="">Todos</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Proyecto</label>
            <select
              value={filterProjectId}
              onChange={(e) => setFilterProjectId(e.target.value)}
              className={filterInputClass}
            >
              <option value="">Todos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Desde</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className={filterInputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Hasta</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className={filterInputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Buscar</label>
            <input
              type="text"
              placeholder="Descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${filterInputClass} w-44`}
            />
          </div>
          <Button variant="dark" onClick={handleApplyFilters}>
            Filtrar
          </Button>
        </div>
      </Card>

      {loading ? (
        <Loading />
      ) : records.length === 0 ? (
        <Card>
          <EmptyState title="Sin registros" description="No hay registros que coincidan con los filtros" />
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50/70 border-b border-slate-200/80">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyecto</th>
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
                    <td className="px-6 py-3 text-sm text-slate-900">{r.project?.name || '-'}</td>
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

          <Pagination page={page} total={total} limit={20} onPageChange={loadRecords} />
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
