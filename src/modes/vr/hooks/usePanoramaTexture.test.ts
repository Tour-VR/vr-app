import { renderHook, waitFor } from '@testing-library/react';
import { SRGBColorSpace, type Texture, TextureLoader } from 'three';
import { usePanoramaTexture } from './usePanoramaTexture';

interface FakeTexture {
  colorSpace: string;
  dispose: ReturnType<typeof vi.fn>;
}

function fakeTexture(): FakeTexture {
  return { colorSpace: '', dispose: vi.fn() };
}

function asTexture(fake: FakeTexture): Texture {
  return fake as unknown as Texture;
}

const loadAsync = vi.spyOn(TextureLoader.prototype, 'loadAsync');

describe('usePanoramaTexture', () => {
  afterEach(() => {
    loadAsync.mockReset();
  });

  it('url nula devolve not-found sem carregar', () => {
    const { result } = renderHook(() => usePanoramaTexture(null));

    expect(result.current).toEqual({ status: 'not-found' });
    expect(loadAsync).not.toHaveBeenCalled();
  });

  it('carrega a textura em sRGB pela mesma origem', async () => {
    const texture = fakeTexture();
    loadAsync.mockResolvedValue(asTexture(texture));
    const { result } = renderHook(() => usePanoramaTexture('/media/360.jpg'));

    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current).toEqual({ status: 'success', data: texture });
    });
    expect(loadAsync).toHaveBeenCalledWith('/media/360.jpg');
    expect(texture.colorSpace).toBe(SRGBColorSpace);
  });

  it('falha no carregamento vira erro', async () => {
    loadAsync.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => usePanoramaTexture('/media/x.jpg'));

    await waitFor(() => {
      expect(result.current).toEqual({ status: 'error' });
    });
  });

  it('descarta a textura ao trocar de url e ao desmontar', async () => {
    const first = fakeTexture();
    const second = fakeTexture();
    loadAsync.mockResolvedValueOnce(asTexture(first)).mockResolvedValueOnce(asTexture(second));
    const { result, rerender, unmount } = renderHook(({ url }) => usePanoramaTexture(url), {
      initialProps: { url: '/media/a.jpg' },
    });
    await waitFor(() => {
      expect(result.current).toEqual({ status: 'success', data: first });
    });

    rerender({ url: '/media/b.jpg' });
    expect(first.dispose).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current).toEqual({ status: 'success', data: second });
    });

    unmount();
    expect(second.dispose).toHaveBeenCalledTimes(1);
  });

  it('descarta a textura que chega depois de desmontar', async () => {
    const texture = fakeTexture();
    let resolve: (value: Texture) => void = () => undefined;
    loadAsync.mockReturnValue(
      new Promise<Texture>((r) => {
        resolve = r;
      }),
    );
    const { unmount } = renderHook(() => usePanoramaTexture('/media/lento.jpg'));

    unmount();
    resolve(asTexture(texture));
    await waitFor(() => {
      expect(texture.dispose).toHaveBeenCalledTimes(1);
    });
  });
});
