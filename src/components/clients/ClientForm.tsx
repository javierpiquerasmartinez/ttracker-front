import { useState, type FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { createClient, updateClient } from '../../services/clients.service';
import { Button } from '../common/ui/Button';
import { Input, Textarea } from '../common/ui/Input';
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" loading={loading}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
