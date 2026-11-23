import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { mediaSrc } from '../media';
import type { PointSummary } from '../types';

interface PointCardProps {
  point: PointSummary;
}

/** Cartao da lista inicial: capa (ou bloco neutro), nome e resumo; leva a `/p/<slug>`. */
export function PointCard({ point }: PointCardProps) {
  return (
    <Link
      to={ROUTES.point(point.slug)}
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md"
    >
      {point.cover_url ? (
        <img
          src={mediaSrc(point.cover_url)}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="aspect-video w-full bg-gray-200" />
      )}
      <div className="flex flex-col gap-1 p-4">
        <h2 className="text-lg font-semibold break-words text-gray-900">{point.name}</h2>
        <p className="text-base text-gray-700">{point.summary}</p>
      </div>
    </Link>
  );
}
