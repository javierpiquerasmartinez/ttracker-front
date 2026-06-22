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
      (p) => p.name.toLowerCase().includes(q) || p.client?.name.toLowerCase().includes(q),
    );
  }, [projects, search]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Proyectos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organiza tu trabajo por proyectos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Crear Proyecto
        </Button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <Select
          value={filterClientId}
          onChange={(e) => setFilterClientId(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Todos los clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <div className="relative flex-1 max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.9 3.5l4.3 4.3a1 1 0 01-1.4 1.4l-4.3-4.3A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState title="No hay proyectos" description="Crea tu primer proyecto para registrar tiempo" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/80">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyecto</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/60 cursor-pointer transition-colors duration-150"
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  <td className="px-6 py-4 text-sm text-slate-600">{p.client?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(p);
                      }}
                      className="text-brand-600 hover:text-brand-700 font-medium cursor-pointer mr-3 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${p.id}`);
                      }}
                      className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer transition-colors"
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
          <ProjectForm
            project={editingProject}
            onSaved={() => loadProjects(filterClientId)}
            onClose={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
}
