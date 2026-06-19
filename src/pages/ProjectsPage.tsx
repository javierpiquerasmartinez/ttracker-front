import { useState, useEffect, useMemo } from 'react';
import { getProjects } from '../services/projects.service';
import { getClients } from '../services/clients.service';
import { Modal } from '../components/common/Modal';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Loading } from '../components/common/Loading';
import { Card } from '../components/common/ui/Card';
import { Button } from '../components/common/ui/Button';
import { EmptyState } from '../components/common/ui/EmptyState';
import { Select } from '../components/common/ui/Input';
import { useNavigate } from 'react-router-dom';
import type { Project, Client } from '../types';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterClientId, setFilterClientId] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadProjects = async (clientId?: string) => {
    try {
      const data = await getProjects(clientId || undefined);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients().then(setClients).catch(() => {});
    loadProjects();
  }, []);

  useEffect(() => {
    setLoading(true);
    loadProjects(filterClientId);
  }, [filterClientId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client?.name.toLowerCase().includes(q),
    );
  }, [projects, search]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <Button onClick={() => setShowForm(true)}>Crear Proyecto</Button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <Select
          value={filterClientId}
          onChange={(e) => setFilterClientId(e.target.value)}
          className="max-w-[180px]"
        >
          <option value="">Todos los clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        />
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Card className="py-2">
          <EmptyState title="No hay proyectos" description="Crea tu primer proyecto para registrar tiempo" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/projects/${p.id}`)}>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.client?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingProject(p); }}
                      className="text-brand-600 hover:text-brand-700 font-medium cursor-pointer mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${p.id}`); }}
                      className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Crear Proyecto">
        <ProjectForm onSaved={() => loadProjects(filterClientId)} onClose={() => setShowForm(false)} />
      </Modal>

      <Modal open={!!editingProject} onClose={() => setEditingProject(null)} title="Editar Proyecto">
        {editingProject && (
          <ProjectForm project={editingProject} onSaved={() => loadProjects(filterClientId)} onClose={() => setEditingProject(null)} />
        )}
      </Modal>
    </div>
  );
}
