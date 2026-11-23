import { AxiosError, type AxiosResponse } from 'axios';
import { isNotFound } from './errors';

function axiosErrorWithStatus(status: number): AxiosError {
  return new AxiosError('falha', undefined, undefined, undefined, {
    status,
  } as AxiosResponse);
}

describe('isNotFound', () => {
  it('reconhece resposta 404', () => {
    expect(isNotFound(axiosErrorWithStatus(404))).toBe(true);
  });

  it('recusa outros status, erro sem resposta e erro comum', () => {
    expect(isNotFound(axiosErrorWithStatus(500))).toBe(false);
    expect(isNotFound(new AxiosError('rede'))).toBe(false);
    expect(isNotFound(new Error('x'))).toBe(false);
  });
});
