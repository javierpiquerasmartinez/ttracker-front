import { useState, type FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { createClient, updateClient } from '../../services/clients.service';
import type { Client } from '../../types';

interface Props {
  client?: Client;
  onSaved: () => void;
  onClose: () => void;
}

export function ClientForm({ client, onSaved, onClose }: Props) {
  const { addToast } = useToast();
  const isEditing = !!client;
  const [name, setName] = useState(client?.name || '');
  const [description, setDescription] = useState(client?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = { name: name.trim(), description: description.trim() || undefined };
      if (isEditing && client) {
        await updateClient(client.id, data);
        addToast('Cliente actualizado', 'success');
      } else {
        await createClient(data);
        addToast('Cliente creado', 'success');
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          maxLength={255}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
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
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 cursor-pointer">
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
