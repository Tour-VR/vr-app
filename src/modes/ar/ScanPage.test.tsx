import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CAMERA_FALLBACK_HINT, CAMERA_MESSAGES } from '../../core/qr/camera';
import { createQrScanner } from '../../core/qr/createQrScanner';
import { ScanPage } from './ScanPage';

vi.mock('../../core/qr/createQrScanner');

function setSecureContext(value: boolean) {
  Object.defineProperty(window, 'isSecureContext', { value, configurable: true });
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/scan']}>
      <ScanPage />
    </MemoryRouter>,
  );
}

describe('ScanPage', () => {
  const getUserMedia = vi.fn();

  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia },
      configurable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'mediaDevices');
    vi.clearAllMocks();
  });

  it('sem contexto seguro explica o https e nao abre a camera', () => {
    setSecureContext(false);
    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(CAMERA_MESSAGES.insecure);
    expect(screen.getByText(CAMERA_FALLBACK_HINT)).toBeInTheDocument();
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/');
  });

  it('em contexto seguro mostra o video, a mira e a instrucao', async () => {
    setSecureContext(true);
    getUserMedia.mockResolvedValue({ getTracks: () => [] });
    vi.mocked(createQrScanner).mockResolvedValue({ start: vi.fn(), stop: vi.fn() });
    renderPage();

    expect(screen.getByRole('heading', { name: 'Escanear QR Code' })).toBeInTheDocument();
    expect(screen.getByText('Aponte para o QR Code do local')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await vi.waitFor(() => {
      expect(getUserMedia).toHaveBeenCalled();
    });
  });

  it('permissao negada mostra a instrucao de liberar a camera', async () => {
    setSecureContext(true);
    getUserMedia.mockRejectedValue(new DOMException('x', 'NotAllowedError'));
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(CAMERA_MESSAGES.denied);
  });
});
