import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      {/* <img src="/powder-day-logo.svg" alt="Powder Day Logo" className="footer-logo" /> */}
      <p>Powder Day &middot; 2026</p>
      <a href="https://github.com/JakeR-Dev/PowderDay" aria-label="visit the github repo"><img src="/github-white.png" alt="GitHub Logo" /></a>
      <a href="https://www.linkedin.com/in/jakepotterryan/" aria-label="visit my linkedin profile"><img src="/linkedin-white.png" alt="LinkedIn Logo" /></a>
    </footer>
  );
}