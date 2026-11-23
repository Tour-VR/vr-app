import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { PointContent } from './PointContent';
import { PointHeader } from './PointHeader';

describe('componentes de conteudo do ponto', () => {
  it('PointHeader mostra nome como h1 e resumo', () => {
    render(<PointHeader name="Biblioteca" summary="Livros e estudo" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Biblioteca' })).toBeInTheDocument();
    expect(screen.getByText('Livros e estudo')).toBeInTheDocument();
  });

  it('PointContent mostra a secao Historia com um paragrafo por bloco', () => {
    render(<PointContent history={'Primeiro.\n\n<b>Segundo</b>'} />);

    expect(screen.getByRole('heading', { name: 'História' })).toBeInTheDocument();
    expect(screen.getByText('Primeiro.')).toBeInTheDocument();
    expect(screen.getByText('<b>Segundo</b>')).toBeInTheDocument();
  });

  it('LoadingState mostra "Carregando"', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
  });

  it('ErrorState chama onRetry no botao', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
