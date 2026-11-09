'use client';

import Link from 'next/link';
import { T } from '../i18n';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} CreatorPilot</p>
        <div className="footer-links">
          <Link href="/features"><T k="nav_features" /></Link>
          <Link href="/pricing"><T k="nav_pricing" /></Link>
          <Link href="/contact"><T k="nav_contact" /></Link>
          <Link href="/login"><T k="nav_login" /></Link>
        </div>
      </div>
    </footer>
  );
}
