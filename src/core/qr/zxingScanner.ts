import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import type { QrScanner } from './types';

/** Leitor com `@zxing/browser`, para navegadores sem `BarcodeDetector` (Safari, Firefox). */
export function createZxingScanner(): QrScanner {
  const reader = new BrowserQRCodeReader();
  let controls: IScannerControls | null = null;
  // Cada start() abre uma sessao; stop() a invalida, mesmo que o zxing ainda esteja iniciando.
  let session = 0;

  return {
    async start(video, onResult) {
      const current = ++session;
      const started = await reader.decodeFromVideoElement(video, (result) => {
        if (result && current === session) onResult(result.getText());
      });
      if (current !== session) {
        started.stop();
        return;
      }
      controls = started;
    },
    stop() {
      session++;
      controls?.stop();
      controls = null;
    },
  };
}
