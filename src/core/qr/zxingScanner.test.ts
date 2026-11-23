import { BrowserQRCodeReader } from '@zxing/browser';
import { createZxingScanner } from './zxingScanner';

vi.mock('@zxing/browser', () => ({ BrowserQRCodeReader: vi.fn() }));

type Callback = (result: { getText: () => string } | undefined) => void;

function mockReader() {
  const controlsStop = vi.fn();
  let callback: Callback = () => undefined;
  let resolveStart: (value: { stop: () => void }) => void = () => undefined;
  const decodeFromVideoElement = vi.fn((_video: HTMLVideoElement, cb: Callback) => {
    callback = cb;
    return new Promise((resolve) => {
      resolveStart = resolve;
    });
  });
  vi.mocked(BrowserQRCodeReader).mockImplementation(function () {
    return { decodeFromVideoElement } as never;
  });
  return {
    emit: (text?: string) => {
      callback(text === undefined ? undefined : { getText: () => text });
    },
    finishStart: () => {
      resolveStart({ stop: controlsStop });
    },
    controlsStop,
  };
}

describe('createZxingScanner', () => {
  it('entrega o texto lido e para os controles no stop', async () => {
    const reader = mockReader();
    const onResult = vi.fn();
    const scanner = createZxingScanner();
    const started = scanner.start(document.createElement('video'), onResult);
    reader.finishStart();
    await started;

    reader.emit();
    reader.emit('https://x.com/p/abc');
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith('https://x.com/p/abc');

    scanner.stop();
    reader.emit('depois');
    expect(reader.controlsStop).toHaveBeenCalled();
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('encerra o laco quando stop chega antes do inicio terminar', async () => {
    const reader = mockReader();
    const scanner = createZxingScanner();
    const started = scanner.start(document.createElement('video'), vi.fn());
    scanner.stop();
    reader.finishStart();
    await started;

    expect(reader.controlsStop).toHaveBeenCalledTimes(1);
  });
});
