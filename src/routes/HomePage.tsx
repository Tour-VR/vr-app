import { type ApiHealthState, useApiHealth } from '../core/hooks/useApiHealth';

const BADGES: Record<ApiHealthState, { label: string; className: string }> = {
  loading: { label: 'Verificando…', className: 'bg-gray-100 text-gray-700' },
  ok: { label: 'API conectada', className: 'bg-green-100 text-green-800' },
  error: { label: 'API indisponível', className: 'bg-red-100 text-red-800' },
};

/** Pagina inicial provisoria: confirma a conexao com a API ate a lista de pontos (plano 017). */
export function HomePage() {
  const badge = BADGES[useApiHealth()];

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10 text-base">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">TourVR</h1>
        <p className="text-gray-600">Tour do campus</p>
      </header>
      <p
        role="status"
        className={`self-start rounded-full px-3 py-1 text-base font-medium ${badge.className}`}
      >
        {badge.label}
      </p>
    </main>
  );
}
