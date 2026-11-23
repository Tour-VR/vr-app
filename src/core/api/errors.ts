import { isAxiosError } from 'axios';

const HTTP_NOT_FOUND = 404;

/** Verdadeiro quando o erro e uma resposta 404 da API. */
export function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === HTTP_NOT_FOUND;
}
