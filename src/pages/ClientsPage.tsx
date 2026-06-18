import { useState, useEffect } from 'react';
import { getClients } from '../services/clients.service';
import { Modal } from '../components/common/Modal';
import { ClientForm } from '../components/clients/ClientForm';
import { Loading } from '../components/common/Loading';
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

  useEffect(() => { loadClients(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
        >
          Crear Cliente
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : clients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No hay clientes</p>
          <p className="text-sm">Crea tu primer cliente para empezar</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Creado</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.created_at.split('T')[0])}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button onClick={() => setEditingClient(c)} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
