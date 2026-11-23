import { createNativeScanner } from './nativeScanner';

const detect = vi.fn();

class FakeDetector {
  detect = detect;
}

describe('createNativeScanner', () => {
  let frames: FrameRequestCallback[];

  beforeEach(() => {
    frames = [];
    vi.stubGlobal('BarcodeDetector', FakeDetector);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    detect.mockReset();
  });

  async function runFrame(now: number) {
    frames.shift()?.(now);
    await Promise.resolve();
    await Promise.resolve();
  }

  it('le no maximo a cada intervalo e entrega o texto lido', async () => {
    detect.mockResolvedValue([{ rawValue: 'https://x.com/p/abc' }]);
    const onResult = vi.fn();
    const scanner = createNativeScanner();
    await scanner.start(document.createElement('video'), onResult);

    await runFrame(1000);
    await runFrame(1100);
    expect(detect).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith('https://x.com/p/abc');

    await runFrame(1300);
    expect(detect).toHaveBeenCalledTimes(2);
  });

  it('ignora falha de leitura e para o laco no stop', async () => {
    detect.mockRejectedValue(new Error('sem quadro'));
    const onResult = vi.fn();
    const scanner = createNativeScanner();
    await scanner.start(document.createElement('video'), onResult);

    await runFrame(1000);
    scanner.stop();
    await runFrame(2000);

    expect(detect).toHaveBeenCalledTimes(1);
    expect(onResult).not.toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
