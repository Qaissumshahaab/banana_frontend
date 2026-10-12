import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import { setSession } from '../utils/accountAuth';
import AccountAvatar from '../components/AccountAvatar';

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const avatarInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  function pickAvatar(f) {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file for the account picture.');
      return;
    }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error('Please enter a name with at least 2 characters.');
      return;
    }
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    const form = new FormData();
    form.append('name', name.trim());
    form.append('isPrivate', isPrivate);
    form.append('password', password);
    form.append('confirmPassword', confirm);
    if (avatarFile) form.append('avatar', avatarFile);

    setSubmitting(true);
    try {
      const { data } = await api.post('/accounts', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSession(data.account.slug, { token: data.token });
      toast.success(`Gallery "${data.account.name}" created! 🍌`);
      navigate(`/g/${data.account.slug}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create gallery. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-8">
        <p className="text-4xl mb-2">🍌</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">Make a Gallery</h1>
        <p className="text-ink-700/70 text-sm mt-1">Free forever — no email needed, just a name and a password.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow border border-banana-200 p-6 space-y-5">
        <div className="flex items-center gap-4">
          <AccountAvatar url={avatarPreview} size={64} />
          <div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickAvatar(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="text-sm font-bold text-ink-900 bg-banana-200 hover:bg-banana-300 px-3.5 py-2 rounded-full transition focus-ring"
            >
              {avatarPreview ? 'Change picture' : 'Add a picture'}
            </button>
            <p className="text-xs text-ink-700/50 mt-1">Optional — a banana icon is used if you skip this.</p>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-bold text-ink-900 mb-1.5">
            Gallery name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="e.g. Sarah's Trip Pics"
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 text-ink-900 placeholder:text-ink-900/30 focus-ring"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-ink-900 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 4 characters"
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-bold text-ink-900 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-type password"
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
          />
          <p className="text-xs text-ink-700/50 mt-1.5">
            You'll use this name + password to log in later and manage pictures — don't lose it, there's no email recovery.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-banana-50 border border-banana-200 px-4 py-3">
          <div>
            <p className="font-bold text-sm text-ink-900">Make it private</p>
            <p className="text-xs text-ink-700/60">
              {isPrivate
                ? 'Only people who log in with the password can view it.'
                : 'Anyone can view it — logging in is only needed to add or manage pictures.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            onClick={() => setIsPrivate((v) => !v)}
            className={`w-12 h-7 rounded-full transition relative focus-ring shrink-0 ${isPrivate ? 'bg-banana-500' : 'bg-banana-200'}`}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPrivate ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-banana-500 hover:bg-banana-400 text-ink-900 font-display font-bold text-base transition active:scale-[0.99] disabled:opacity-60 focus-ring"
        >
          {submitting ? 'Creating…' : 'Create my gallery 🍌'}
        </button>
      </form>
    </div>
  );
}
