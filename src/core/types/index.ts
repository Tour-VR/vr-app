import type { components } from './api';

// Aliases legiveis dos tipos gerados do OpenAPI (`npm run gen:types`).
// Nao escreva interface de contrato a mao: regenere `api.d.ts` quando o backend mudar.

/**
 * Resposta de `GET /health/`. Excecao a regra acima: a rota nao declara esquema de
 * resposta no OpenAPI, entao o tipo espelha docs/06-contrato-api.md.
 */
export interface HealthStatus {
  status: 'ok' | 'degraded';
  api: { status: string };
  database: { status: string; connected: boolean; database: string; detail: string };
}

type Schemas = components['schemas'];

/** Item da lista publica de pontos (`GET /public/points`). */
export type PointSummary = Schemas['PointPublicSummary'];

/** Conteudo publico de um ponto (`GET /public/points/{slug}`). */
export type PointDetail = Schemas['PointPublicDetail'];

/** Foto ou panorama embutido no ponto. */
export type MediaItem = Schemas['MediaItemResponse'];

/** Modo da visita registrada: presencial (AR) ou remota (VR). */
export type VisitMode = Schemas['VisitCreate']['mode'];

/** Seta da cena VR para um ponto vizinho publicado (plano 019). */
export type PointConnection = Schemas['PointPublicConnection'];
