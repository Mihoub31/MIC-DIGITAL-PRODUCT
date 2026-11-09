'use client';

import { useState, type FormEvent } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('err_required'));
      return;
    }

    setPending(true);
    try {
      await apiRequest('/api/auth/forgot-password', { body: { email: email.trim() } });
      setSent(true);
    } catch (caught) {
      setError(describeError(caught, t));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout titleKey="auth_forgot_title" leadKey="auth_forgot_lead" showBack>
      {sent ? (
        <div className="auth-notice" role="status" aria-live="polite">
          <p>{t('auth_forgot_sent')}</p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="forgot-email">{t('auth_email')}</label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && (
            <p className="form-error" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
            {pending ? t('api_loading') : t('auth_forgot_btn')}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
