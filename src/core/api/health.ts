import type { HealthStatus } from '../types';
import { apiClient } from './client';

/** Consulta o diagnostico da API (`GET /health/`). */
export async function fetchApiHealth(): Promise<HealthStatus> {
  const response = await apiClient.get<HealthStatus>('/health/');
  return response.data;
}
