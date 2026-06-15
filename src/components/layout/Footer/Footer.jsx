import React from 'react';
import './Footer.css';

function Footer({ onPrivacy, onTerms }) {
  return (
    <footer>
      <div className="footer-links">
        <span onClick={onPrivacy}>개인정보처리방침</span>
        <span className="footer-divider">|</span>
        <span onClick={onTerms}>이용약관</span>
      </div>
      <p className="footer-copy">© 2026 group9. All rights reserved.</p>
    </footer>
  );
}

export default Footer;