import { Link } from 'react-router-dom';
import { ApiStatusFooter } from '../core/components/ApiStatusFooter';
import { ErrorState } from '../core/components/ErrorState';
import { LoadingState } from '../core/components/LoadingState';
import { PointCard } from '../core/components/PointCard';
import { ROUTES } from '../core/constants/routes';
import { usePublicPoints } from '../core/hooks/usePublicPoints';
import type { PointSummary } from '../core/types';

function PointList({ points }: { points: PointSummary[] }) {
  if (points.length === 0) {
    return <p className="py-6 text-base text-gray-600">Nenhum ponto publicado ainda.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {points.map((point) => (
        <li key={point.slug}>
          <PointCard point={point} />
        </li>
      ))}
    </ul>
  );
}

/** Pagina inicial: lista os pontos publicados para quem chega sem QR Code. */
export function HomePage() {
  const { state, reload } = usePublicPoints();

  return (
    <>
      <main className="mx-auto flex max-w-prose flex-col gap-6 px-4 py-6 text-base">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">TourVR · Tour do campus</h1>
          <p className="text-gray-700">
            Escaneie o QR Code de um local ou escolha um ponto abaixo.
          </p>
          <Link
            to={ROUTES.scan}
            className="mt-2 rounded-lg bg-blue-700 px-4 py-3 text-center text-lg font-semibold text-white"
          >
            Escanear QR Code
          </Link>
          <Link
            to={ROUTES.vr}
            className="rounded-lg border border-blue-700 px-4 py-3 text-center text-lg font-semibold text-blue-700"
          >
            Visita virtual 360°
          </Link>
        </header>
        {state.status === 'success' ? <PointList points={state.data} /> : null}
        {state.status === 'loading' ? <LoadingState /> : null}
        {state.status === 'error' || state.status === 'not-found' ? (
          <ErrorState onRetry={reload} />
        ) : null}
      </main>
      <ApiStatusFooter />
    </>
  );
}
