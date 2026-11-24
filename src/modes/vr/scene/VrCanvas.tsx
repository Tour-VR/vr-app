import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore, useXR } from '@react-three/xr';
import type { Texture } from 'three';
import { CAMERA_FOV, CAMERA_START, ORBIT_ROTATE_SPEED } from '../constants';
import { InfoPanel3D } from './InfoPanel3D';
import { PanoramaSphere } from './PanoramaSphere';

/**
 * Sessao WebXR da cena. `emulate: false` desliga o emulador de Quest que a biblioteca
 * injeta em localhost: sem ele, o botao "Entrar em VR" so aparece com WebXR de verdade.
 */
export const xrStore = createXRStore({ emulate: false });

interface VrCanvasProps {
  texture: Texture;
  name: string;
  summary: string;
}

/** Arrastar para olhar em volta, so fora do VR: dentro dele, a cabeca controla a camera. */
function LookAroundControls() {
  const session = useXR((state) => state.session);
  if (session) return null;
  return <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={ORBIT_ROTATE_SPEED} />;
}

export function VrCanvas({ texture, name, summary }: VrCanvasProps) {
  return (
    <Canvas camera={{ position: CAMERA_START, fov: CAMERA_FOV }} data-testid="vr-canvas">
      <XR store={xrStore}>
        <PanoramaSphere texture={texture} />
        <InfoPanel3D name={name} summary={summary} />
        <LookAroundControls />
      </XR>
    </Canvas>
  );
}
