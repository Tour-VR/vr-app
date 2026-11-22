import { Link } from 'react-router-dom';
import { ROUTES } from '../core/constants/routes';

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10 text-base">
      <h1 className="text-2xl font-bold text-gray-900">Página não encontrada</h1>
      <Link to={ROUTES.home} className="text-blue-700 underline">
        Voltar ao início
      </Link>
    </main>
  );
}
