import type { PointDetail, PointSummary } from '../types';
import { apiClient } from './client';
import { fetchPublicPoint, fetchPublicPoints } from './points';

const SUMMARY: PointSummary = {
  slug: 'biblioteca',
  name: 'Biblioteca',
  summary: 'Livros',
  cover_url: null,
  has_panorama: false,
};
const DETAIL: PointDetail = {
  slug: 'biblioteca',
  name: 'Biblioteca',
  summary: 'Livros',
  history: 'Historia',
  media: [],
  panorama_url: null,
  connections: [],
};

describe('chamadas publicas de pontos', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchPublicPoints chama GET /public/points', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [SUMMARY] });

    await expect(fetchPublicPoints()).resolves.toEqual([SUMMARY]);
    expect(get).toHaveBeenCalledWith('/public/points');
  });

  it('fetchPublicPoint chama GET /public/points/{slug}', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: DETAIL });

    await expect(fetchPublicPoint('biblioteca')).resolves.toEqual(DETAIL);
    expect(get).toHaveBeenCalledWith('/public/points/biblioteca');
  });

  it('fetchPublicPoint codifica o slug', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: DETAIL });

    await fetchPublicPoint('a/b c');
    expect(get).toHaveBeenCalledWith('/public/points/a%2Fb%20c');
  });
});
