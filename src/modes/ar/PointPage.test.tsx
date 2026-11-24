import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fetchPublicPoint } from '../../core/api/points';
import { registerVisit } from '../../core/api/visits';
import type { PointDetail } from '../../core/types';
import { PointPage } from './PointPage';

vi.mock('../../core/api/points');
vi.mock('../../core/api/visits');

const POINT: PointDetail = {
  slug: 'biblioteca',
  name: 'Biblioteca Central',
  summary: 'Livros e estudo',
  history: 'Fundada em 1990.\n\nReformada em 2020.',
  media: [{ id: '1', kind: 'photo', url: '/media/a.jpg', caption: null, alt_text: 'Fachada' }],
  panorama_url: null,
  connections: [],
};

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/p/biblioteca']}>
      <Routes>
        <Route path="/p/:slug" element={<PointPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PointPage', () => {
  beforeEach(() => {
    vi.mocked(registerVisit).mockReset().mockResolvedValue(undefined);
  });

  it('mostra "Carregando" enquanto busca o ponto', () => {
    vi.mocked(fetchPublicPoint).mockReturnValue(new Promise(() => undefined));
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    expect(registerVisit).not.toHaveBeenCalled();
  });

  it('mostra o conteudo, registra a visita ar e ajusta o titulo', async () => {
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Biblioteca Central' })).toBeInTheDocument();
    expect(screen.getByText('Livros e estudo')).toBeInTheDocument();
    expect(screen.getByAltText('Fachada')).toBeInTheDocument();
    expect(screen.getByText('Reformada em 2020.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Conhecer outros pontos' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(fetchPublicPoint).toHaveBeenCalledWith('biblioteca');
    expect(registerVisit).toHaveBeenCalledExactlyOnceWith('biblioteca', 'ar');
    expect(document.title).toBe('Biblioteca Central · TourVR');
  });

  it('mostra a mensagem de ponto inexistente no 404', async () => {
    vi.mocked(fetchPublicPoint).mockRejectedValue(
      new AxiosError('404', undefined, undefined, undefined, { status: 404 } as AxiosResponse),
    );
    renderPage();

    expect(
      await screen.findByText('Este ponto não existe ou ainda não foi publicado.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todos os pontos' })).toHaveAttribute('href', '/');
    expect(registerVisit).not.toHaveBeenCalled();
  });

  it('mostra erro com "Tentar de novo" e recarrega', async () => {
    vi.mocked(fetchPublicPoint).mockRejectedValueOnce(new Error('rede'));
    renderPage();

    const retry = await screen.findByRole('button', { name: 'Tentar de novo' });
    vi.mocked(fetchPublicPoint).mockResolvedValueOnce(POINT);
    await userEvent.click(retry);

    expect(await screen.findByRole('heading', { name: 'Biblioteca Central' })).toBeInTheDocument();
  });
});
