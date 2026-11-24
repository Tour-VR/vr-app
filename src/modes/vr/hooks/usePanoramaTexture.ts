import { useEffect, useState } from 'react';
import { SRGBColorSpace, type Texture, TextureLoader } from 'three';
import { mediaSrc } from '../../../core/media';
import type { AsyncState } from '../../../core/types/async';

interface Settled {
  url: string;
  state: AsyncState<Texture>;
}

/**
 * Carrega o panorama equirretangular como textura. `url` nula (ponto sem panorama) vira
 * `not-found`. A textura e descartada (`dispose`) ao trocar de URL ou desmontar, para nao
 * acumular memoria de GPU quando o visitante passa de um ponto a outro (plano 021).
 */
export function usePanoramaTexture(url: string | null): AsyncState<Texture> {
  const [settled, setSettled] = useState<Settled | null>(null);

  useEffect(() => {
    if (url === null) return;
    let cancelled = false;
    let loaded: Texture | null = null;
    new TextureLoader().loadAsync(mediaSrc(url)).then(
      (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        loaded = texture;
        setSettled({ url, state: { status: 'success', data: texture } });
      },
      () => {
        if (!cancelled) setSettled({ url, state: { status: 'error' } });
      },
    );
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [url]);

  if (url === null) return { status: 'not-found' };
  return settled?.url === url ? settled.state : { status: 'loading' };
}
