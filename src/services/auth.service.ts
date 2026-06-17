import { api, setToken } from './api';
import type { User } from '../types';

interface LoginResponse {
  access_token: string;
  user: User;
}

interface RegisterResponse {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<LoginResponse>('/auth/login', { email, password });
  setToken(data.access_token);
  return data.user;
}

export async function register(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Promise<RegisterResponse> {
  return api.post<RegisterResponse>('/auth/register', data);
}

export async function getMe(): Promise<User> {
  return api.get<User>('/auth/me');
}

export function logout() {
  setToken(null);
}
