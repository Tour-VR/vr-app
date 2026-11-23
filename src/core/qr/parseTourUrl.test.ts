import { parseTourUrl } from './parseTourUrl';

describe('parseTourUrl', () => {
  it.each([
    ['https://10.0.0.5:3001/p/biblioteca-central', 'biblioteca-central'],
    ['http://localhost:3001/p/bloco-a/', 'bloco-a'],
    ['  https://tour.exemplo.com/p/cantina  ', 'cantina'],
    [`https://x.com/p/${'a'.repeat(3)}`, 'aaa'],
    [`https://x.com/p/${'a'.repeat(60)}`, 'a'.repeat(60)],
  ])('aceita %s', (text, slug) => {
    expect(parseTourUrl(text)).toBe(slug);
  });

  it.each([
    ['http://localhost:3001/p/'],
    ['http://localhost:3001/x/abc'],
    ['ftp://localhost/p/biblioteca'],
    ['texto solto qualquer'],
    ['https://x.com/p/Biblioteca'],
    ['https://x.com/p/bloco--a'],
    ['https://x.com/p/biblioteca/fotos'],
    [`https://x.com/p/${'a'.repeat(2)}`],
    [`https://x.com/p/${'a'.repeat(61)}`],
  ])('rejeita %s', (text) => {
    expect(parseTourUrl(text)).toBeNull();
  });
});
