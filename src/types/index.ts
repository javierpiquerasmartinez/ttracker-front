export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  client_id: string;
  client?: Client;
  name: string;
  description?: string;
  estimated_hours?: number;
  status: string;
  is_active: boolean;
  created_at: string;
}

export interface TimeRecord {
  id: string;
  user_id: string;
  project_id: string;
  project?: Project;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description?: string;
  record_type: 'automatic' | 'manual' | 'running';
  created_at: string;
}

export interface DashboardSummary {
  totalHours: number;
  avgHoursPerDay: number;
  daysWorked: number;
  totalMinutes: number;
  projects: DashboardProject[];
}

export interface DashboardProject {
  clientName: string;
  projectName: string;
  minutes: number;
  hours: number;
  percentage: number;
  projectId: string;
  clientId: string;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
}

export type Period = 'today' | 'week' | 'month' | 'year' | 'custom';
