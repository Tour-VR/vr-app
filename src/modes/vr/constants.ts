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
