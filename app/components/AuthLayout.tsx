'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useT } from '../i18n';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

type Props = {
  titleKey: string;
  leadKey: string;
  children: ReactNode;
  altPromptKey?: string;
  altLinkKey?: string;
  altHref?: string;
  showBack?: boolean;
};

export default function AuthLayout({
  titleKey,
  leadKey,
  children,
  altPromptKey,
  altLinkKey,
  altHref,
  showBack = false,
}: Props) {
  const t = useT();

  return (
    <main className="page-shell">
      <SiteHeader compact />
      <section className="auth-section">
        <div className="container auth-grid">
          <div className="auth-copy">
            <span className="eyebrow">CreatorPilot</span>
            <h1>{t(titleKey)}</h1>
            <p className="lead">{t(leadKey)}</p>
            <ul className="auth-points">
              <li>{t('feat_1_title')}</li>
              <li>{t('feat_5_title')}</li>
              <li>{t('feat_6_title')}</li>
            </ul>
          </div>

          <div className="auth-card">
            {children}

            {altPromptKey && altLinkKey && altHref && (
              <p className="auth-alt">
                {t(altPromptKey)} <Link href={altHref}>{t(altLinkKey)}</Link>
              </p>
            )}

            {showBack && (
              <p className="auth-alt">
                <Link href="/login">{t('auth_back_signin')}</Link>
              </p>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
