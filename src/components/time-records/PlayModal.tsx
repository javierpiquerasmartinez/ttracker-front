import { useState, useEffect, type FormEvent } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useToast } from '../../context/ToastContext';
import { getClients } from '../../services/clients.service';
import { getProjects } from '../../services/projects.service';
import { Button } from '../common/ui/Button';
import { Select, Textarea } from '../common/ui/Input';
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
      <Select
        label="Cliente"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        required
      >
        <option value="">Seleccionar cliente...</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <Select
        label="Proyecto"
        value={projectId}
        onChange={(e) => { setProjectId(e.target.value); setError(''); }}
        required
        disabled={!clientId}
      >
        <option value="">Seleccionar proyecto...</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </Select>
      <Textarea
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="ej: Implementar login"
      />
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" loading={loading} disabled={!projectId}>
          Iniciar
        </Button>
      </div>
    </form>
  );
}
