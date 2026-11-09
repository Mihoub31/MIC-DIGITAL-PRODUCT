export type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: Record<string, string> };
};

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, string>;

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let csrfToken: string | null = null;

async function fetchCsrfToken(force = false): Promise<string> {
  if (csrfToken && !force) return csrfToken;

  const response = await fetch('/api/auth/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new ApiError(response.status, 'session_unavailable', 'Could not start a session.');

  const data = (await response.json()) as { csrfToken?: string };
  if (!data.csrfToken) throw new ApiError(500, 'session_unavailable', 'Could not start a session.');

  csrfToken = data.csrfToken;
  return csrfToken;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

async function perform<T>(path: string, method: string, body: unknown, forceCsrf: boolean): Promise<T> {
  const headers: Record<string, string> = {};
  const mutating = method !== 'GET';

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (mutating) headers['X-CSRF-Token'] = await fetchCsrfToken(forceCsrf);

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    cache: 'no-store',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const parsed = (payload as ApiErrorBody) || {};
    throw new ApiError(
      response.status,
      parsed.error?.code || 'request_failed',
      parsed.error?.message || 'Request failed.',
      parsed.error?.details
    );
  }

  return payload as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || (options.body === undefined ? 'GET' : 'POST');

  try {
    return await perform<T>(path, method, options.body, false);
  } catch (error) {
    if (error instanceof ApiError && error.status === 403 && method !== 'GET') {
      csrfToken = null;
      return perform<T>(path, method, options.body, true);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'network_error', 'Cannot reach the server.');
  }
}

export function errorMessageKey(error: unknown): string {
  if (!(error instanceof ApiError)) return 'api_generic_error';

  switch (error.code) {
    case 'invalid_credentials':
      return 'err_invalid_credentials';
    case 'email_taken':
      return 'err_email_taken';
    case 'rate_limited':
      return 'err_rate_limited';
    case 'account_locked':
      return 'err_account_locked';
    case 'account_suspended':
      return 'err_account_suspended';
    case 'invalid_token':
      return 'err_invalid_token';
    case 'invalid_password':
      return 'err_invalid_password';
    case 'network_error':
      return 'api_network_error';
    default:
      return 'api_generic_error';
  }
}

const DETAIL_MESSAGE_KEYS: Record<string, string> = {
  weak_password: 'auth_password_hint',
  invalid: 'err_invalid_password',
};

// Server validation detail: either a translated code or a human sentence.
function detailMessage(detail: string, t: (key: string) => string): string | null {
  const key = DETAIL_MESSAGE_KEYS[detail];
  if (key) return t(key);
  return /\s/.test(detail) ? detail : null;
}

export function describeError(error: unknown, t: (key: string) => string): string {
  if (!(error instanceof ApiError)) return t('api_generic_error');

  const key = errorMessageKey(error);
  const detail = error.details ? Object.values(error.details).find(Boolean) : undefined;

  if (key !== 'api_generic_error' && key !== 'api_network_error') {
    if (error.code === 'invalid_password' && detail) {
      return detailMessage(detail, t) || t(key);
    }
    return t(key);
  }

  if (detail) {
    const message = detailMessage(detail, t);
    if (message) return message;
  }

  return t(key);
}

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  language: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: string;
};
