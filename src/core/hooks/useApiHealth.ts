import { useEffect, useState } from 'react';
import { fetchApiHealth } from '../api/health';

export type ApiHealthState = 'loading' | 'ok' | 'error';

/** Consulta `GET /health/` uma vez; `ok` significa que a API respondeu pelo proxy. */
export function useApiHealth(): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>('loading');

  useEffect(() => {
    let active = true;
    fetchApiHealth().then(
      () => {
        if (active) setState('ok');
      },
      () => {
        if (active) setState('error');
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
