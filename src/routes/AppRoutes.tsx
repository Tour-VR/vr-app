import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../core/constants/routes';
import { PointPage } from '../modes/ar/PointPage';
import { HomePage } from './HomePage';
import { NotFoundPage } from './NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.point(':slug')} element={<PointPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
