import { useApiHealth } from '../hooks/useApiHealth';

/** Rodape discreto que so aparece quando a API nao responde (`GET /health/`). */
export function ApiStatusFooter() {
  if (useApiHealth() !== 'error') return null;

  return (
    <footer role="status" className="px-4 py-3 text-center text-base text-red-800">
      API indisponível no momento.
    </footer>
  );
}
