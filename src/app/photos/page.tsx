import type { Metadata } from 'next';
import Image from 'next/image';
import { photos as archive } from './props';
import { garamond } from '../font';
import { fetchLatestPhotos, galleryPhotos, applyPhotoCaptions, UNSPLASH_PROFILE } from '@/lib/unsplash';
import styles from './page.module.css';
import photoCaptions from '../../../content/photo-captions.json';

export const metadata: Metadata = {
  title: 'Photography | Thinh Tran',
  description:
    'Photographs and everyday moments by Thinh Tran, who has lived in Vietnam and Finland and is now based in France.',
};

export const revalidate = 3600;

export default async function Photos() {
  const latest = await fetchLatestPhotos(process.env.UNSPLASH_ACCESS_KEY);
  const photos = applyPhotoCaptions(latest ?? galleryPhotos(archive), photoCaptions);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div>
          <p className="eyebrow">Photography / Life beyond the screen</p>
          <h1 className={garamond.className}>
            A different lens<span className="accent">.</span>
          </h1>
          <p className={styles.lead}>Places, people, and everyday moments I’ve noticed along the way.</p>
          <p className={styles.story}>
            I’ve lived in Vietnam and Finland, and I’m now based in France. Photography gives me a reason to slow down
            and look a little closer at the places I call home and those I visit.
          </p>
          <a className="text-link" href={UNSPLASH_PROFILE} target="_blank" rel="noopener noreferrer">
            Find me on Unsplash <span aria-hidden="true">↗</span>
          </a>
        </div>
        <aside className={styles.places} aria-labelledby="places-heading">
          <p className="eyebrow" id="places-heading">
            Places I’ve called home
          </p>
          <ol>
            <li>
              <span className={garamond.className}>Vietnam</span>
              <span>Bao Loc</span>
            </li>
            <li>
              <span className={garamond.className}>Finland</span>
              <span>Lahti</span>
            </li>
            <li>
              <span className={garamond.className}>France</span>
              <span>
                <span className="status-dot" />
                Now · Brest
              </span>
            </li>
          </ol>
        </aside>
      </header>

      <section aria-labelledby="gallery-heading">
        <div className={styles.galleryHeader}>
          <div>
            <p className="eyebrow">Through my lens</p>
            <h2 id="gallery-heading" className={garamond.className}>
              {latest ? 'Recent photographs' : 'Selected photographs'}
            </h2>
            <p className={styles.galleryIntro}>
              {latest ? 'Recent uploads from my Unsplash.' : 'A selection from my photo archive.'} Open a photograph to
              see it on Unsplash.
            </p>
          </div>
          <span className={styles.count}>{photos.length} photographs</span>
        </div>
        <p className={styles.credit}>
          Photography by{' '}
          <a href={UNSPLASH_PROFILE} target="_blank" rel="noopener noreferrer">
            Thinh Tran
          </a>{' '}
          on{' '}
          <a
            href="https://unsplash.com/?utm_source=jimcbl.dev&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
        {photos.length ? (
          <div className={styles.gallery}>
            {photos.map((photo, index) => (
              <figure className={styles.photo} key={photo.id}>
                <a
                  href={photo.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${photo.caption} (opens on Unsplash in a new tab)`}
                >
                  <div className={styles.imageFrame}>
                    <Image
                      src={photo.imageUrl}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      unoptimized
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className={styles.image}
                    />
                  </div>
                  <figcaption>
                    <span>{photo.caption}</span>
                    <span aria-hidden="true">↗</span>
                  </figcaption>
                </a>
              </figure>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>You can explore my photographs on Unsplash.</p>
        )}
        <div className={styles.more}>
          <p>There’s more to see.</p>
          <a className="primary-link" href={UNSPLASH_PROFILE} target="_blank" rel="noopener noreferrer">
            More on Unsplash <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
