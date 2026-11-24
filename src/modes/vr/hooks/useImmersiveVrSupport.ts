import { useEffect, useState } from 'react';

/**
 * Diz se o navegador abre sessao `immersive-vr` (WebXR). `null` enquanto verifica; sem
 * `navigator.xr` ou com erro na consulta, `false`: o botao "Entrar em VR" nao aparece.
 */
export function useImmersiveVrSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const check = navigator.xr
      ? navigator.xr.isSessionSupported('immersive-vr')
      : Promise.resolve(false);
    check.then(
      (value) => {
        if (active) setSupported(value);
      },
      () => {
        if (active) setSupported(false);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return supported;
}
