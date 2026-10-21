import Link from 'next/link';
import LightDarkButton from '../LightDarkButton';

export default function Navbar() {
  return (
    <header className="site-header">
      <nav id="navbar" className="site-nav" aria-label="Main navigation">
        <Link className="site-wordmark" href="/" aria-label="Thinh Tran home">tt<span>.</span></Link>
        <div className="site-nav-links">
          <Link href="/#about">About</Link>
          <Link href="/#publications">Publications</Link>
          <Link href="/photos">Photos</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <LightDarkButton />
      </nav>
    </header>
  );
}
