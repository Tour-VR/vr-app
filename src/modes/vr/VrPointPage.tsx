import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Texture } from 'three';
import { ErrorState } from '../../core/components/ErrorState';
import { LoadingState } from '../../core/components/LoadingState';
import { PointHeader } from '../../core/components/PointHeader';
import { ROUTES } from '../../core/constants/routes';
import { usePoint } from '../../core/hooks/usePoint';
import { useRegisterVisit } from '../../core/hooks/useRegisterVisit';
import type { PointDetail } from '../../core/types';
import { PointNotFound } from '../ar/PointNotFound';
import { useImmersiveVrSupport } from './hooks/useImmersiveVrSupport';
import { usePanoramaTexture } from './hooks/usePanoramaTexture';
import { VrCanvas, xrStore } from './scene/VrCanvas';

function NoPanorama({ slug }: { slug: string }) {
  return (
    <main className="mx-auto flex max-w-prose flex-col gap-4 px-4 py-10 text-base">
      <p className="text-gray-800">Este ponto ainda não tem visita 360°.</p>
      <Link to={ROUTES.point(slug)} className="text-blue-700 underline">
        Ver a página do ponto
      </Link>
    </main>
  );
}

function SceneOverlay({ point }: { point: PointDetail }) {
  const vrSupported = useImmersiveVrSupport();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <div className="absolute inset-x-3 top-3 mx-auto flex max-w-prose flex-col gap-3 rounded-lg bg-white/90 p-4 text-base">
      {infoOpen ? <PointHeader name={point.name} summary={point.summary} /> : null}
      <p className="text-gray-700">Arraste para olhar em volta.</p>
      <div className="flex flex-wrap items-center gap-3">
        {vrSupported ? (
          <button
            type="button"
            onClick={() => void xrStore.enterVR()}
            className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white"
          >
            Entrar em VR
          </button>
        ) : null}
        <button
          type="button"
          aria-expanded={infoOpen}
          onClick={() => {
            setInfoOpen((open) => !open);
          }}
          className="text-blue-700 underline"
        >
          {infoOpen ? 'Ocultar informações' : 'Mostrar informações'}
        </button>
        <Link to={ROUTES.vr} className="text-blue-700 underline">
          Voltar à lista
        </Link>
      </div>
    </div>
  );
}

function PanoramaScene({ point, texture }: { point: PointDetail; texture: Texture }) {
  return (
    <div className="relative h-dvh w-full bg-black">
      <VrCanvas texture={texture} name={point.name} summary={point.summary} />
      <SceneOverlay point={point} />
    </div>
  );
}

function CenteredError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <main className="mx-auto max-w-prose px-4">
      <ErrorState message={message} onRetry={onRetry} />
    </main>
  );
}

function PanoramaView({ point, onRetry }: { point: PointDetail; onRetry: () => void }) {
  const texture = usePanoramaTexture(point.panorama_url);
  useRegisterVisit(point.slug, 'vr', texture.status === 'success');

  switch (texture.status) {
    case 'loading':
      return <LoadingState />;
    case 'not-found':
      return <NoPanorama slug={point.slug} />;
    case 'error':
      return <CenteredError message="Não foi possível carregar o panorama." onRetry={onRetry} />;
    case 'success':
      return <PanoramaScene point={point} texture={texture.data} />;
  }
}

/** Cena 360 do ponto (modo VR remoto), rota `/vr/:slug`. */
export function VrPointPage() {
  const { slug = '' } = useParams();
  const { state, reload } = usePoint(slug);
  // Nova tentativa do panorama: trocar a key remonta a vista e carrega a textura de novo.
  const [attempt, setAttempt] = useState(0);

  switch (state.status) {
    case 'loading':
      return <LoadingState />;
    case 'not-found':
      return (
        <main className="mx-auto max-w-prose px-4">
          <PointNotFound />
        </main>
      );
    case 'error':
      return <CenteredError onRetry={reload} />;
    case 'success':
      return (
        <PanoramaView
          key={attempt}
          point={state.data}
          onRetry={() => {
            setAttempt((value) => value + 1);
          }}
        />
      );
  }
}
