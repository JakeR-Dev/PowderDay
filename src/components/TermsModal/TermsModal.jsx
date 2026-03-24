import "./TermsModal.scss"

export const TermsModal = ({ setShowTermsModal }) => {
  const handleClose = () => {
    setShowTermsModal(false)
  }

  return (
    <dialog className="terms-modal">
      <h2>Powder Day - Terms of Use &amp; Cookie Policy</h2>
      <p><strong>Last updated:</strong> March 24, 2026</p>

      <hr />
      
      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using powderday.io (&quot;the Site&quot;), you agree to be bound by these Terms of Use and Cookie Policy. If you do not agree, please discontinue use of the Site.</p>
      </section>

      <section>
        <h3>2. Use of the Site</h3>
        <p>The Site is provided for informational and personal use. You agree not to misuse the Site, attempt to disrupt its operation, or use it for any unlawful purpose.</p>
      </section>

      <section>
        <h3>3. Cookies</h3>
        <p>The Site uses cookies solely through Google Analytics, a service provided by Google LLC, to collect anonymized data about how visitors interact with the Site. This data helps us understand usage patterns and improve the experience.</p>
        <p>Google Analytics may collect information such as:</p>
        <ul>
          <li>Pages visited and time spent on the Site</li>
          <li>General geographic region (country/region level)</li>
          <li>Browser type and device category</li>
          <li>Referring URLs</li>
        </ul>
        <p>This data is aggregated and anonymized. We do not use it to identify individual visitors, and we do not sell or share it with any third parties beyond what is inherent to Google Analytics&apos; operation.</p>
        <p>
          You can learn more about how Google uses this data at
          {' '}
          <a href="https://google.com/policies/privacy/partners" target="_blank" rel="noopener noreferrer">
            google.com/policies/privacy/partners
          </a>
          , and you can opt out of Google Analytics tracking via the Google Analytics Opt-out Browser Add-on.
        </p>
      </section>

      <section>
        <h3>4. No Other Tracking</h3>
        <p>Beyond Google Analytics, the Site does not use advertising cookies, remarketing pixels, session recording tools, or any other third-party tracking technologies.</p>
      </section>

      <section>
        <h3>5. Third-Party Links</h3>
        <p>The Site may contain links to external sites. We are not responsible for the content or privacy practices of those sites.</p>
      </section>

      <section>
        <h3>6. Disclaimer</h3>
        <p>The Site and its content are provided &quot;as is&quot; without warranties of any kind. We make no guarantees regarding accuracy, availability, or fitness for a particular purpose. Ski and snowboard conditions are inherently variable - always exercise your own judgment before heading out.</p>
      </section>

      <section>
        <h3>7. Limitation of Liability</h3>
        <p>To the fullest extent permitted by law, Powder Day and its operators shall not be liable for any damages arising from your use of or reliance on the Site or its content.</p>
      </section>

      <section>
        <h3>8. Changes to These Terms</h3>
        <p>We may update these Terms from time to time. Continued use of the Site after any changes constitutes your acceptance of the updated Terms. The &quot;Last updated&quot; date at the top of this page will reflect any revisions.</p>
      </section>

      <section>
        <h3>9. Contact</h3>
        <p>Questions? Reach out via <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a> or <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      </section>
      <button className="close" aria-label="close" onClick={handleClose}>
        +
      </button>
    </dialog>
  )
}