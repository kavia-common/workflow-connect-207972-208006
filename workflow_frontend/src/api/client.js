const DEFAULT_TIMEOUT_MS = 20000;

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the backend base URL (no trailing slash). */
  const fromEnv = process.env.REACT_APP_API_BASE_URL;
  const base = (fromEnv && fromEnv.trim()) ? fromEnv.trim() : 'http://localhost:3001';
  return base.replace(/\/+$/, '');
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);

  // If caller provided a signal, abort our controller when it aborts.
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
  }

  return { signal: controller.signal, cancel: () => clearTimeout(timeoutId) };
}

async function parseJsonSafely(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_e) {
    return { raw: text };
  }
}

async function request(path, { method = 'GET', body, headers = {}, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const timeout = withTimeout(signal, timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: timeout.signal,
    });

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      const msg = (data && (data.detail || data.message)) ? (data.detail || data.message) : `Request failed (${res.status})`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } finally {
    timeout.cancel();
  }
}

// PUBLIC_INTERFACE
export const api = {
  /** Minimal API wrapper. Expand as backend routes become available. */
  health: () => request('/'),
};
