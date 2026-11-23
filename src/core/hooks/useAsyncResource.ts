import { useCallback, useEffect, useState } from 'react';
import { isNotFound } from '../api/errors';
import type { AsyncState } from '../types/async';

export interface AsyncResource<T> {
  state: AsyncState<T>;
  /** Repete o carregamento (botao "Tentar de novo"). */
  reload: () => void;
}

interface Settled<T> {
  load: () => Promise<T>;
  attempt: number;
  state: AsyncState<T>;
}

/**
 * Executa `load` e expoe o resultado como estado discriminado. Trocar `load` (ex.: outro
 * slug) volta a `loading`; respostas de um `load` anterior sao ignoradas (flag `cancelled`).
 * `load` precisa ser estavel entre renderizacoes (funcao de modulo ou `useCallback`).
 */
export function useAsyncResource<T>(load: () => Promise<T>): AsyncResource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const settle = (state: AsyncState<T>) => {
      if (!cancelled) setSettled({ load, attempt, state });
    };
    load().then(
      (data) => {
        settle({ status: 'success', data });
      },
      (error: unknown) => {
        settle(isNotFound(error) ? { status: 'not-found' } : { status: 'error' });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [load, attempt]);

  const reload = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  const current = settled?.load === load && settled.attempt === attempt;
  return { state: current ? settled.state : { status: 'loading' }, reload };
}
