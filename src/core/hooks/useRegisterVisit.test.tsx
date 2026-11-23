import { renderHook, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { registerVisit } from '../api/visits';
import { useRegisterVisit } from './useRegisterVisit';

vi.mock('../api/visits');

describe('useRegisterVisit', () => {
  beforeEach(() => {
    vi.mocked(registerVisit).mockReset().mockResolvedValue(undefined);
  });

  it('registra uma unica vez mesmo com renderizacoes repetidas e StrictMode', () => {
    const { rerender } = renderHook(
      () => {
        useRegisterVisit('biblioteca', 'ar', true);
      },
      { wrapper: StrictMode },
    );
    rerender();

    expect(registerVisit).toHaveBeenCalledTimes(1);
    expect(registerVisit).toHaveBeenCalledWith('biblioteca', 'ar');
  });

  it('nao registra enquanto ready e falso nem sem slug', () => {
    renderHook(() => {
      useRegisterVisit('biblioteca', 'ar', false);
    });
    renderHook(() => {
      useRegisterVisit(undefined, 'ar', true);
    });

    expect(registerVisit).not.toHaveBeenCalled();
  });

  it('registra de novo quando o slug muda', () => {
    const { rerender } = renderHook(
      ({ slug }) => {
        useRegisterVisit(slug, 'ar', true);
      },
      { initialProps: { slug: 'a' } },
    );
    rerender({ slug: 'b' });

    expect(registerVisit).toHaveBeenCalledTimes(2);
  });

  it('falha ao registrar so gera aviso, sem lancar', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.mocked(registerVisit).mockRejectedValue(new Error('rede'));

    expect(() =>
      renderHook(() => {
        useRegisterVisit('biblioteca', 'ar', true);
      }),
    ).not.toThrow();
    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith('Nao foi possivel registrar a visita.', expect.any(Error));
    });
    warn.mockRestore();
  });
});
