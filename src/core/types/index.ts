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
