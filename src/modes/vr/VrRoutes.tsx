import { Route, Routes } from 'react-router-dom';
import { VrListPage } from './VrListPage';
import { VrPointPage } from './VrPointPage';

/** Rotas do modo VR, montadas sob `/vr/*`. */
// export default: excecao a convencao de exports nomeados, exigida pelo React.lazy.
export default function VrRoutes() {
  return (
    <Routes>
      <Route path="" element={<VrListPage />} />
      <Route path=":slug" element={<VrPointPage />} />
    </Routes>
  );
}
