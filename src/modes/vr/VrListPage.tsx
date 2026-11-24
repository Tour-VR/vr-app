import { Link } from 'react-router-dom';
import { ErrorState } from '../../core/components/ErrorState';
import { LoadingState } from '../../core/components/LoadingState';
import { PointCard } from '../../core/components/PointCard';
import { ROUTES } from '../../core/constants/routes';
import type { PointSummary } from '../../core/types';
import { useVrPoints } from './hooks/useVrPoints';

function VrPointList({ points }: { points: PointSummary[] }) {
  if (points.length === 0) {
    return <p className="py-6 text-base text-gray-600">Nenhum ponto com visita 360° ainda.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {points.map((point) => (
        <li key={point.slug}>
          <PointCard point={point} to={ROUTES.vrPoint(point.slug)} />
        </li>
      ))}
    </ul>
  );
}

/** Lista dos pontos com panorama, rota `/vr`: porta de entrada do visitante remoto. */
export function VrListPage() {
  const { state, reload } = useVrPoints();

  return (
    <main className="mx-auto flex max-w-prose flex-col gap-6 px-4 py-6 text-base">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Visita virtual 360°</h1>
        <p className="text-gray-700">Escolha um lugar do campus para olhar em volta.</p>
      </header>
      {state.status === 'success' ? <VrPointList points={state.data} /> : null}
      {state.status === 'loading' ? <LoadingState /> : null}
      {state.status === 'error' || state.status === 'not-found' ? (
        <ErrorState onRetry={reload} />
      ) : null}
      <Link to={ROUTES.home} className="text-blue-700 underline">
        Voltar ao início
      </Link>
    </main>
  );
}
