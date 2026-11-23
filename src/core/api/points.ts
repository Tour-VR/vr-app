import type { PointDetail, PointSummary } from '../types';
import { apiClient } from './client';

/** Lista os pontos publicados (`GET /public/points`). */
export async function fetchPublicPoints(): Promise<PointSummary[]> {
  const { data } = await apiClient.get<PointSummary[]>('/public/points');
  return data;
}

/** Conteudo de um ponto publicado (`GET /public/points/{slug}`); 404 se nao publicado. */
export async function fetchPublicPoint(slug: string): Promise<PointDetail> {
  const { data } = await apiClient.get<PointDetail>(`/public/points/${encodeURIComponent(slug)}`);
  return data;
}
