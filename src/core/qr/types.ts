export interface QrScanner {
  /** Comeca a ler do <video>; chama onResult a cada codigo detectado. */
  start(video: HTMLVideoElement, onResult: (text: string) => void): Promise<void>;
  stop(): void;
}
