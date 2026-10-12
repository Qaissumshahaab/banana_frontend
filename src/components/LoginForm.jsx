import { useState } from 'react';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { setSession } from '../utils/accountAuth';
import { useToast } from '../context/ToastContext';

// Logs into ANY gallery (public or private) with its name + password.
// Used both to unlock a private gallery and to open management on a
// public one. On success, stores the session token and hands the full
// { account, pictures } payload back to the parent.
export default function LoginForm({ slug, defaultName = '', title, subtitle, onSuccess }) {
  const [name, setName] = useState(defaultName);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter the gallery name.');
    if (!password) return toast.error('Please enter the gallery password.');

    setSubmitting(true);
    try {
      const { data } = await api.post(`/accounts/${slug}/login`, {
        name: name.trim(),
        password,
        visitorId: getVisitorId(),
      });
      setSession(slug, { token: data.token });
      onSuccess?.(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Incorrect name or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {(title || subtitle) && (
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">🔐</p>
          {title && <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>}
          {subtitle && <p className="text-ink-700/70 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow border border-banana-200 p-6 space-y-4">
        <div>
          <label htmlFor="login-name" className="block text-sm font-bold text-ink-900 mb-1.5">
            Gallery name
          </label>
          <input
            id="login-name"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
            placeholder="Gallery name"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-bold text-ink-900 mb-1.5">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
            placeholder="Gallery password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-banana-500 hover:bg-banana-400 text-ink-900 font-display font-bold transition active:scale-[0.99] disabled:opacity-60 focus-ring"
        >
          {submitting ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
