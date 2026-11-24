import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Texture } from 'three';
import { fetchPublicPoint } from '../../core/api/points';
import { registerVisit } from '../../core/api/visits';
import type { PointDetail } from '../../core/types';
import { useImmersiveVrSupport } from './hooks/useImmersiveVrSupport';
import { usePanoramaTexture } from './hooks/usePanoramaTexture';
import { VrPointPage } from './VrPointPage';

vi.mock('../../core/api/points');
vi.mock('../../core/api/visits');
vi.mock('./hooks/usePanoramaTexture');
vi.mock('./hooks/useImmersiveVrSupport');
const enterVR = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock('./scene/VrCanvas', () => ({
  VrCanvas: () => <div data-testid="vr-canvas" />,
  xrStore: { enterVR },
}));

const TEXTURE = new Texture();
const POINT: PointDetail = {
  slug: 'biblioteca',
  name: 'Biblioteca Central',
  summary: 'Livros e estudo',
  history: 'Historia.',
  media: [],
  panorama_url: '/media/360.jpg',
  connections: [],
};

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/vr/biblioteca']}>
      <Routes>
        <Route path="/vr/:slug" element={<VrPointPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('VrPointPage', () => {
  beforeEach(() => {
    vi.mocked(registerVisit).mockReset().mockResolvedValue(undefined);
    vi.mocked(useImmersiveVrSupport).mockReturnValue(false);
    vi.mocked(usePanoramaTexture).mockReturnValue({ status: 'success', data: TEXTURE });
  });

  it('mostra "Carregando" enquanto busca o ponto', () => {
    vi.mocked(fetchPublicPoint).mockReturnValue(new Promise(() => undefined));
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
  });

  it('mostra a cena, o painel e registra a visita vr apos a textura', async () => {
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    expect(await screen.findByTestId('vr-canvas')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Biblioteca Central' })).toBeInTheDocument();
    expect(screen.getByText('Arraste para olhar em volta.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar à lista' })).toHaveAttribute('href', '/vr');
    expect(usePanoramaTexture).toHaveBeenCalledWith('/media/360.jpg');
    expect(registerVisit).toHaveBeenCalledExactlyOnceWith('biblioteca', 'vr');
  });

  it('nao registra visita enquanto a textura carrega', async () => {
    vi.mocked(usePanoramaTexture).mockReturnValue({ status: 'loading' });
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    await screen.findByRole('status');
    expect(screen.queryByTestId('vr-canvas')).not.toBeInTheDocument();
    expect(registerVisit).not.toHaveBeenCalled();
  });

  it('esconde o botao Entrar em VR sem suporte a WebXR', async () => {
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    await screen.findByTestId('vr-canvas');
    expect(screen.queryByRole('button', { name: 'Entrar em VR' })).not.toBeInTheDocument();
  });

  it('mostra o botao Entrar em VR com suporte e abre a sessao', async () => {
    vi.mocked(useImmersiveVrSupport).mockReturnValue(true);
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Entrar em VR' }));
    expect(enterVR).toHaveBeenCalledTimes(1);
  });

  it('recolhe e mostra de novo as informacoes', async () => {
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Ocultar informações' }));
    expect(screen.queryByRole('heading', { name: 'Biblioteca Central' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar informações' }));
    expect(screen.getByRole('heading', { name: 'Biblioteca Central' })).toBeInTheDocument();
  });

  it('sem panorama mostra a mensagem e o link para /p/<slug>', async () => {
    vi.mocked(usePanoramaTexture).mockReturnValue({ status: 'not-found' });
    vi.mocked(fetchPublicPoint).mockResolvedValue({ ...POINT, panorama_url: null });
    renderPage();

    expect(await screen.findByText('Este ponto ainda não tem visita 360°.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver a página do ponto' })).toHaveAttribute(
      'href',
      '/p/biblioteca',
    );
    expect(registerVisit).not.toHaveBeenCalled();
  });

  it('erro no panorama mostra a mensagem e tenta de novo', async () => {
    vi.mocked(usePanoramaTexture).mockReturnValue({ status: 'error' });
    vi.mocked(fetchPublicPoint).mockResolvedValue(POINT);
    renderPage();

    expect(await screen.findByText('Não foi possível carregar o panorama.')).toBeInTheDocument();
    vi.mocked(usePanoramaTexture).mockReturnValue({ status: 'success', data: TEXTURE });
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByTestId('vr-canvas')).toBeInTheDocument();
  });

  it('ponto inexistente mostra a mensagem do nucleo', async () => {
    const response = { status: 404 } as AxiosResponse;
    vi.mocked(fetchPublicPoint).mockRejectedValue(
      new AxiosError('404', undefined, undefined, undefined, response),
    );
    renderPage();

    expect(await screen.findByText(/Este ponto não existe/)).toBeInTheDocument();
  });

  it('erro de rede mostra ErrorState com nova tentativa', async () => {
    vi.mocked(fetchPublicPoint).mockRejectedValueOnce(new Error('rede'));
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar de novo' }));
    expect(fetchPublicPoint).toHaveBeenCalledTimes(2);
  });
});
