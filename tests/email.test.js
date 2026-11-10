'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildResetEmail, createEmailService } = require('../src/api/email');
const { loadConfig } = require('../src/api/config');

const BASE_ENV = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/test',
  SESSION_SECRET: 'x'.repeat(40),
};

const RESET_URL = 'https://app.example.com/reset-password/?token=abc123&next=%2Fdashboard';

test('buildResetEmail renders the reset link and escapes HTML', () => {
  const message = buildResetEmail({
    appName: 'CreatorPilot',
    resetUrl: RESET_URL,
    name: '<b>Ana</b> & Co',
    language: 'fr',
  });

  assert.match(message.subject, /Réinitialisation de votre mot de passe/);
  assert.ok(message.text.includes(RESET_URL));
  assert.ok(message.text.includes('Bonjour <b>Ana</b> & Co,'));
  assert.ok(message.html.includes('token=abc123&amp;next=%2Fdashboard'));
  assert.ok(message.html.includes('&lt;b&gt;Ana&lt;/b&gt; &amp; Co'));
  assert.ok(!message.html.includes('<b>Ana</b>'));
  assert.ok(message.html.includes('dir="ltr"'));
});

test('buildResetEmail is right-to-left and localized in Arabic', () => {
  const message = buildResetEmail({
    appName: 'CreatorPilot',
    resetUrl: RESET_URL,
    name: 'أنا',
    language: 'ar',
  });

  assert.match(message.subject, /إعادة تعيين كلمة المرور/);
  assert.ok(message.text.includes('مرحبًا أنا،'));
  assert.ok(message.html.includes('dir="rtl"'));
  assert.ok(message.html.includes('lang="ar"'));
});

test('buildResetEmail falls back to French for an unknown language', () => {
  const message = buildResetEmail({
    appName: 'CreatorPilot',
    resetUrl: RESET_URL,
    name: 'Ana',
    language: 'de',
  });

  assert.match(message.subject, /Réinitialisation/);
});

test('SMTP service sends through the injected transport', async () => {
  let sent = null;
  const transport = {
    sendMail: async (payload) => {
      sent = payload;
    },
  };
  const service = createEmailService(
    {
      appName: 'CreatorPilot',
      emailFrom: 'CreatorPilot <no-reply@example.com>',
      smtpUrl: 'smtp://localhost:2525',
      resendApiKey: '',
    },
    { transport }
  );

  assert.equal(service.provider, 'smtp');
  assert.equal(service.configured, true);

  await service.sendResetEmail({
    to: 'user@example.com',
    name: 'Ana',
    resetUrl: RESET_URL,
    language: 'en',
  });

  assert.equal(sent.from, 'CreatorPilot <no-reply@example.com>');
  assert.equal(sent.to, 'user@example.com');
  assert.match(sent.subject, /Reset your password/);
  assert.ok(sent.text.includes(RESET_URL));
  assert.ok(sent.html.includes(RESET_URL.replace('&', '&amp;')));
});

test('Resend service posts the message with a bearer token', async () => {
  let request = null;
  const service = createEmailService(
    {
      appName: 'CreatorPilot',
      emailFrom: 'CreatorPilot <no-reply@example.com>',
      smtpUrl: '',
      resendApiKey: 're_test_key',
    },
    {
      fetch: async (url, options) => {
        request = { url, options };
        return { ok: true, status: 200 };
      },
    }
  );

  assert.equal(service.provider, 'resend');

  await service.sendResetEmail({
    to: 'user@example.com',
    name: 'Ana',
    resetUrl: RESET_URL,
    language: 'es',
  });

  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.Authorization, 'Bearer re_test_key');
  assert.equal(request.options.headers['Content-Type'], 'application/json');

  const body = JSON.parse(request.options.body);
  assert.equal(body.from, 'CreatorPilot <no-reply@example.com>');
  assert.deepEqual(body.to, ['user@example.com']);
  assert.match(body.subject, /Restablece tu contraseña/);
  assert.ok(body.text.includes(RESET_URL));
});

test('Resend failures throw without leaking the API key', async () => {
  const service = createEmailService(
    {
      appName: 'CreatorPilot',
      emailFrom: 'CreatorPilot <no-reply@example.com>',
      smtpUrl: '',
      resendApiKey: 're_secret_key',
    },
    { fetch: async () => ({ ok: false, status: 422 }) }
  );

  await assert.rejects(
    service.sendResetEmail({
      to: 'user@example.com',
      name: 'Ana',
      resetUrl: RESET_URL,
      language: 'en',
    }),
    (error) => {
      assert.match(error.message, /HTTP 422/);
      assert.ok(!error.message.includes('re_secret_key'));
      return true;
    }
  );
});

test('unconfigured service refuses to send', async () => {
  const service = createEmailService({
    appName: 'CreatorPilot',
    emailFrom: '',
    smtpUrl: '',
    resendApiKey: '',
  });

  assert.equal(service.configured, false);
  assert.equal(service.provider, null);
  await assert.rejects(
    service.sendResetEmail({
      to: 'user@example.com',
      name: 'Ana',
      resetUrl: RESET_URL,
      language: 'en',
    }),
    /not configured/
  );
});

test('config prefers SMTP over Resend and requires EMAIL_FROM for SMTP', () => {
  const config = loadConfig({
    ...BASE_ENV,
    SMTP_URL: 'smtp://user:pass@mail.example.com:587',
    EMAIL_FROM: 'CreatorPilot <no-reply@example.com>',
    RESEND_API_KEY: 're_test_key',
  });

  assert.equal(config.emailProvider, 'smtp');
  assert.equal(config.emailConfigured, true);
  assert.equal(config.emailFrom, 'CreatorPilot <no-reply@example.com>');
  assert.equal(config.resendApiKey, '');

  assert.throws(
    () => loadConfig({ ...BASE_ENV, SMTP_URL: 'smtp://mail.example.com:587' }),
    /EMAIL_FROM is required/
  );
});

test('config defaults the Resend sender to onboarding@resend.dev', () => {
  const config = loadConfig({ ...BASE_ENV, RESEND_API_KEY: 're_test_key' });

  assert.equal(config.emailProvider, 'resend');
  assert.equal(config.emailFrom, 'CreatorPilot <onboarding@resend.dev>');
});

test('config rejects an invalid SMTP_URL or EMAIL_FROM', () => {
  assert.throws(
    () => loadConfig({ ...BASE_ENV, SMTP_URL: 'https://mail.example.com' }),
    /smtp:\/\/ or smtps:\/\//
  );
  assert.throws(
    () => loadConfig({ ...BASE_ENV, SMTP_URL: 'not a url' }),
    /valid URL/
  );
  assert.throws(
    () => loadConfig({ ...BASE_ENV, RESEND_API_KEY: 're_test_key', EMAIL_FROM: 'not-an-email' }),
    /EMAIL_FROM must be a valid email address/
  );
});

test('config reports no provider when email variables are empty', () => {
  const config = loadConfig({ ...BASE_ENV, SMTP_URL: '  ', RESEND_API_KEY: '  ', EMAIL_FROM: '' });

  assert.equal(config.emailProvider, null);
  assert.equal(config.emailConfigured, false);
  assert.equal(config.emailFrom, '');
});
