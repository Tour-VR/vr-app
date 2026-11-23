import { render, screen } from '@testing-library/react';
import type { MediaItem } from '../types';
import { MediaGallery } from './MediaGallery';

const PHOTO: MediaItem = {
  id: '1',
  kind: 'photo',
  url: '/media/fachada.jpg',
  caption: 'Fachada principal',
  alt_text: 'Predio de tijolos',
};
const PANORAMA: MediaItem = {
  id: '2',
  kind: 'panorama',
  url: '/media/360.jpg',
  caption: null,
  alt_text: 'Vista 360',
};

describe('MediaGallery', () => {
  it('mostra so as fotos, com alt, lazy e legenda', () => {
    render(<MediaGallery media={[PHOTO, PANORAMA, { ...PHOTO, id: '3', caption: null }]} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Predio de tijolos');
    expect(images[0]).toHaveAttribute('src', '/media/fachada.jpg');
    expect(images[0]).toHaveAttribute('loading', 'lazy');
    expect(screen.queryByAltText('Vista 360')).not.toBeInTheDocument();
    expect(screen.getAllByText('Fachada principal')).toHaveLength(1);
  });

  it('nao renderiza nada sem fotos', () => {
    const { container } = render(<MediaGallery media={[PANORAMA]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
