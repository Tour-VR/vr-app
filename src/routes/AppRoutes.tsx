import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingState } from '../core/components/LoadingState';
import { ROUTES } from '../core/constants/routes';
import { PointPage } from '../modes/ar/PointPage';
import { ScanPage } from '../modes/ar/ScanPage';
import { HomePage } from './HomePage';
import { NotFoundPage } from './NotFoundPage';

// Modo VR sob demanda: three.js fica num arquivo a parte, que o modo AR nao baixa.
const VrRoutes = lazy(() => import('../modes/vr/VrRoutes'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.point(':slug')} element={<PointPage />} />
      <Route path={ROUTES.scan} element={<ScanPage />} />
      <Route
        path={`${ROUTES.vr}/*`}
        element={
          <Suspense fallback={<LoadingState />}>
            <VrRoutes />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
