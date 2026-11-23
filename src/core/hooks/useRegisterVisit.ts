import { useEffect, useRef } from 'react';
import { registerVisit } from '../api/visits';
import type { VisitMode } from '../types';

/**
 * Registra uma visita por montagem, quando `ready` (conteudo carregado). O `useRef` evita
 * o registro em dobro do StrictMode; falha so gera `console.warn`, nunca erro na tela.
 */
export function useRegisterVisit(slug: string | undefined, mode: VisitMode, ready: boolean) {
  const registered = useRef<string | null>(null);
  useEffect(() => {
    if (!ready || !slug || registered.current === slug) return;
    registered.current = slug;
    registerVisit(slug, mode).catch((error: unknown) => {
      console.warn('Nao foi possivel registrar a visita.', error);
    });
  }, [slug, mode, ready]);
}
