export const PANORAMA_RADIUS = 500;
export const PANORAMA_WIDTH_SEGMENTS = 60;
export const PANORAMA_HEIGHT_SEGMENTS = 40;
/** Coloca o centro da imagem equirretangular a frente da camera inicial (-Z). */
export const PANORAMA_ROTATION_Y = -Math.PI / 2;
/** Pequeno recuo em Z: o OrbitControls precisa de distancia nao nula ate o alvo (origem). */
const CAMERA_START_Z = 0.1;
export const CAMERA_START: [number, number, number] = [0, 0, CAMERA_START_Z];
export const CAMERA_FOV = 75;
export const ORBIT_ROTATE_SPEED = -0.4;
export const INFO_PANEL_DISTANCE = 2;
export const INFO_PANEL_HEIGHT = -0.3;
/** Medidas do painel 3D, em metros: plano de 1,6 x 0,7 com margem de 0,08 para o texto. */
export const INFO_PANEL_STYLE = {
  width: 1.6,
  height: 0.7,
  opacity: 0.75,
  textX: -0.72,
  textZ: 0.01,
  textWidth: 1.44,
  titleY: 0.27,
  titleSize: 0.09,
  summaryY: 0.12,
  summarySize: 0.055,
} as const;
