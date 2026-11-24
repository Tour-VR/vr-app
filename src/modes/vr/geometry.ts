const HALF_TURN_DEGREES = 180;
const DEGREES_TO_RADIANS = Math.PI / HALF_TURN_DEGREES;

/** Converte o angulo da conexao (plano 019) em posicao na cena. 0 = frente, positivo = direita. */
export function yawToPosition(
  yawDegrees: number,
  radius: number,
  height: number,
): [number, number, number] {
  const yaw = yawDegrees * DEGREES_TO_RADIANS;
  return [radius * Math.sin(yaw), height, -radius * Math.cos(yaw)];
}

/** Rotacao em Y para um objeto na posicao do yaw ficar de frente para o centro. */
export function facingCenterRotationY(yawDegrees: number): number {
  return -yawDegrees * DEGREES_TO_RADIANS;
}
