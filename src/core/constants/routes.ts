/** Rotas do app do visitante (visao macro, secao 6.1). */
export const ROUTES = {
  home: '/',
  point: (slug: string) => `/p/${slug}`,
  scan: '/scan',
  vr: '/vr',
  vrPoint: (slug: string) => `/vr/${slug}`,
} as const;
