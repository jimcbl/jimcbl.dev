import Link from 'next/link';
import { SOCIAL_NETWORK_LINKS, experienceProps } from './props';
import { garamond } from './font';
import { getPublications } from '@/lib/publications';
import WorkItem from '@/components/WorkItem';

export default async function Home() {
  const publications = await getPublications();
  return (
    <div className="home-page">
      <section id="about" className="home-hero" aria-labelledby="intro-title">
        <div>
          <p className="eyebrow">Researcher. Engineer. Curious human.</p>
          <h1 id="intro-title" className={garamond.className}>Thinh Tran<span className="accent">.</span></h1>
          <p className="hero-role">PhD student & software engineer</p>
          <p className="hero-description">Exploring how civic technology communities build software, work together, and grow.</p>
          <div className="hero-links">
            <a className="primary-link" href="#publications">Explore my research <span aria-hidden="true">↗</span></a>
            <Link className="text-link" href="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <aside className="research-note" aria-label="Current research">
          <p className="eyebrow"><span className="status-dot" /> Currently</p>
          <h2 className={garamond.className}>Building a better understanding of civic tech.</h2>
          <p>Doctoral research at IMT Atlantique on the processes that help civic tech projects scale.</p>
          <div className="note-footer"><span>IMT Atlantique</span><span>Brest, France</span></div>
        </aside>
      </section>

      <div className="home-columns">
        <div className="home-content">
          <section className="home-section" aria-labelledby="about-heading">
            <p className="eyebrow">01 / A little background</p>
            <h2 id="about-heading" className={garamond.className}>From building products<br />to studying communities.</h2>
            <div className="prose-copy">
              <p>I’m a software engineer and PhD student at IMT Atlantique, France. After several years building web products and developer tools, I’m now researching how civic tech projects can develop sustainable, replicable ways of working.</p>
              <p>My work connects software engineering with the people and communities behind it. Outside of research, I enjoy photography, traveling, and music.</p>
            </div>
            <Link className="text-link" href="/photos">A different lens: my photography <span aria-hidden="true">↗</span></Link>
          </section>

          <section id="publications" className="home-section" aria-labelledby="publications-heading">
            <div className="section-heading">
              <div><p className="eyebrow">02 / Research & writing</p><h2 id="publications-heading" className={garamond.className}>Publications</h2></div>
              <span className="section-count">{String(publications.length).padStart(2, '0')} papers</span>
            </div>
            <p className="section-intro">Recent work on civic technology and grassroots software ecosystems.</p>
            <div className="publication-list">
              {publications.map((publication) => (
                <article className="publication" key={publication.id}>
                  <span className="publication-year">{publication.year}</span>
                  <div>
                    <h3>{publication.href ? (
                      <a className="publication-title-link" href={publication.href} target="_blank" rel="noopener noreferrer" aria-label={`${publication.title} (opens in a new tab)`}>
                        {publication.title} <span aria-hidden="true">↗</span>
                      </a>
                    ) : publication.title}</h3>
                    <p className="publication-authors">{publication.authors.map((author, index) => (
                      <span key={author}>{index > 0 && '; '}{/^Tran, (Duc )?Thinh$/.test(author) ? <strong>{author}</strong> : author}</span>
                    ))}</p>
                    <p className="publication-venue">{publication.venue}{publication.pages && ` · pp. ${publication.pages}`}</p>
                    {publication.publisher && <p className="publication-publisher">{publication.publisher}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="home-section" aria-labelledby="experience-heading">
            <p className="eyebrow">03 / The journey so far</p>
            <h2 id="experience-heading" className={garamond.className}>Experience</h2>
            <div className="experience-list">{experienceProps.map((item) => <WorkItem key={`${item.company}-${item.startDate}`} {...item} />)}</div>
          </section>
        </div>

        <aside className="home-sidebar">
          <section aria-labelledby="elsewhere-heading">
            <p className="eyebrow" id="elsewhere-heading">Find me elsewhere</p>
            <a className="sidebar-link" href={SOCIAL_NETWORK_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a className="sidebar-link" href={SOCIAL_NETWORK_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a className="sidebar-link" href={SOCIAL_NETWORK_LINKS.unsplash} target="_blank" rel="noopener noreferrer">Unsplash <span aria-hidden="true">↗</span></a>
            <a className="sidebar-email" href="mailto:jimtran98@gmail.com">jimtran98@gmail.com</a>
          </section>
          <section aria-labelledby="education-heading">
            <p className="eyebrow" id="education-heading">Education</p>
            <div className="education-entry"><h3>LUT University</h3><p>MSc, Software Product Management and Business</p><span>2022 — 2024</span></div>
            <div className="education-entry"><h3>Ho Chi Minh City University of Technology</h3><p>BEng, Computer Science</p><span>2016 — 2020</span></div>
          </section>
          <p className={'sidebar-quote ' + garamond.className}>Interested in the people<br />behind the software.</p>
        </aside>
      </div>
      <section className="home-contact" aria-labelledby="contact-heading"><div><p className="eyebrow">Let’s connect</p><h2 id="contact-heading" className={garamond.className}>Good work starts with a conversation.</h2></div><Link className="primary-link" href="/contact">Say hello <span aria-hidden="true">↗</span></Link></section>
    </div>
  );
}
