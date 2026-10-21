export interface GalleryPhoto {
  id: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  imageUrl: string;
  photoUrl: string;
}

interface UnsplashPhoto {
  id?: string;
  width?: number;
  height?: number;
  alt_description?: string | null;
  description?: string | null;
  urls?: { regular?: string };
  links?: { html?: string };
}

export const UNSPLASH_PROFILE = 'https://unsplash.com/@jimcbl?utm_source=jimcbl.dev&utm_medium=referral';

function unsplashUrl(value: string | undefined, host: string): URL | null {
  try {
    const url = new URL(value || '');
    return url.protocol === 'https:' && url.hostname === host ? url : null;
  } catch {
    return null;
  }
}

export function galleryPhotos(items: UnsplashPhoto[]): GalleryPhoto[] {
  const seen = new Set<string>();
  return items.flatMap((photo) => {
    const imageUrl = unsplashUrl(photo?.urls?.regular, 'images.unsplash.com');
    const photoUrl = unsplashUrl(photo?.links?.html, 'unsplash.com');
    if (!photo?.id || seen.has(photo.id) || !imageUrl || !photoUrl ||
      typeof photo.width !== 'number' || !Number.isFinite(photo.width) || photo.width <= 0 ||
      typeof photo.height !== 'number' || !Number.isFinite(photo.height) || photo.height <= 0) return [];
    seen.add(photo.id);
    photoUrl.searchParams.set('utm_source', 'jimcbl.dev');
    photoUrl.searchParams.set('utm_medium', 'referral');
    return [{
      id: photo.id,
      width: photo.width,
      height: photo.height,
      alt: photo.alt_description?.trim() || photo.description?.trim() || 'A photograph by Thinh Tran',
      caption: photo.description?.trim() || photo.alt_description?.trim() || 'Untitled photograph',
      imageUrl: imageUrl.href,
      photoUrl: photoUrl.href,
    }];
  });
}

export function applyPhotoCaptions(
  photos: GalleryPhoto[],
  overrides: Record<string, { caption: string; alt?: string }>,
): GalleryPhoto[] {
  return photos.map((photo) => {
    const override = overrides[photo.id];
    return {
      ...photo,
      caption: override?.caption.trim() || photo.caption,
      alt: photo.alt === 'A photograph by Thinh Tran' ? override?.alt?.trim() || photo.alt : photo.alt,
    };
  });
}

// Called only by the server-rendered photos page. Never pass the access key to a client component.
export async function fetchLatestPhotos(accessKey: string | undefined, fetcher: typeof fetch = fetch): Promise<GalleryPhoto[] | null> {
  if (!accessKey?.trim()) return null;
  try {
    const response = await fetcher('https://api.unsplash.com/users/jimcbl/photos?order_by=latest&per_page=24', {
      headers: { Authorization: `Client-ID ${accessKey.trim()}`, 'Accept-Version': 'v1' },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return null;
    const photos = galleryPhotos(data);
    return photos.length ? photos : null;
  } catch {
    // Missing access, rate limits, timeouts, and network failures keep the archive available.
    return null;
  }
}
