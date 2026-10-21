import type { Metadata } from 'next';
import Link from 'next/link';
import { garamond } from '../font';
import { SOCIAL_NETWORK_LINKS, type SocialNetworkType } from '../props';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact | Thinh Tran',
  description: 'Get in touch with Thinh Tran about civic technology, research, software, or photography.',
};

const socialLabels: Record<SocialNetworkType, { name: string; description: string }> = {
  linkedin: { name: 'LinkedIn', description: 'Professional connections' },
  github: { name: 'GitHub', description: 'Code & projects' },
  telegram: { name: 'Telegram', description: 'Stay in touch' },
  unsplash: { name: 'Unsplash', description: 'Photography' },
  instagram: { name: 'Instagram', description: 'Life through my lens' },
};

export default function Contact() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className="eyebrow">Contact / Let’s connect</p>
        <h1 className={garamond.className}>
          Say hello<span className="accent">.</span>
        </h1>
        <p className={styles.lead}>
          A research question, a shared interest, or an idea worth exploring — I’d love to hear from you.
        </p>
      </header>

      <div className={styles.columns}>
        <section className={styles.emailSection} aria-labelledby="email-heading">
          <p className="eyebrow" id="email-heading">
            Start a conversation
          </p>
          <a className={styles.email} href="mailto:jimtran98@gmail.com">
            jimtran98@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <p className={styles.description}>
            Email is the best place to reach me about civic technology, software engineering, and research. You’re
            welcome to write about photography, too.
          </p>
          <a className="primary-link" href="mailto:jimtran98@gmail.com">
            Write me an email <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.location}>
            <span className="status-dot" aria-hidden="true" />
            Based in Brest, France · IMT Atlantique
          </div>
        </section>

        <section className={styles.elsewhere} aria-labelledby="elsewhere-heading">
          <p className="eyebrow">Elsewhere on the web</p>
          <h2 id="elsewhere-heading" className={garamond.className}>
            A few other ways to connect.
          </h2>
          <ul className={styles.socialList}>
            {Object.entries(SOCIAL_NETWORK_LINKS).map(([key, url]) => {
              if (!url) return null;
              const social = socialLabels[key as SocialNetworkType];
              return (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} (opens in a new tab)`}
                  >
                    <span>
                      <strong>{social.name}</strong>
                      <span className={styles.socialDescription}>{social.description}</span>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* <div className={styles.explore}>
        <p>Want to know a little more first?</p>
        <Link className="text-link" href="/#publications">
          Explore my research <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" href="/photos">
          Browse my photography <span aria-hidden="true">↗</span>
        </Link>
      </div> */}
    </div>
  );
}
