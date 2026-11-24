import { usePublicPoints } from '../../../core/hooks/usePublicPoints';
import type { AsyncResource } from '../../../core/hooks/useAsyncResource';
import type { PointSummary } from '../../../core/types';

/** Pontos publicados que tem panorama (`has_panorama`), para a lista `/vr`. */
export function useVrPoints(): AsyncResource<PointSummary[]> {
  const { state, reload } = usePublicPoints();
  if (state.status !== 'success') return { state, reload };
  const data = state.data.filter((point) => point.has_panorama);
  return { state: { status: 'success', data }, reload };
}
