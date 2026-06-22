import { useState, useEffect, type FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { getClients } from '../../services/clients.service';
import { createProject, updateProject } from '../../services/projects.service';
import { Button } from '../common/ui/Button';
import { Input, Select, Textarea } from '../common/ui/Input';
import type { Client, Project } from '../../types';

interface Props {
  project?: Project;
  onSaved: () => void;
  onClose: () => void;
  preselectedClientId?: string;
}

export function ProjectForm({ project, onSaved, onClose, preselectedClientId }: Props) {
  const { addToast } = useToast();
  const isEditing = !!project;
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(preselectedClientId || project?.client_id || '');
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getClients().then(setClients).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEditing && !clientId) { setError('Selecciona un cliente'); return; }
    if (!name.trim()) { setError('El nombre es obligatorio'); return; }
    setLoading(true);
    setError('');
    try {
      if (isEditing && project) {
        await updateProject(project.id, { name: name.trim(), description: description.trim() || undefined });
        addToast('Proyecto actualizado', 'success');
      } else {
        await createProject({ client_id: clientId, name: name.trim(), description: description.trim() || undefined });
        addToast('Proyecto creado', 'success');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing && clients.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-50 ring-1 ring-slate-200/80 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 mb-4">Crea un cliente primero para poder crear proyectos</p>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <Select
          label="Cliente *"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">Seleccionar cliente...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      )}
      {isEditing && project?.client && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide">Cliente</label>
          <div className="h-9 px-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-600 flex items-center">
            {project.client.name}
          </div>
        </div>
      )}
      <Input
        type="text"
        label="Nombre *"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(''); }}
        maxLength={255}
        required
      />
      <Textarea
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
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
        <Button type="submit" loading={loading}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
