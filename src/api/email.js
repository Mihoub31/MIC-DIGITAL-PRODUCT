'use strict';

const nodemailer = require('nodemailer');

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EMAIL_TIMEOUT_MS = 10000;
const EXPIRES_MINUTES = 60;

const COPY = {
  fr: {
    subject: 'Réinitialisation de votre mot de passe',
    greeting: 'Bonjour {name},',
    heading: 'Réinitialisez votre mot de passe',
    intro: 'Nous avons reçu une demande de réinitialisation du mot de passe de votre compte.',
    button: 'Choisir un nouveau mot de passe',
    expiry: 'Ce lien expire dans {minutes} minutes et ne peut être utilisé qu’une fois.',
    ignore: 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe restera inchangé.',
  },
  en: {
    subject: 'Reset your password',
    greeting: 'Hi {name},',
    heading: 'Reset your password',
    intro: 'We received a request to reset the password for your account.',
    button: 'Choose a new password',
    expiry: 'This link expires in {minutes} minutes and can only be used once.',
    ignore: 'If you did not request this, you can safely ignore this email. Your password will not change.',
  },
  es: {
    subject: 'Restablece tu contraseña',
    greeting: 'Hola {name},',
    heading: 'Restablece tu contraseña',
    intro: 'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.',
    button: 'Elegir una nueva contraseña',
    expiry: 'Este enlace caduca en {minutes} minutos y solo puede usarse una vez.',
    ignore: 'Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no cambiará.',
  },
  ar: {
    subject: 'إعادة تعيين كلمة المرور',
    greeting: 'مرحبًا {name}،',
    heading: 'إعادة تعيين كلمة المرور',
    intro: 'تلقّينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.',
    button: 'اختيار كلمة مرور جديدة',
    expiry: 'تنتهي صلاحية هذا الرابط خلال {minutes} دقيقة ويمكن استخدامه مرة واحدة فقط.',
    ignore: 'إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة، ولن تتغير كلمة المرور.',
  },
  zh: {
    subject: '重置你的密码',
    greeting: '你好，{name}：',
    heading: '重置你的密码',
    intro: '我们收到了重置你账户密码的请求。',
    button: '设置新密码',
    expiry: '此链接将在 {minutes} 分钟后失效，且只能使用一次。',
    ignore: '如果你没有发起此请求，可以忽略此邮件，你的密码不会改变。',
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resetCopy(language) {
  return COPY[language] || COPY.fr;
}

function buildResetEmail({ appName, resetUrl, name, language }) {
  const copy = resetCopy(language);
  const minutes = String(EXPIRES_MINUTES);
  const greeting = copy.greeting.replace('{name}', name || '');
  const expiry = copy.expiry.replace('{minutes}', minutes);
  const subject = `${appName} — ${copy.subject}`;
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const text = [
    greeting,
    '',
    copy.intro,
    '',
    resetUrl,
    '',
    expiry,
    copy.ignore,
    '',
    `— ${appName}`,
  ].join('\n');

  const html = [
    '<!doctype html>',
    `<html lang="${escapeHtml(language || 'fr')}" dir="${dir}">`,
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>',
    '<body style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f2036">',
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px">',
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(greeting)}</p>`,
    `<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(copy.heading)}</h1>`,
    `<p style="margin:0 0 24px;font-size:15px;line-height:1.6">${escapeHtml(copy.intro)}</p>`,
    `<p style="margin:0 0 24px"><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#2f6bff;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${escapeHtml(copy.button)}</a></p>`,
    `<p style="margin:0 0 8px;font-size:13px;color:#5b6b8c">${escapeHtml(expiry)}</p>`,
    `<p style="margin:0 0 24px;font-size:13px;color:#5b6b8c">${escapeHtml(copy.ignore)}</p>`,
    `<p style="margin:0;padding-top:16px;border-top:1px solid #e3e8f2;font-size:12px;color:#8a99b5;word-break:break-all">${escapeHtml(resetUrl)}</p>`,
    `<p style="margin:16px 0 0;font-size:12px;color:#8a99b5">${escapeHtml(appName)}</p>`,
    '</div>',
    '</body>',
    '</html>',
  ].join('');

  return { subject, text, html };
}

function smtpTransportOptions(rawUrl) {
  const url = new URL(rawUrl);
  const port = Number(url.port) || (url.protocol === 'smtps:' ? 465 : 587);
  const options = {
    host: url.hostname,
    port,
    secure: url.protocol === 'smtps:',
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS * 2,
  };

  if (url.username) {
    options.auth = {
      user: decodeURIComponent(url.username),
      pass: decodeURIComponent(url.password),
    };
  }

  return options;
}

function createEmailService(config, deps = {}) {
  const provider = config.smtpUrl ? 'smtp' : config.resendApiKey ? 'resend' : null;
  const fetchImpl = deps.fetch || globalThis.fetch;
  const transport = provider === 'smtp'
    ? (deps.transport || nodemailer.createTransport(smtpTransportOptions(config.smtpUrl)))
    : null;

  async function sendResetEmail({ to, name, resetUrl, language }) {
    if (!provider) throw new Error('Email provider is not configured.');

    const message = buildResetEmail({
      appName: config.appName,
      resetUrl,
      name,
      language,
    });
    const payload = {
      from: config.emailFrom,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    };

    if (provider === 'smtp') {
      await transport.sendMail(payload);
      return;
    }

    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, to: [to] }),
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Resend API responded with HTTP ${response.status}.`);
    }
  }

  return {
    provider,
    configured: Boolean(provider),
    sendResetEmail,
  };
}

module.exports = { buildResetEmail, createEmailService, EXPIRES_MINUTES };
