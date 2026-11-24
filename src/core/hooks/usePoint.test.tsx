import { act, renderHook, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { fetchPublicPoint } from '../api/points';
import type { PointDetail } from '../types';
import { usePoint } from './usePoint';

vi.mock('../api/points');

function point(slug: string): PointDetail {
  return {
    slug,
    name: `Ponto ${slug}`,
    summary: 'Resumo',
    history: 'Historia',
    media: [],
    panorama_url: null,
    connections: [],
  };
}

const notFound = new AxiosError('404', undefined, undefined, undefined, {
  status: 404,
} as AxiosResponse);

describe('usePoint', () => {
  it('vai de loading para success com o ponto', async () => {
    vi.mocked(fetchPublicPoint).mockResolvedValue(point('a'));
    const { result } = renderHook(() => usePoint('a'));

    expect(result.current.state.status).toBe('loading');
    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: point('a') });
    });
    expect(fetchPublicPoint).toHaveBeenCalledWith('a');
  });

  it('vai para not-found quando a API responde 404', async () => {
    vi.mocked(fetchPublicPoint).mockRejectedValue(notFound);
    const { result } = renderHook(() => usePoint('x'));

    await waitFor(() => {
      expect(result.current.state.status).toBe('not-found');
    });
  });

  it('vai para error em outra falha e recarrega com reload', async () => {
    vi.mocked(fetchPublicPoint).mockRejectedValueOnce(new Error('rede'));
    const { result } = renderHook(() => usePoint('a'));
    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    vi.mocked(fetchPublicPoint).mockResolvedValueOnce(point('a'));
    act(() => {
      result.current.reload();
    });
    expect(result.current.state.status).toBe('loading');
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });
  });

  it('ignora a resposta de um slug anterior', async () => {
    let resolveOld: (value: PointDetail) => void = () => undefined;
    vi.mocked(fetchPublicPoint)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
      )
      .mockResolvedValueOnce(point('novo'));
    const { result, rerender } = renderHook(({ slug }) => usePoint(slug), {
      initialProps: { slug: 'antigo' },
    });

    rerender({ slug: 'novo' });
    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: point('novo') });
    });
    await act(async () => {
      resolveOld(point('antigo'));
      await Promise.resolve();
    });
    expect(result.current.state).toEqual({ status: 'success', data: point('novo') });
  });
});
