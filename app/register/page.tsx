'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useLang, useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';

export default function RegisterPage() {
  const t = useT();
  const { lang } = useLang();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const name = fullName.trim();
    if (!name || !email.trim() || !password) {
      setError(t('err_required'));
      return;
    }
    if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError(t('auth_password_hint'));
      return;
    }

    setPending(true);
    try {
      await apiRequest('/api/auth/register', {
        body: { fullName: name, email: email.trim(), password, language: lang },
      });
      await apiRequest('/api/auth/login', { body: { email: email.trim(), password } });
      router.push('/dashboard');
      router.refresh();
    } catch (caught) {
      setError(describeError(caught, t));
      setPending(false);
    }
  }

  return (
    <AuthLayout
      titleKey="auth_register_title"
      leadKey="auth_register_lead"
      altPromptKey="auth_have_account"
      altLinkKey="auth_signin_btn"
      altHref="/login"
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="register-name">{t('auth_fullname')}</label>
          <input
            id="register-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="register-email">{t('auth_email')}</label>
          <input
            id="register-email"
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
          <label htmlFor="register-password">{t('auth_password')}</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            dir="ltr"
            aria-describedby="register-password-hint"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <small id="register-password-hint" className="field-hint">
            {t('auth_password_hint')}
          </small>
        </div>

        {error && (
          <p className="form-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
          {pending ? t('api_loading') : t('auth_register_btn')}
        </button>
      </form>
    </AuthLayout>
  );
}
