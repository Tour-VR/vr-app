import { createNativeScanner } from './nativeScanner';
import type { QrScanner } from './types';

/** Escolhe o leitor: nativo quando existe; senao, baixa o zxing sob demanda. */
export async function createQrScanner(): Promise<QrScanner> {
  if ('BarcodeDetector' in window) {
    if (import.meta.env.DEV) console.info('[qr] leitor: nativo (BarcodeDetector)');
    return createNativeScanner();
  }
  const { createZxingScanner } = await import('./zxingScanner');
  if (import.meta.env.DEV) console.info('[qr] leitor: zxing');
  return createZxingScanner();
}
