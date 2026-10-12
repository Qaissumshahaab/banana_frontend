// A lightweight anonymous id stored in this browser only, so like/dislike
// toggles are per-visitor without requiring any account/email system.
const KEY = 'banana_visitor_id';

export function getVisitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        (crypto.randomUUID && crypto.randomUUID()) ||
        `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to a
    // session-only id so the app still functions.
    return `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}
