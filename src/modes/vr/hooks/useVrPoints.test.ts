import { renderHook, waitFor } from '@testing-library/react';
import { fetchPublicPoints } from '../../../core/api/points';
import type { PointSummary } from '../../../core/types';
import { useVrPoints } from './useVrPoints';

vi.mock('../../../core/api/points');

const WITH: PointSummary = {
  slug: 'cantina',
  name: 'Cantina',
  summary: 'Lanches',
  cover_url: null,
  has_panorama: true,
};
const WITHOUT: PointSummary = { ...WITH, slug: 'biblioteca', has_panorama: false };

describe('useVrPoints', () => {
  it('mantem so os pontos com panorama', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue([WITH, WITHOUT]);
    const { result } = renderHook(() => useVrPoints());

    expect(result.current.state).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: [WITH] });
    });
  });
});
