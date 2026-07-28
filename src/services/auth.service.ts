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
  company_name?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
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

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  return api.patch<User>('/auth/me', data);
}

export async function changePassword(
  data: ChangePasswordData,
): Promise<{ message: string }> {
  return api.post<{ message: string }>('/auth/change-password', data);
}

export function logout() {
  setToken(null);
}
