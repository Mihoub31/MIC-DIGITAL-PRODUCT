'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';

function ResetPasswordForm() {
  const t = useT();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!token) {
      setError(t('err_invalid_token'));
      return;
    }
    if (!password || !confirm) {
      setError(t('err_required'));
      return;
    }
    if (password !== confirm) {
      setError(t('err_password_mismatch'));
      return;
    }
    if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError(t('auth_password_hint'));
      return;
    }

    setPending(true);
    try {
      await apiRequest('/api/auth/reset-password', { body: { token, password } });
      setDone(true);
    } catch (caught) {
      setError(describeError(caught, t));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="auth-notice" role="status" aria-live="polite">
        <p>{t('auth_reset_done')}</p>
        <p className="auth-alt">
          <Link href="/login">{t('auth_back_signin')}</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="reset-password">{t('auth_new_password')}</label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          dir="ltr"
          aria-describedby="reset-password-hint"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <small id="reset-password-hint" className="field-hint">
          {t('auth_password_hint')}
        </small>
      </div>

      <div className="field">
        <label htmlFor="reset-confirm">{t('auth_confirm_password')}</label>
        <input
          id="reset-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          dir="ltr"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </div>

      {error && (
        <p className="form-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
        {pending ? t('api_loading') : t('auth_reset_btn')}
      </button>
    </form>
  );
}

function ResetFallback() {
  const t = useT();
  return (
    <p className="auth-notice" role="status">
      {t('api_loading')}
    </p>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout titleKey="auth_reset_title" leadKey="auth_reset_lead" showBack>
      <Suspense fallback={<ResetFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
