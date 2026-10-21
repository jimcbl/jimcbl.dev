import { SocialNetworkIcons } from '../SocialNetwork';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Duc Thinh Tran</p>
      <p>Made with ❤️ and Codex</p>
      <SocialNetworkIcons size={18} />
    </footer>
  );
}
