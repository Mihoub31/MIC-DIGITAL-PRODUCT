'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    try {
      await apiRequest('/api/auth/login', { body: { email, password } });
      router.push('/dashboard');
      router.refresh();
    } catch (caught) {
      setError(describeError(caught, t));
      setPending(false);
    }
  }

  return (
    <AuthLayout
      titleKey="auth_signin_title"
      leadKey="auth_signin_lead"
      altPromptKey="auth_no_account"
      altLinkKey="auth_create_account"
      altHref="/register"
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-email">{t('auth_email')}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">{t('auth_password')}</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            dir="ltr"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <p className="form-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
          {pending ? t('api_loading') : t('auth_signin_btn')}
        </button>

        <p className="auth-alt auth-alt-inline">
          <Link href="/forgot-password">{t('auth_forgot_link')}</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
