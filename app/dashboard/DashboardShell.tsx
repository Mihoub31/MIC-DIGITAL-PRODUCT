'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { languages, useLang, useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';
import type { SessionUser, WorkspaceSummary } from '../lib/api';

type Tab = 'overview' | 'profile' | 'security' | 'language';

const LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  ar: 'ar',
  zh: 'zh-CN',
};

const ROLE_KEYS = new Set(['owner', 'admin', 'manager', 'member', 'client']);

function initials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function DashboardShell({
  initialUser,
  workspaces,
}: {
  initialUser: SessionUser;
  workspaces: WorkspaceSummary[];
}) {
  const t = useT();
  const { lang, setLang } = useLang();
  const router = useRouter();

  const [user, setUser] = useState(initialUser);
  const [tab, setTab] = useState<Tab>('overview');
  const [signingOut, setSigningOut] = useState(false);

  const [fullName, setFullName] = useState(initialUser.fullName);
  const [profileError, setProfileError] = useState('');
  const [profileNotice, setProfileNotice] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [languageError, setLanguageError] = useState('');
  const [languageNotice, setLanguageNotice] = useState('');
  const [savingLanguage, setSavingLanguage] = useState(false);

  const languageSynced = useRef(false);

  useEffect(() => {
    if (languageSynced.current) return;
    languageSynced.current = true;

    // The device choice is the most recent explicit action, so it wins over a
    // stale account value; the account is updated to match instead of reverting.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('lang');
    } catch {}

    const deviceLanguage = languages.some((item) => item.code === stored) ? stored : null;

    if (!deviceLanguage) {
      if (user.language) setLang(user.language);
      return;
    }

    setLang(deviceLanguage);
    if (deviceLanguage !== user.language) {
      apiRequest('/api/users/me', { method: 'PATCH', body: { language: deviceLanguage } }).catch(() => {});
    }
  }, [user.language, setLang]);

  const locale = LOCALES[lang] || 'fr-FR';

  function formatDate(value: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
  }

  function roleLabel(role: string): string {
    return ROLE_KEYS.has(role) ? t(`role_${role}`) : role;
  }

  function statusLabel(status: string): string {
    if (status === 'pending') return t('dash_status_pending');
    if (status === 'active') return t('dash_status_active');
    if (status === 'suspended') return t('dash_status_suspended');
    return status;
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // A dead session must still land the visitor on a signed-out page.
    }
    router.push('/');
    router.refresh();
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError('');
    setProfileNotice('');

    if (!fullName.trim()) {
      setProfileError(t('err_required'));
      return;
    }

    setSavingProfile(true);
    try {
      const data = await apiRequest<{ user: SessionUser }>('/api/users/me', {
        method: 'PATCH',
        body: { fullName: fullName.trim(), language: lang },
      });
      setUser(data.user);
      setFullName(data.user.fullName);
      setProfileNotice('dash_saved');
    } catch (caught) {
      setProfileError(describeError(caught, t));
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError('');
    setPasswordNotice('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('err_required'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('err_password_mismatch'));
      return;
    }
    if (newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError(t('auth_password_hint'));
      return;
    }

    setSavingPassword(true);
    try {
      await apiRequest('/api/users/me/password', {
        body: { currentPassword, newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordNotice('dash_password_updated');
    } catch (caught) {
      setPasswordError(describeError(caught, t));
    } finally {
      setSavingPassword(false);
    }
  }

  async function chooseLanguage(code: string) {
    setLanguageError('');
    setLanguageNotice('');
    setSavingLanguage(true);
    try {
      await apiRequest('/api/users/me', { method: 'PATCH', body: { language: code } });
      setLang(code);
      setUser((previous) => ({ ...previous, language: code }));
      setLanguageNotice('dash_saved');
    } catch (caught) {
      setLanguageError(describeError(caught, t));
    } finally {
      setSavingLanguage(false);
    }
  }

  const tabs: Array<{ id: Tab; key: string }> = [
    { id: 'overview', key: 'dash_nav_overview' },
    { id: 'profile', key: 'dash_nav_profile' },
    { id: 'security', key: 'dash_nav_security' },
    { id: 'language', key: 'dash_nav_language' },
  ];

  return (
    <main className="page-shell dash-page">
      <header className="site-header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="CreatorPilot home">
            <span className="brand-mark">C</span>
            <span>CreatorPilot</span>
          </Link>

          <div className="dash-account">
            <span className="dash-avatar" aria-hidden="true">{initials(user.fullName) || 'C'}</span>
            <span className="dash-account-meta">
              <strong>{user.fullName}</strong>
              <small dir="ltr">{user.email}</small>
            </span>
            <button className="btn btn-secondary dash-signout" type="button" onClick={signOut} disabled={signingOut}>
              {t('dash_signout')}
            </button>
          </div>
        </div>
      </header>

      <section className="section dash-section">
        <div className="container dash-layout">
          <nav className="dash-sidebar" aria-label={t('dash_nav_label')}>
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`dash-tab${tab === item.id ? ' is-active' : ''}`}
                aria-current={tab === item.id ? 'page' : undefined}
                onClick={() => setTab(item.id)}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          <div className="dash-panel">
            {tab === 'overview' && (
              <section aria-labelledby="dash-overview-title">
                <h1 id="dash-overview-title" className="dash-title">
                  {t('dash_welcome')} {user.fullName}
                </h1>
                <p className="lead">{t('dash_language_hint')}</p>

                <dl className="dash-facts">
                  <div>
                    <dt>{t('dash_account')}</dt>
                    <dd dir="ltr">{user.email}</dd>
                  </div>
                  <div>
                    <dt>{t('dash_status')}</dt>
                    <dd>
                      <span className={`status-pill status-${user.status}`}>{statusLabel(user.status)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{t('dash_member_since')}</dt>
                    <dd>{formatDate(user.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>{t('dash_last_login')}</dt>
                    <dd>{formatDate(user.lastLoginAt)}</dd>
                  </div>
                </dl>

                <h2 className="dash-subtitle">{t('dash_workspaces')}</h2>
                {workspaces.length === 0 ? (
                  <p className="dash-empty">{t('dash_no_workspace')}</p>
                ) : (
                  <ul className="dash-workspaces">
                    {workspaces.map((workspace) => (
                      <li key={workspace.id} className="dash-workspace">
                        <span className="dash-workspace-name">{workspace.name}</span>
                        <span className="role-pill">{roleLabel(workspace.role)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {tab === 'profile' && (
              <section aria-labelledby="dash-profile-title">
                <h2 id="dash-profile-title" className="dash-subtitle">{t('dash_profile_title')}</h2>
                <form className="auth-form dash-form" onSubmit={saveProfile} noValidate>
                  <div className="field">
                    <label htmlFor="profile-name">{t('auth_fullname')}</label>
                    <input
                      id="profile-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="profile-email">{t('auth_email')}</label>
                    <input id="profile-email" type="email" value={user.email} dir="ltr" readOnly />
                  </div>

                  {profileError && (
                    <p className="form-error" role="alert" aria-live="polite">{profileError}</p>
                  )}
                  {profileNotice && (
                    <p className="form-success" role="status" aria-live="polite">{t(profileNotice)}</p>
                  )}

                  <button className="btn btn-primary auth-submit" type="submit" disabled={savingProfile}>
                    {savingProfile ? t('api_loading') : t('dash_save')}
                  </button>
                </form>
              </section>
            )}

            {tab === 'security' && (
              <section aria-labelledby="dash-security-title">
                <h2 id="dash-security-title" className="dash-subtitle">{t('dash_security_title')}</h2>
                <form className="auth-form dash-form" onSubmit={savePassword} noValidate>
                  <div className="field">
                    <label htmlFor="security-current">{t('dash_current_password')}</label>
                    <input
                      id="security-current"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      dir="ltr"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="security-new">{t('auth_new_password')}</label>
                    <input
                      id="security-new"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      dir="ltr"
                      aria-describedby="security-new-hint"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <small id="security-new-hint" className="field-hint">{t('auth_password_hint')}</small>
                  </div>

                  <div className="field">
                    <label htmlFor="security-confirm">{t('auth_confirm_password')}</label>
                    <input
                      id="security-confirm"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  {passwordError && (
                    <p className="form-error" role="alert" aria-live="polite">{passwordError}</p>
                  )}
                  {passwordNotice && (
                    <p className="form-success" role="status" aria-live="polite">{t(passwordNotice)}</p>
                  )}

                  <button className="btn btn-primary auth-submit" type="submit" disabled={savingPassword}>
                    {savingPassword ? t('api_loading') : t('dash_update_password')}
                  </button>
                </form>
              </section>
            )}

            {tab === 'language' && (
              <section aria-labelledby="dash-language-title">
                <h2 id="dash-language-title" className="dash-subtitle">{t('dash_language_title')}</h2>
                <p className="lead">{t('dash_language_hint')}</p>

                <ul className="dash-languages">
                  {languages.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        className={`dash-language${lang === item.code ? ' is-active' : ''}`}
                        aria-pressed={lang === item.code}
                        disabled={savingLanguage}
                        onClick={() => chooseLanguage(item.code)}
                      >
                        <span>{item.label}</span>
                        <span className="dash-language-code">{item.code.toUpperCase()}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {languageError && (
                  <p className="form-error" role="alert" aria-live="polite">{languageError}</p>
                )}
                {languageNotice && (
                  <p className="form-success" role="status" aria-live="polite">{t(languageNotice)}</p>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
