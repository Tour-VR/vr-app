import { renderHook, waitFor } from '@testing-library/react';
import { useImmersiveVrSupport } from './useImmersiveVrSupport';

function setXr(value: unknown) {
  Object.defineProperty(navigator, 'xr', { value, configurable: true });
}

describe('useImmersiveVrSupport', () => {
  afterEach(() => {
    setXr(undefined);
  });

  it('sem navigator.xr devolve false', async () => {
    setXr(undefined);
    const { result } = renderHook(() => useImmersiveVrSupport());

    expect(result.current).toBeNull();
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('com suporte a immersive-vr devolve true', async () => {
    const isSessionSupported = vi.fn().mockResolvedValue(true);
    setXr({ isSessionSupported });
    const { result } = renderHook(() => useImmersiveVrSupport());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    expect(isSessionSupported).toHaveBeenCalledWith('immersive-vr');
  });

  it('sem suporte devolve false', async () => {
    setXr({ isSessionSupported: vi.fn().mockResolvedValue(false) });
    const { result } = renderHook(() => useImmersiveVrSupport());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('erro na consulta devolve false', async () => {
    setXr({ isSessionSupported: vi.fn().mockRejectedValue(new Error('bloqueado')) });
    const { result } = renderHook(() => useImmersiveVrSupport());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
