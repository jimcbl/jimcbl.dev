import styles from './page.module.css';
import { garamond } from '../font';

export default function LoadingPhotos() {
  return (
    <div className={styles.page} role="status">
      <p className="eyebrow">Photography / Life beyond the screen</p>
      <h1 className={garamond.className} style={{ fontSize: '3rem', color: 'var(--forest)', margin: '12px 0' }}>A different lens.</h1>
      <p style={{ color: 'var(--muted)' }}>Loading photographs…</p>
    </div>
  );
}
