import { mediaSrc } from '../media';
import type { MediaItem } from '../types';

interface MediaGalleryProps {
  media: MediaItem[];
}

/** Fotos do ponto em coluna. Panoramas ficam para o modo VR; lista vazia nao renderiza. */
export function MediaGallery({ media }: MediaGalleryProps) {
  const photos = media.filter((item) => item.kind === 'photo');
  if (photos.length === 0) return null;

  return (
    <section aria-label="Fotos" className="flex flex-col gap-4">
      {photos.map((photo) => (
        <figure key={photo.id} className="flex flex-col gap-1">
          <img
            src={mediaSrc(photo.url)}
            alt={photo.alt_text}
            loading="lazy"
            className="w-full rounded-lg"
          />
          {photo.caption ? (
            <figcaption className="text-base text-gray-600">{photo.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </section>
  );
}
