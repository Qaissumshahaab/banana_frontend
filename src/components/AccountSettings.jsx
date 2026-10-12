import { useRef, useState } from 'react';
import api from '../api/client';
import { authHeader, setSession } from '../utils/accountAuth';
import { useToast } from '../context/ToastContext';
import AccountAvatar from './AccountAvatar';

// Lets the logged-in friend change this gallery's name, password and
// picture. Any change requires the current password, same as a normal
// account-settings screen.
export default function AccountSettings({ token, account, onUpdated, onSlugChanged }) {
  const [name, setName] = useState(account.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const avatarInputRef = useRef(null);
  const toast = useToast();

  function pickAvatar(f) {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    setAvatarFile(f);
    setRemoveAvatar(false);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password to save changes.');
      return;
    }
    if (newPassword && newPassword.length < 4) {
      toast.error('New password must be at least 4 characters.');
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    const form = new FormData();
    form.append('currentPassword', currentPassword);
    if (name.trim() && name.trim() !== account.name) form.append('name', name.trim());
    if (newPassword) {
      form.append('newPassword', newPassword);
      form.append('confirmNewPassword', confirmNewPassword);
    }
    if (avatarFile) form.append('avatar', avatarFile);
    else if (removeAvatar) form.append('removeAvatar', 'true');

    setSubmitting(true);
    try {
      const { data } = await api.put('/accounts/me', form, {
        headers: { 'Content-Type': 'multipart/form-data', ...authHeader(token) },
      });
      setSession(data.account.slug, { token: data.token });
      toast.success('Settings saved! 🍌');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setAvatarFile(null);
      setAvatarPreview('');
      setRemoveAvatar(false);
      onUpdated?.(data.account, data.token);
      if (data.account.slug !== account.slug) onSlugChanged?.(data.account.slug);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save changes.');
    } finally {
      setSubmitting(false);
    }
  }

  const showingAvatar = avatarPreview || (!removeAvatar && account.avatarUrl) || '';

  return (
    <form onSubmit={handleSubmit} className="max-w-lg bg-white rounded-2xl card-shadow border border-banana-200 p-6 space-y-6">
      <div>
        <p className="text-sm font-bold text-ink-900 mb-2">Gallery picture</p>
        <div className="flex items-center gap-4">
          <AccountAvatar url={showingAvatar} size={64} />
          <div className="flex flex-col gap-1.5">
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
              Change picture
            </button>
            {(account.avatarUrl || avatarFile) && !removeAvatar && (
              <button
                type="button"
                onClick={() => {
                  setRemoveAvatar(true);
                  setAvatarFile(null);
                  setAvatarPreview('');
                }}
                className="text-xs font-semibold text-red-600 hover:underline text-left"
              >
                Remove picture
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="settings-name" className="block text-sm font-bold text-ink-900 mb-1.5">
          Gallery name
        </label>
        <input
          id="settings-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
        />
        <p className="text-xs text-ink-700/50 mt-1.5">Changing this changes your gallery's link too.</p>
      </div>

      <div className="border-t border-banana-100 pt-5">
        <label htmlFor="new-password" className="block text-sm font-bold text-ink-900 mb-1.5">
          New password <span className="text-ink-700/50 font-normal">(leave blank to keep current)</span>
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 4 characters"
          className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring mb-3"
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
        />
      </div>

      <div className="border-t border-banana-100 pt-5">
        <label htmlFor="current-password" className="block text-sm font-bold text-ink-900 mb-1.5">
          Current password <span className="text-red-500">*</span>
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Required to save any change"
          className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-banana-500 hover:bg-banana-400 text-ink-900 font-display font-bold transition active:scale-[0.99] disabled:opacity-60 focus-ring"
      >
        {submitting ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
