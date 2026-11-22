import { renderHook, waitFor } from '@testing-library/react';
import { fetchApiHealth } from '../api/health';
import { useApiHealth } from './useApiHealth';

vi.mock('../api/health');

describe('useApiHealth', () => {
  it('vai de loading para ok quando a API responde', async () => {
    vi.mocked(fetchApiHealth).mockResolvedValue({
      status: 'ok',
      api: { status: 'ok' },
      database: { status: 'up', connected: true, database: 'tourvr_db', detail: 'ok' },
    });
    const { result } = renderHook(() => useApiHealth());

    expect(result.current).toBe('loading');
    await waitFor(() => {
      expect(result.current).toBe('ok');
    });
  });

  it('vai de loading para error quando a API falha', async () => {
    vi.mocked(fetchApiHealth).mockRejectedValue(new Error('rede'));
    const { result } = renderHook(() => useApiHealth());

    expect(result.current).toBe('loading');
    await waitFor(() => {
      expect(result.current).toBe('error');
    });
  });

  it.each([
    ['sucesso', true],
    ['falha', false],
  ])('ignora a %s que chega depois de desmontar', async (_label, succeeds) => {
    let settle: () => void = () => undefined;
    vi.mocked(fetchApiHealth).mockReturnValue(
      new Promise((resolve, reject) => {
        settle = () => {
          if (succeeds) resolve({} as never);
          else reject(new Error('rede'));
        };
      }),
    );
    const { result, unmount } = renderHook(() => useApiHealth());

    unmount();
    settle();
    await Promise.resolve();
    expect(result.current).toBe('loading');
  });
});
