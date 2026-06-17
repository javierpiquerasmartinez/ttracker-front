import { api } from './api';
import type { Client } from '../types';

export function getClients(): Promise<Client[]> {
  return api.get<Client[]>('/clients');
}

export function createClient(data: { name: string; description?: string }): Promise<Client> {
  return api.post<Client>('/clients', data);
}
