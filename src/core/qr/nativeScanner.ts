import { SCAN_INTERVAL_MS } from '../constants/qr';
import type { QrScanner } from './types';

/** Leitor com o `BarcodeDetector` do navegador (Chrome no Android). */
export function createNativeScanner(): QrScanner {
  const detector = new BarcodeDetector({ formats: ['qr_code'] });
  let running = false;
  let busy = false;
  let frame = 0;
  let lastScan = Number.NEGATIVE_INFINITY;

  async function detectOnce(video: HTMLVideoElement, onResult: (text: string) => void) {
    busy = true;
    try {
      const codes = await detector.detect(video);
      for (const code of codes) {
        if (running) onResult(code.rawValue);
      }
    } catch {
      // Video ainda sem quadro (antes de tocar): tenta de novo no proximo intervalo.
    } finally {
      busy = false;
    }
  }

  return {
    start(video, onResult) {
      running = true;
      const loop = (now: number) => {
        if (!running) return;
        if (!busy && now - lastScan >= SCAN_INTERVAL_MS) {
          lastScan = now;
          void detectOnce(video, onResult);
        }
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
      return Promise.resolve();
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
  };
}
