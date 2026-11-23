import { apiClient } from './client';
import { registerVisit } from './visits';

describe('registerVisit', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envia POST /public/points/{slug}/visits com o modo', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { recorded: true } });

    await registerVisit('biblioteca', 'ar');
    expect(post).toHaveBeenCalledWith('/public/points/biblioteca/visits', { mode: 'ar' });
  });
});
