import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { fetchApiHealth } from '../core/api/health';
import { fetchPublicPoints } from '../core/api/points';
import type { PointSummary } from '../core/types';
import { HomePage } from './HomePage';

vi.mock('../core/api/health');
vi.mock('../core/api/points');

const POINTS: PointSummary[] = [
  { slug: 'biblioteca', name: 'Biblioteca', summary: 'Livros', cover_url: '/media/capa.jpg' },
  { slug: 'cantina', name: 'Cantina', summary: 'Lanches', cover_url: null },
];

function renderHome() {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(fetchApiHealth).mockResolvedValue({} as never);
  });

  it('mostra o titulo e "Carregando" enquanto busca a lista', () => {
    vi.mocked(fetchPublicPoints).mockReturnValue(new Promise(() => undefined));
    renderHome();

    expect(screen.getByRole('heading', { name: 'TourVR · Tour do campus' })).toBeInTheDocument();
    expect(screen.getByText(/Escaneie o QR Code/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Escanear QR Code' })).toHaveAttribute('href', '/scan');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
  });

  it('lista os pontos com link para /p/<slug>', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue(POINTS);
    renderHome();

    const biblioteca = await screen.findByRole('link', { name: /Biblioteca/ });
    expect(biblioteca).toHaveAttribute('href', '/p/biblioteca');
    expect(screen.getByRole('link', { name: /Cantina/ })).toHaveAttribute('href', '/p/cantina');
    expect(biblioteca.querySelector('img')).toHaveAttribute('src', '/media/capa.jpg');
  });

  it('mostra a mensagem de lista vazia', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue([]);
    renderHome();

    expect(await screen.findByText('Nenhum ponto publicado ainda.')).toBeInTheDocument();
  });

  it('mostra erro com nova tentativa e o rodape quando a API cai', async () => {
    vi.mocked(fetchApiHealth).mockRejectedValue(new Error('rede'));
    vi.mocked(fetchPublicPoints).mockRejectedValueOnce(new Error('rede'));
    renderHome();

    expect(await screen.findByText('API indisponível no momento.')).toBeInTheDocument();
    vi.mocked(fetchPublicPoints).mockResolvedValueOnce(POINTS);
    await userEvent.click(await screen.findByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByRole('link', { name: /Cantina/ })).toBeInTheDocument();
  });

  it('nao mostra o rodape quando a API responde', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue([]);
    renderHome();

    await screen.findByText('Nenhum ponto publicado ainda.');
    expect(screen.queryByText('API indisponível no momento.')).not.toBeInTheDocument();
  });
});
