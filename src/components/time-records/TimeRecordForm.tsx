import { useState, useEffect, type FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { getClients } from '../../services/clients.service';
import { getProjects } from '../../services/projects.service';
import { createManual, updateTimeRecord } from '../../services/timeRecords.service';
import { getTodayStr, formatHours } from '../../utils/date';
import type { Client, Project, TimeRecord } from '../../types';

interface Props {
  record?: TimeRecord;
  onSaved: () => void;
  onClose: () => void;
}

export function TimeRecordForm({ record, onSaved, onClose }: Props) {
  const { addToast } = useToast();
  const isEditing = !!record;

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState(record?.project_id || '');
  const [date, setDate] = useState(record?.date || getTodayStr());
  const [startTime, setStartTime] = useState(record?.start_time?.substring(0, 5) || '09:00');
  const [endTime, setEndTime] = useState(record?.end_time?.substring(0, 5) || '10:00');
  const [description, setDescription] = useState(record?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getClients().then(setClients).catch(() => {});
  }, []);

  useEffect(() => {
    if (clientId) {
      getProjects(clientId).then(setProjects).catch(() => {});
    } else {
      setProjects([]);
    }
  }, [clientId]);

  useEffect(() => {
    if (record?.project?.client_id) {
      setClientId(record.project.client_id);
    }
  }, [record]);

  const validate = (): string | null => {
    if (date > getTodayStr()) return 'No se pueden registrar horas futuras';
    if (startTime >= endTime) return 'La hora fin debe ser mayor que la hora inicio';
    if (!projectId) return 'Selecciona un proyecto';
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if ((eh * 60 + em) - (sh * 60 + sm) < 1) return 'La duración debe ser al menos 1 minuto';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
    try {
      const data = {
        project_id: projectId,
        date,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        description: description.trim() || undefined,
      };

      if (isEditing && record) {
        await updateTimeRecord(record.id, data);
        addToast('Registro actualizado', 'success');
      } else {
        await createManual(data);
        const startParts = startTime.split(':').map(Number);
        const endParts = endTime.split(':').map(Number);
        const minutes = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);
        addToast(`Registro manual creado: ${formatHours(minutes)}`, 'success');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(''); }}
            max={getTodayStr()}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => { setStartTime(e.target.value); setError(''); }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => { setEndTime(e.target.value); setError(''); }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          >
            <option value="">Seleccionar...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
          <select
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setError(''); }}
            required
            disabled={!clientId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none disabled:bg-gray-100"
          >
            <option value="">Seleccionar...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancelar</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 cursor-pointer">
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
