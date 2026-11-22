import { ROUTES } from './routes';

describe('ROUTES', () => {
  it('monta as rotas fixas', () => {
    expect(ROUTES.home).toBe('/');
    expect(ROUTES.scan).toBe('/scan');
    expect(ROUTES.vr).toBe('/vr');
  });

  it('monta as rotas com slug', () => {
    expect(ROUTES.point('biblioteca')).toBe('/p/biblioteca');
    expect(ROUTES.vrPoint('biblioteca')).toBe('/vr/biblioteca');
  });
});
