import { useState, useEffect, type FormEvent } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useToast } from '../../context/ToastContext';
import { getClients } from '../../services/clients.service';
import { getProjects } from '../../services/projects.service';
import type { Client, Project } from '../../types';

interface Props {
  onClose: () => void;
}

export function PlayModal({ onClose }: Props) {
  const { start } = useTimer();
  const { addToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
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
    setProjectId('');
  }, [clientId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) { setError('Selecciona un proyecto'); return; }
    setLoading(true);
    setError('');
    try {
      await start(projectId, description.trim() || undefined);
      addToast('Timer iniciado', 'success');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Seleccionar cliente...</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
        >
          <option value="">Seleccionar proyecto...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="ej: Implementar login"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancelar</button>
        <button type="submit" disabled={loading || !projectId} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer">
          {loading ? 'Iniciando...' : 'Iniciar'}
        </button>
      </div>
    </form>
  );
}
