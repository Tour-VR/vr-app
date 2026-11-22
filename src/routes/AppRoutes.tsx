import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../core/constants/routes';
import { HomePage } from './HomePage';
import { NotFoundPage } from './NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
