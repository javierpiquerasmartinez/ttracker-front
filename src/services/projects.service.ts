import { api } from './api';
import type { Project } from '../types';

export function getProjects(clientId?: string): Promise<Project[]> {
  const query = clientId ? `?clientId=${clientId}` : '';
  return api.get<Project[]>(`/projects${query}`);
}

export function createProject(data: {
  client_id: string;
  name: string;
  description?: string;
  estimated_hours?: number;
}): Promise<Project> {
  return api.post<Project>('/projects', data);
}

export function updateProject(id: string, data: { name?: string; description?: string }): Promise<Project> {
  return api.patch<Project>(`/projects/${id}`, data);
}
