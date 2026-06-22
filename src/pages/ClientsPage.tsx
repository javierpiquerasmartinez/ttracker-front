import { useState, useEffect } from 'react';
import { getClients } from '../services/clients.service';
import { Modal } from '../components/common/Modal';
import { ClientForm } from '../components/clients/ClientForm';
import { Loading } from '../components/common/Loading';
import { Card } from '../components/common/ui/Card';
import { Button } from '../components/common/ui/Button';
import { EmptyState } from '../components/common/ui/EmptyState';
import type { Client } from '../types';
import { formatDate } from '../utils/date';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestiona los clientes de tus proyectos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Crear Cliente
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : clients.length === 0 ? (
        <Card>
          <EmptyState title="No hay clientes" description="Crea tu primer cliente para empezar" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/80">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Creado</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(c.created_at.split('T')[0])}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => setEditingClient(c)}
                      className="text-brand-600 hover:text-brand-700 font-medium cursor-pointer transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Crear Cliente">
        <ClientForm onSaved={loadClients} onClose={() => setShowForm(false)} />
      </Modal>

      <Modal open={!!editingClient} onClose={() => setEditingClient(null)} title="Editar Cliente">
        {editingClient && (
          <ClientForm client={editingClient} onSaved={loadClients} onClose={() => setEditingClient(null)} />
        )}
      </Modal>
    </div>
  );
}
