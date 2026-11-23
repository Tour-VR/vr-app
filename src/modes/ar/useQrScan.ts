import { type RefObject, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INVALID_QR_NOTICE_MS } from '../../core/constants/qr';
import { ROUTES } from '../../core/constants/routes';
import {
  CAMERA_MESSAGES,
  cameraErrorMessage,
  openRearCamera,
  stopStream,
} from '../../core/qr/camera';
import { createQrScanner } from '../../core/qr/createQrScanner';
import { parseTourUrl } from '../../core/qr/parseTourUrl';
import type { QrScanner } from '../../core/qr/types';

/** Recursos abertos por uma montagem da pagina; todos sao liberados em `closeSession`. */
interface ScanSession {
  closed: boolean;
  stream: MediaStream | null;
  scanner: QrScanner | null;
  noticeTimer: number | undefined;
}

/** Le o estado atual: depois de um `await`, a sessao pode ter sido fechada pela desmontagem. */
function isClosed(session: ScanSession): boolean {
  return session.closed;
}

function closeSession(session: ScanSession) {
  session.closed = true;
  session.scanner?.stop();
  if (session.stream) stopStream(session.stream);
  window.clearTimeout(session.noticeTimer);
}

/** Abre a camera e o leitor. Se a sessao fechar no meio, libera o que acabou de abrir. */
async function openSession(
  session: ScanSession,
  video: HTMLVideoElement,
  onText: (text: string) => void,
) {
  const stream = await openRearCamera();
  session.stream = stream;
  if (isClosed(session)) {
    stopStream(stream);
    return;
  }
  video.srcObject = stream;
  const scanner = await createQrScanner();
  session.scanner = scanner;
  if (isClosed(session)) {
    scanner.stop();
    return;
  }
  await scanner.start(video, onText);
}

export interface QrScanState {
  /** Mensagem de erro da camera; null enquanto a leitura funciona. */
  error: string | null;
  /** true por alguns segundos depois de ler um QR que nao e do tour. */
  invalid: boolean;
}

/**
 * Le QR Codes do `<video>` e navega para a pagina do ponto. A camera e o leitor sao
 * desligados em qualquer saida: leitura valida, erro ou desmontagem.
 */
export function useQrScan(videoRef: RefObject<HTMLVideoElement | null>): QrScanState {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(() =>
    window.isSecureContext ? null : CAMERA_MESSAGES.insecure,
  );
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!window.isSecureContext || !video) return;
    const session: ScanSession = {
      closed: false,
      stream: null,
      scanner: null,
      noticeTimer: undefined,
    };

    const onText = (text: string) => {
      if (session.closed) return;
      const slug = parseTourUrl(text);
      if (slug !== null) {
        closeSession(session);
        void navigate(ROUTES.point(slug));
        return;
      }
      setInvalid(true);
      window.clearTimeout(session.noticeTimer);
      session.noticeTimer = window.setTimeout(() => {
        setInvalid(false);
      }, INVALID_QR_NOTICE_MS);
    };

    openSession(session, video, onText).catch((cause: unknown) => {
      if (session.closed) return;
      closeSession(session);
      setError(cameraErrorMessage(cause));
    });
    return () => {
      closeSession(session);
    };
  }, [navigate, videoRef]);

  return { error, invalid };
}
