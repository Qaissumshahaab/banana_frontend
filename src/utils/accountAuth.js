// Per-gallery login sessions. Each account (public or private) can be
// logged into with its name + password, which returns a JWT scoped to
// that one account. We keep that token in sessionStorage, keyed by slug,
// so a friend doesn't have to re-type the password every time they revisit
// the same gallery in this browser tab/session — but it isn't persisted
// forever (sessionStorage clears when the tab closes), which is the right
// default for a shared/borrowed computer.

function key(slug) {
  return `kela_session_${slug}`;
}

export function getSession(slug) {
  try {
    const raw = sessionStorage.getItem(key(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(slug, { token }) {
  try {
    sessionStorage.setItem(key(slug), JSON.stringify({ token }));
  } catch {
    /* ignore storage errors (private mode, etc.) */
  }
}

export function clearSession(slug) {
  try {
    sessionStorage.removeItem(key(slug));
  } catch {
    /* ignore */
  }
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
