import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../../core/components/ErrorState';
import { LoadingState } from '../../core/components/LoadingState';
import { MediaGallery } from '../../core/components/MediaGallery';
import { PointContent } from '../../core/components/PointContent';
import { PointHeader } from '../../core/components/PointHeader';
import { ROUTES } from '../../core/constants/routes';
import { usePoint } from '../../core/hooks/usePoint';
import { useRegisterVisit } from '../../core/hooks/useRegisterVisit';
import type { PointDetail } from '../../core/types';
import type { AsyncState } from '../../core/types/async';
import { PointNotFound } from './PointNotFound';

function PointView({ point }: { point: PointDetail }) {
  return (
    <article className="flex flex-col gap-6">
      <PointHeader name={point.name} summary={point.summary} />
      {point.panorama_url ? (
        <Link
          to={ROUTES.vrPoint(point.slug)}
          className="rounded-lg border border-blue-700 px-4 py-3 text-center text-lg font-semibold text-blue-700"
        >
          Visita virtual 360°
        </Link>
      ) : null}
      <MediaGallery media={point.media} />
      <PointContent history={point.history} />
      <footer className="border-t border-gray-200 pt-4">
        <Link to={ROUTES.home} className="text-base text-blue-700 underline">
          Conhecer outros pontos
        </Link>
      </footer>
    </article>
  );
}

function PointBody({ state, onRetry }: { state: AsyncState<PointDetail>; onRetry: () => void }) {
  switch (state.status) {
    case 'loading':
      return <LoadingState />;
    case 'not-found':
      return <PointNotFound />;
    case 'error':
      return <ErrorState onRetry={onRetry} />;
    case 'success':
      return <PointView point={state.data} />;
  }
}

/** Pagina do ponto no modo AR (visita presencial guiada por QR), rota `/p/:slug`. */
export function PointPage() {
  const { slug = '' } = useParams();
  const { state, reload } = usePoint(slug);
  const name = state.status === 'success' ? state.data.name : null;

  useRegisterVisit(slug, 'ar', state.status === 'success');
  useEffect(() => {
    if (name) document.title = `${name} · TourVR`;
  }, [name]);

  return (
    <main className="mx-auto max-w-prose px-4 py-6 text-base">
      <PointBody state={state} onRetry={reload} />
    </main>
  );
}
