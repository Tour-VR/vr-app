import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CAMERA_MESSAGES, openRearCamera, stopStream } from '../../core/qr/camera';
import { createQrScanner } from '../../core/qr/createQrScanner';
import { useQrScan } from './useQrScan';

vi.mock('../../core/qr/camera', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../core/qr/camera')>()),
  openRearCamera: vi.fn(),
  stopStream: vi.fn(),
}));
vi.mock('../../core/qr/createQrScanner');

const STREAM = { id: 'stream' } as unknown as MediaStream;

function Probe() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { error, invalid } = useQrScan(videoRef);
  return (
    <>
      <video ref={videoRef} />
      <p>erro: {error ?? '-'}</p>
      <p>invalido: {String(invalid)}</p>
    </>
  );
}

function renderProbe() {
  return render(
    <MemoryRouter initialEntries={['/scan']}>
      <Routes>
        <Route path="/scan" element={<Probe />} />
        <Route path="/p/:slug" element={<h1>pagina do ponto</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function mockScanner() {
  let emit: (text: string) => void = () => undefined;
  const scanner = {
    start: vi.fn((_video: HTMLVideoElement, onResult: (text: string) => void) => {
      emit = onResult;
      return Promise.resolve();
    }),
    stop: vi.fn(),
  };
  vi.mocked(createQrScanner).mockResolvedValue(scanner);
  return {
    scanner,
    emit: (text: string) => {
      emit(text);
    },
  };
}

describe('useQrScan', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    vi.mocked(openRearCamera).mockResolvedValue(STREAM);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('leitura valida para camera e leitor e navega ao ponto', async () => {
    const { scanner, emit } = mockScanner();
    renderProbe();
    await vi.waitFor(() => {
      expect(scanner.start).toHaveBeenCalled();
    });

    act(() => {
      emit('https://10.0.0.5:3001/p/biblioteca-central');
    });

    expect(await screen.findByRole('heading', { name: 'pagina do ponto' })).toBeInTheDocument();
    expect(scanner.stop).toHaveBeenCalled();
    expect(stopStream).toHaveBeenCalledWith(STREAM);
  });

  it('leitura invalida mostra o aviso por 3 s e continua lendo', async () => {
    const { scanner, emit } = mockScanner();
    renderProbe();
    await vi.waitFor(() => {
      expect(scanner.start).toHaveBeenCalled();
    });
    vi.useFakeTimers();

    act(() => {
      emit('https://loja.com/produto/123');
    });
    expect(screen.getByText('invalido: true')).toBeInTheDocument();
    act(() => {
      emit('outro texto');
    });
    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(screen.getByText('invalido: false')).toBeInTheDocument();
    expect(scanner.stop).not.toHaveBeenCalled();
    expect(stopStream).not.toHaveBeenCalled();
  });

  it('desmontar para o leitor e a camera', async () => {
    const { scanner } = mockScanner();
    const { unmount } = renderProbe();
    await vi.waitFor(() => {
      expect(scanner.start).toHaveBeenCalled();
    });

    unmount();

    expect(scanner.stop).toHaveBeenCalled();
    expect(stopStream).toHaveBeenCalledWith(STREAM);
  });

  it('desmontar antes da camera abrir desliga a camera quando ela chega', async () => {
    let resolveCamera: (stream: MediaStream) => void = () => undefined;
    vi.mocked(openRearCamera).mockReturnValue(
      new Promise((resolve) => {
        resolveCamera = resolve;
      }),
    );
    const { unmount } = renderProbe();

    unmount();
    resolveCamera(STREAM);

    await vi.waitFor(() => {
      expect(stopStream).toHaveBeenCalledWith(STREAM);
    });
    expect(createQrScanner).not.toHaveBeenCalled();
  });

  it('desmontar enquanto o leitor carrega para o leitor quando ele chega', async () => {
    const scanner = { start: vi.fn(), stop: vi.fn() };
    let resolveScanner: (value: typeof scanner) => void = () => undefined;
    vi.mocked(createQrScanner).mockReturnValue(
      new Promise((resolve) => {
        resolveScanner = resolve;
      }),
    );
    const { unmount } = renderProbe();
    await vi.waitFor(() => {
      expect(createQrScanner).toHaveBeenCalled();
    });

    unmount();
    resolveScanner(scanner);

    await vi.waitFor(() => {
      expect(scanner.stop).toHaveBeenCalled();
    });
    expect(scanner.start).not.toHaveBeenCalled();
  });

  it('permissao negada vira mensagem de erro', async () => {
    vi.mocked(openRearCamera).mockRejectedValue(new DOMException('x', 'NotAllowedError'));
    renderProbe();

    expect(await screen.findByText(`erro: ${CAMERA_MESSAGES.denied}`)).toBeInTheDocument();
  });

  it('erro depois de desmontar e ignorado', async () => {
    let rejectCamera: (error: Error) => void = () => undefined;
    vi.mocked(openRearCamera).mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectCamera = reject;
      }),
    );
    const { unmount } = renderProbe();

    unmount();
    rejectCamera(new DOMException('x', 'NotAllowedError'));

    await Promise.resolve();
    expect(stopStream).not.toHaveBeenCalled();
  });
});
