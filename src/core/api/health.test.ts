import type { HealthStatus } from '../types';
import { API_PREFIX, apiClient } from './client';
import { fetchApiHealth } from './health';

const HEALTH: HealthStatus = {
  status: 'ok',
  api: { status: 'ok' },
  database: { status: 'up', connected: true, database: 'tourvr_db', detail: 'ok' },
};

describe('fetchApiHealth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('usa o prefixo do proxy', () => {
    expect(apiClient.defaults.baseURL).toBe(API_PREFIX);
    expect(API_PREFIX).toBe('/api');
  });

  it('chama GET /health/ e devolve o corpo', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: HEALTH });

    await expect(fetchApiHealth()).resolves.toEqual(HEALTH);
    expect(get).toHaveBeenCalledWith('/health/');
  });
});
