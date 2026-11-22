import { render, screen } from '@testing-library/react';
import App from './App';
import { fetchApiHealth } from './core/api/health';

vi.mock('./core/api/health');

describe('App', () => {
  it('monta o roteador e abre a pagina inicial', () => {
    vi.mocked(fetchApiHealth).mockReturnValue(new Promise(() => undefined));
    render(<App />);

    expect(screen.getByRole('heading', { name: 'TourVR' })).toBeInTheDocument();
  });
});
