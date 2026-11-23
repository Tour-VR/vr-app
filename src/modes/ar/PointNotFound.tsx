import { Link } from 'react-router-dom';
import { ROUTES } from '../../core/constants/routes';

/** Resposta 404: ponto inexistente ou ainda em rascunho. */
export function PointNotFound() {
  return (
    <div className="flex flex-col gap-4 py-10 text-base">
      <h1 className="text-2xl font-bold text-gray-900">Ponto não encontrado</h1>
      <p className="text-gray-800">Este ponto não existe ou ainda não foi publicado.</p>
      <Link to={ROUTES.home} className="text-blue-700 underline">
        Ver todos os pontos
      </Link>
    </div>
  );
}
