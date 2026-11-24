import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { fetchPublicPoints } from '../../core/api/points';
import type { PointSummary } from '../../core/types';
import VrRoutes from './VrRoutes';

vi.mock('../../core/api/points');

const POINTS: PointSummary[] = [
  { slug: 'cantina', name: 'Cantina', summary: 'Lanches', cover_url: null, has_panorama: true },
  { slug: 'biblioteca', name: 'Biblioteca', summary: 'Livros', has_panorama: false },
];

// Renderiza pelas rotas do modo VR, como o AppRoutes faz sob `/vr/*`.
function renderList() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <VrRoutes />
    </MemoryRouter>,
  );
}

describe('VrListPage', () => {
  it('lista so os pontos com panorama, com link para /vr/<slug>', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue(POINTS);
    renderList();

    expect(screen.getByRole('heading', { name: 'Visita virtual 360°' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Cantina/ })).toHaveAttribute(
      'href',
      '/vr/cantina',
    );
    expect(screen.queryByRole('link', { name: /Biblioteca/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
  });

  it('mostra a mensagem de lista vazia', async () => {
    vi.mocked(fetchPublicPoints).mockResolvedValue([POINTS[1]]);
    renderList();

    expect(await screen.findByText('Nenhum ponto com visita 360° ainda.')).toBeInTheDocument();
  });

  it('mostra erro com nova tentativa', async () => {
    vi.mocked(fetchPublicPoints).mockRejectedValueOnce(new Error('rede'));
    renderList();

    vi.mocked(fetchPublicPoints).mockResolvedValueOnce(POINTS);
    await userEvent.click(await screen.findByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByRole('link', { name: /Cantina/ })).toBeInTheDocument();
  });
});
