import type { VisitMode } from '../types';
import { apiClient } from './client';

/** Registra uma visita anonima (`POST /public/points/{slug}/visits`). */
export async function registerVisit(slug: string, mode: VisitMode): Promise<void> {
  await apiClient.post(`/public/points/${encodeURIComponent(slug)}/visits`, { mode });
}
