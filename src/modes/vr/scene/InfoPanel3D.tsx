import { Text } from '@react-three/drei';
import { useXR } from '@react-three/xr';
import { INFO_PANEL_DISTANCE, INFO_PANEL_HEIGHT, INFO_PANEL_STYLE as S } from '../constants';

interface InfoPanel3DProps {
  name: string;
  summary: string;
}

/** Nome e resumo do ponto a frente do visitante; so existe durante a sessao imersiva. */
export function InfoPanel3D({ name, summary }: InfoPanel3DProps) {
  const session = useXR((state) => state.session);
  if (!session) return null;

  return (
    <group position={[0, INFO_PANEL_HEIGHT, -INFO_PANEL_DISTANCE]}>
      <mesh>
        <planeGeometry args={[S.width, S.height]} />
        <meshBasicMaterial color="black" transparent opacity={S.opacity} />
      </mesh>
      <Text
        position={[S.textX, S.titleY, S.textZ]}
        anchorX="left"
        anchorY="top"
        fontSize={S.titleSize}
        maxWidth={S.textWidth}
        color="white"
      >
        {name}
      </Text>
      <Text
        position={[S.textX, S.summaryY, S.textZ]}
        anchorX="left"
        anchorY="top"
        fontSize={S.summarySize}
        maxWidth={S.textWidth}
        color="white"
      >
        {summary}
      </Text>
    </group>
  );
}
