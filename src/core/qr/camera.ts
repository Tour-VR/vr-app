/** Nome do erro lancado quando a pagina nao esta em contexto seguro (https ou localhost). */
export const INSECURE_CONTEXT_ERROR = 'InsecureContextError';

export const CAMERA_MESSAGES = {
  insecure: 'A câmera só funciona em endereço https.',
  denied:
    'O acesso à câmera foi negado. Libere a câmera para este site nas configurações do navegador e recarregue a página.',
  notFound: 'Nenhuma câmera foi encontrada neste aparelho.',
  busy: 'A câmera está sendo usada por outro aplicativo. Feche-o e tente de novo.',
  generic: 'Não foi possível abrir a câmera.',
} as const;

/** Lembrete exibido junto de qualquer erro: o QR contem uma URL comum. */
export const CAMERA_FALLBACK_HINT =
  'Você também pode ler o QR Code com a câmera do próprio celular, sem o app.';

/** Abre a camera traseira. Rejeita com `InsecureContextError` fora de contexto seguro. */
export function openRearCamera(): Promise<MediaStream> {
  if (!window.isSecureContext || !('mediaDevices' in navigator)) {
    return Promise.reject(new DOMException(CAMERA_MESSAGES.insecure, INSECURE_CONTEXT_ERROR));
  }
  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false,
  });
}

/** Para todas as trilhas do stream: a luz da camera apaga. */
export function stopStream(stream: MediaStream): void {
  for (const track of stream.getTracks()) track.stop();
}

function errorName(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'name' in error) {
    return String(error.name);
  }
  return '';
}

/** Traduz o erro de `getUserMedia` em mensagem para o visitante. */
export function cameraErrorMessage(error: unknown): string {
  switch (errorName(error)) {
    case INSECURE_CONTEXT_ERROR:
      return CAMERA_MESSAGES.insecure;
    case 'NotAllowedError':
    case 'SecurityError':
      return CAMERA_MESSAGES.denied;
    case 'NotFoundError':
    case 'OverconstrainedError':
      return CAMERA_MESSAGES.notFound;
    case 'NotReadableError':
      return CAMERA_MESSAGES.busy;
    default:
      return CAMERA_MESSAGES.generic;
  }
}
