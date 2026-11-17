import { render, screen } from '@testing-library/react';
import { fetchApiHealth } from '../core/api/health';
import { HomePage } from './HomePage';

vi.mock('../core/api/health');

describe('HomePage', () => {
  it('mostra o titulo e "Verificando" enquanto consulta a API', () => {
    vi.mocked(fetchApiHealth).mockReturnValue(new Promise(() => undefined));
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: 'TourVR' })).toBeInTheDocument();
    expect(screen.getByText('Tour do campus')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Verificando');
  });

  it('mostra "API conectada" quando a API responde', async () => {
    vi.mocked(fetchApiHealth).mockResolvedValue({} as never);
    render(<HomePage />);

    expect(await screen.findByText('API conectada')).toBeInTheDocument();
  });

  it('mostra "API indisponível" quando a API falha', async () => {
    vi.mocked(fetchApiHealth).mockRejectedValue(new Error('rede'));
    render(<HomePage />);

    expect(await screen.findByText('API indisponível')).toBeInTheDocument();
  });
});
