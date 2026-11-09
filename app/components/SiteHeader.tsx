'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { T } from '../i18n';

export default function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((response) => {
        if (active) setSignedIn(response.ok);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="CreatorPilot home">
          <span className="brand-mark">C</span>
          <span>CreatorPilot</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {!compact && (
            <>
              <Link href="/features"><T k="nav_features" /></Link>
              <Link href="/about"><T k="nav_about" /></Link>
              <Link href="/pricing"><T k="nav_pricing" /></Link>
              <Link href="/contact"><T k="nav_contact" /></Link>
            </>
          )}
          {signedIn ? (
            <Link href="/dashboard" className="btn btn-primary nav-cta"><T k="dash_nav_label" /></Link>
          ) : (
            <>
              <Link href="/login" className="nav-link-quiet"><T k="nav_login" /></Link>
              <Link href="/register" className="btn btn-primary nav-cta"><T k="hero_cta_primary" /></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
