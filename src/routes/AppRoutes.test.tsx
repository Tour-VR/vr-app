import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { fetchApiHealth } from '../core/api/health';
import { fetchPublicPoint, fetchPublicPoints } from '../core/api/points';
import { AppRoutes } from './AppRoutes';

vi.mock('../core/api/health');
vi.mock('../core/api/points');

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('renderiza a pagina inicial em /', () => {
    vi.mocked(fetchApiHealth).mockReturnValue(new Promise(() => undefined));
    vi.mocked(fetchPublicPoints).mockReturnValue(new Promise(() => undefined));
    renderAt('/');

    expect(screen.getByRole('heading', { name: 'TourVR · Tour do campus' })).toBeInTheDocument();
  });

  it('renderiza a pagina do ponto em /p/:slug', () => {
    vi.mocked(fetchPublicPoint).mockReturnValue(new Promise(() => undefined));
    renderAt('/p/biblioteca');

    expect(fetchPublicPoint).toHaveBeenCalledWith('biblioteca');
  });

  it('renderiza o leitor de QR em /scan', () => {
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });
    renderAt('/scan');

    expect(screen.getByRole('heading', { name: 'Escanear QR Code' })).toBeInTheDocument();
  });

  it('renderiza "Página não encontrada" em rota desconhecida', () => {
    renderAt('/rota-que-nao-existe');

    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
  });
});
