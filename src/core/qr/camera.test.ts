import {
  CAMERA_MESSAGES,
  INSECURE_CONTEXT_ERROR,
  cameraErrorMessage,
  openRearCamera,
  stopStream,
} from './camera';

function setSecureContext(value: boolean) {
  Object.defineProperty(window, 'isSecureContext', { value, configurable: true });
}

describe('cameraErrorMessage', () => {
  it.each([
    [INSECURE_CONTEXT_ERROR, CAMERA_MESSAGES.insecure],
    ['NotAllowedError', CAMERA_MESSAGES.denied],
    ['SecurityError', CAMERA_MESSAGES.denied],
    ['NotFoundError', CAMERA_MESSAGES.notFound],
    ['OverconstrainedError', CAMERA_MESSAGES.notFound],
    ['NotReadableError', CAMERA_MESSAGES.busy],
    ['AbortError', CAMERA_MESSAGES.generic],
  ])('%s vira a mensagem certa', (name, message) => {
    expect(cameraErrorMessage(new DOMException('x', name))).toBe(message);
  });

  it('erro sem nome vira a mensagem generica', () => {
    expect(cameraErrorMessage('falhou')).toBe(CAMERA_MESSAGES.generic);
    expect(cameraErrorMessage(null)).toBe(CAMERA_MESSAGES.generic);
  });
});

describe('stopStream', () => {
  it('para todas as trilhas', () => {
    const tracks = [{ stop: vi.fn() }, { stop: vi.fn() }];
    stopStream({ getTracks: () => tracks } as unknown as MediaStream);

    for (const track of tracks) expect(track.stop).toHaveBeenCalled();
  });
});

describe('openRearCamera', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'mediaDevices');
  });

  it('pede a camera traseira em contexto seguro', async () => {
    setSecureContext(true);
    const stream = {} as MediaStream;
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia },
      configurable: true,
    });

    await expect(openRearCamera()).resolves.toBe(stream);
    expect(getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
      audio: false,
    });
  });

  it('rejeita com InsecureContextError fora de https', async () => {
    setSecureContext(false);

    await expect(openRearCamera()).rejects.toMatchObject({ name: INSECURE_CONTEXT_ERROR });
  });
});
