// Tipo minimo da Barcode Detection API: nao existe nos tipos do DOM do TypeScript 5.8.
// https://developer.mozilla.org/docs/Web/API/BarcodeDetector

interface DetectedBarcode {
  rawValue: string;
}

interface BarcodeDetectorOptions {
  formats?: string[];
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
}
