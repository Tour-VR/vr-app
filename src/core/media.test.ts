import { mediaSrc } from './media';

describe('mediaSrc', () => {
  it('mantem a URL relativa de midia enviada', () => {
    expect(mediaSrc('/media/x.jpg')).toBe('/media/x.jpg');
  });

  it('mantem a URL absoluta cadastrada a mao', () => {
    expect(mediaSrc('https://exemplo.com/foto.jpg')).toBe('https://exemplo.com/foto.jpg');
  });
});
