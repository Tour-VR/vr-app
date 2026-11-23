import { renderHook, waitFor } from '@testing-library/react';
import { fetchPublicPoints } from '../api/points';
import { usePublicPoints } from './usePublicPoints';

vi.mock('../api/points');

describe('usePublicPoints', () => {
  it('carrega a lista de pontos publicados', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue([]);
    const { result } = renderHook(() => usePublicPoints());

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: [] });
    });
  });
});
