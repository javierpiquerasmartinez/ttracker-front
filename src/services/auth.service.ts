import { api, setToken } from './api';
import type { User } from '../types';

interface LoginResponse {
  access_token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<LoginResponse>('/auth/login', { email, password });
  setToken(data.access_token);
  return data.user;
}

export async function getMe(): Promise<User> {
  return api.get<User>('/auth/me');
}

export function logout() {
  setToken(null);
}
