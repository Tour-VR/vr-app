import { SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from '../constants/points';

const POINT_PATH = /^\/p\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/;

/**
 * Devolve o slug do ponto se o texto lido for uma URL do tour; senao, null.
 * O dominio e ignorado: so o caminho `/p/<slug>` identifica o ponto.
 */
export function parseTourUrl(text: string): string | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  const slug = POINT_PATH.exec(url.pathname)?.[1];
  if (slug === undefined) return null;
  if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) return null;
  return slug;
}
