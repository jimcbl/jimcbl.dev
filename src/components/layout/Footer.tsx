import { SocialNetworkIcons } from '../SocialNetwork';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Duc Thinh Tran</p>
      <p>Research, software & everything in between.</p>
      <SocialNetworkIcons size={18} />
    </footer>
  );
}
