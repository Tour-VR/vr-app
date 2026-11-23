import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../core/constants/routes';
import { CAMERA_FALLBACK_HINT } from '../../core/qr/camera';
import { useQrScan } from './useQrScan';

export const INVALID_QR_MESSAGE = 'Este QR Code não é de um ponto do tour.';

function ScanError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex flex-col gap-2 rounded-lg bg-amber-50 p-4 text-amber-900">
      <p className="font-semibold">{message}</p>
      <p>{CAMERA_FALLBACK_HINT}</p>
    </div>
  );
}

/** Pagina /scan: le o QR Code do local com a camera traseira e abre o ponto. */
export function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { error, invalid } = useQrScan(videoRef);

  return (
    <main className="mx-auto flex max-w-prose flex-col gap-4 px-4 py-6 text-base">
      <h1 className="text-2xl font-bold text-gray-900">Escanear QR Code</h1>
      {error ? (
        <ScanError message={error} />
      ) : (
        <>
          <div className="relative overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              className="block aspect-square w-full object-cover"
              playsInline
              muted
              autoPlay
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[15%] rounded-lg border-4 border-white/90"
            />
          </div>
          <p className="text-center text-gray-700">Aponte para o QR Code do local</p>
          <p role="status" className="min-h-6 text-center font-semibold text-amber-800">
            {invalid ? INVALID_QR_MESSAGE : ''}
          </p>
        </>
      )}
      <Link
        to={ROUTES.home}
        className="self-start rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
      >
        Voltar
      </Link>
    </main>
  );
}
