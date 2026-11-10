'use strict';

const LANGUAGES = ['fr', 'en', 'es', 'ar', 'zh'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function collect(errors, field, condition, message) {
  if (condition && !errors[field]) errors[field] = message;
}

function validateEmail(email, errors, field = 'email') {
  const value = normalizeEmail(email);
  collect(errors, field, !value, 'Email is required.');
  collect(errors, field, value.length > 254, 'Email is too long.');
  collect(errors, field, Boolean(value) && !EMAIL_PATTERN.test(value), 'Email address is not valid.');
  return value;
}

function validatePassword(password, errors, field = 'password') {
  const value = String(password || '');
  collect(errors, field, !value, 'Password is required.');
  collect(errors, field, value.length > 0 && value.length < 10, 'Password must be at least 10 characters.');
  collect(errors, field, value.length > 200, 'Password is too long.');
  collect(errors, field, value.length > 0 && !/[A-Za-z]/.test(value), 'Password must contain a letter.');
  collect(errors, field, value.length > 0 && !/\d/.test(value), 'Password must contain a number.');
  return value;
}

function validateName(name, errors, field = 'fullName') {
  const value = normalizeName(name);
  collect(errors, field, !value, 'Full name is required.');
  collect(errors, field, value.length > 0 && value.length < 2, 'Full name is too short.');
  collect(errors, field, value.length > 150, 'Full name is too long.');
  return value;
}

function validateWorkspaceName(name, errors, field = 'name') {
  const value = normalizeName(name);
  collect(errors, field, !value, 'Workspace name is required.');
  collect(errors, field, value.length > 0 && value.length < 2, 'Workspace name is too short.');
  collect(errors, field, value.length > 150, 'Workspace name is too long.');
  return value;
}

function validateLanguage(language, errors, field = 'language') {
  if (language === undefined || language === null || language === '') return 'fr';
  const value = String(language).toLowerCase();
  collect(errors, field, !LANGUAGES.includes(value), 'Unsupported language.');
  return value;
}

function validateRegistration(body = {}) {
  const errors = {};
  const fullName = validateName(body.fullName, errors);
  const email = validateEmail(body.email, errors);
  const password = validatePassword(body.password, errors);
  const language = validateLanguage(body.language, errors);
  return { errors, values: { fullName, email, password, language } };
}

function validateLogin(body = {}) {
  const errors = {};
  const email = validateEmail(body.email, errors);
  const password = String(body.password || '');
  collect(errors, 'password', !password, 'Password is required.');
  return { errors, values: { email, password } };
}

function validateProfileUpdate(body = {}) {
  const errors = {};
  const values = {};
  if (body.fullName !== undefined) values.fullName = validateName(body.fullName, errors);
  if (body.language !== undefined) values.language = validateLanguage(body.language, errors);
  collect(errors, '_', Object.keys(values).length === 0, 'Nothing to update.');
  return { errors, values };
}

function validatePasswordChange(body = {}) {
  const errors = {};
  const currentPassword = String(body.currentPassword || '');
  collect(errors, 'currentPassword', !currentPassword, 'Current password is required.');
  const newPassword = validatePassword(body.newPassword, errors, 'newPassword');
  collect(
    errors,
    'newPassword',
    currentPassword && newPassword && currentPassword === newPassword,
    'New password must be different from the current one.'
  );
  return { errors, values: { currentPassword, newPassword } };
}

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

module.exports = {
  LANGUAGES,
  normalizeEmail,
  hasErrors,
  validateEmail,
  validateWorkspaceName,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
};
