import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { fetchApiHealth } from '../core/api/health';
import { AppRoutes } from './AppRoutes';

vi.mock('../core/api/health');

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
    renderAt('/');

    expect(screen.getByRole('heading', { name: 'TourVR' })).toBeInTheDocument();
  });

  it('renderiza "Página não encontrada" em rota desconhecida', () => {
    renderAt('/rota-que-nao-existe');

    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
  });
});
