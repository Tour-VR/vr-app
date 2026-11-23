import { useCallback } from 'react';
import { fetchPublicPoint } from '../api/points';
import type { PointDetail } from '../types';
import { type AsyncResource, useAsyncResource } from './useAsyncResource';

/** Conteudo publico de um ponto; recarrega quando o `slug` muda. */
export function usePoint(slug: string): AsyncResource<PointDetail> {
  const load = useCallback(() => fetchPublicPoint(slug), [slug]);
  return useAsyncResource(load);
}
