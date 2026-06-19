import { api } from './api';
import type { TimeRecord, PaginatedResponse, DashboardSummary } from '../types';

export function getActiveTimer(): Promise<TimeRecord | null> {
  return api.get<TimeRecord | null>('/time-records/active');
}

export function startTimer(data: { project_id: string; description?: string }): Promise<TimeRecord> {
  return api.post<TimeRecord>('/time-records/start', data);
}

export function stopTimer(id: string): Promise<TimeRecord> {
  return api.post<TimeRecord>(`/time-records/${id}/stop`);
}

export function createManual(data: {
  project_id: string;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
}): Promise<TimeRecord> {
  return api.post<TimeRecord>('/time-records/manual', data);
}

export function getTimeRecords(params?: {
  projectId?: string;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TimeRecord>> {
  const searchParams = new URLSearchParams();
  if (params?.projectId) searchParams.set('projectId', params.projectId);
  if (params?.clientId) searchParams.set('clientId', params.clientId);
  if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
  if (params?.toDate) searchParams.set('toDate', params.toDate);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();
  return api.get<PaginatedResponse<TimeRecord>>(`/time-records${qs ? `?${qs}` : ''}`);
}

export function updateTimeRecord(id: string, data: {
  project_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
}): Promise<TimeRecord> {
  return api.patch<TimeRecord>(`/time-records/${id}`, data);
}

export function deleteTimeRecord(id: string): Promise<void> {
  return api.delete<void>(`/time-records/${id}`);
}

export function getDashboard(from: string, to: string): Promise<DashboardSummary> {
  return api.get<DashboardSummary>(`/dashboard?from=${from}&to=${to}`);
}

export function exportPdf(projectId: string, fromDate?: string, toDate?: string): Promise<Blob> {
  const params = new URLSearchParams({ projectId });
  if (fromDate) params.set('fromDate', fromDate);
  if (toDate) params.set('toDate', toDate);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz) params.set('tz', tz);
  return api.getBlob(`/time-records/export/pdf?${params.toString()}`);
}
