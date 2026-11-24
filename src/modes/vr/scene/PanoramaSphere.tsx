import { useEffect, useMemo } from 'react';
import { SphereGeometry, type Texture } from 'three';
import {
  PANORAMA_HEIGHT_SEGMENTS,
  PANORAMA_RADIUS,
  PANORAMA_ROTATION_Y,
  PANORAMA_WIDTH_SEGMENTS,
} from '../constants';

interface PanoramaSphereProps {
  texture: Texture;
}

/** Esfera vista por dentro: escala -1 em X desespelha a imagem; a rotacao poe o centro a frente. */
export function PanoramaSphere({ texture }: PanoramaSphereProps) {
  const geometry = useMemo(() => {
    const sphere = new SphereGeometry(
      PANORAMA_RADIUS,
      PANORAMA_WIDTH_SEGMENTS,
      PANORAMA_HEIGHT_SEGMENTS,
    );
    sphere.scale(-1, 1, 1);
    return sphere;
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );

  return (
    <mesh geometry={geometry} rotation-y={PANORAMA_ROTATION_Y}>
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
