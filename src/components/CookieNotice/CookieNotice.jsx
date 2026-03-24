import './CookieNotice.scss';

export const CookieNotice = ({ setShowCookieNotice, setShowTermsModal }) => {
  const handleClose = () => {
    setShowCookieNotice(false)
    localStorage.setItem('seenCookieBanner', true);
  }

  const handleOpen = () => {
    setShowTermsModal(true)
  }

  return (
    <div className="cookie-notice">
      <button
        className="close"
        aria-label="accept and close"
        onClick={handleClose}  
        >
        +
      </button>
      <p>This site uses cookies. By continuing to use powderday.io, you agree to our <button className="simple" onClick={handleOpen}>Terms & Cookie Policy</button>.</p>
    </div>
  );
}