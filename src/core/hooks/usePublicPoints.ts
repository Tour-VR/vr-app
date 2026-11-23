import { fetchPublicPoints } from '../api/points';
import type { PointSummary } from '../types';
import { type AsyncResource, useAsyncResource } from './useAsyncResource';

/** Lista de pontos publicados, para a pagina inicial. */
export function usePublicPoints(): AsyncResource<PointSummary[]> {
  return useAsyncResource(fetchPublicPoints);
}
