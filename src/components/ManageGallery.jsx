import { useState } from 'react';
import api from '../api/client';
import { authHeader } from '../utils/accountAuth';
import { useToast } from '../context/ToastContext';
import UploadForm from './UploadForm';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PictureRow({ picture, token, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(picture.name);
  const [moment, setMoment] = useState(picture.moment || '');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  async function handleSave() {
    if (!name.trim()) return toast.error('Picture name cannot be empty.');
    setSaving(true);
    try {
      const { data } = await api.put(
        `/pictures/${picture._id}`,
        { name: name.trim(), moment: moment.trim() },
        { headers: authHeader(token) }
      );
      onUpdated(data);
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/pictures/${picture._id}`, { headers: authHeader(token) });
      onDeleted(picture._id);
      toast.success('Picture deleted.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete picture.');
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl card-shadow border border-banana-200 p-3 flex items-center gap-4">
      <img src={picture.url} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0 bg-banana-100" />

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="Picture name"
              className="w-full rounded-lg border border-banana-300 px-3 py-1.5 text-sm font-semibold focus-ring"
            />
            <input
              value={moment}
              onChange={(e) => setMoment(e.target.value)}
              maxLength={200}
              placeholder="Moment (optional)"
              className="w-full rounded-lg border border-banana-300 px-3 py-1.5 text-xs focus-ring"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="text-xs font-bold text-leaf-600 hover:underline disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(picture.name);
                  setMoment(picture.moment || '');
                }}
                className="text-xs font-bold text-ink-700/50 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-left w-full">
            <p className="font-semibold text-sm text-ink-900 truncate">{picture.name}</p>
            <p className="text-xs text-ink-700/50 truncate">{picture.moment || <span className="italic">No moment — click to add</span>}</p>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <a
          href={picture.downloadUrl || picture.url}
          download
          target="_blank"
          rel="noreferrer"
          title="Download"
          aria-label={`Download ${picture.name}`}
          className="w-8 h-8 rounded-full hover:bg-banana-100 transition focus-ring flex items-center justify-center text-ink-900/70"
        >
          <DownloadIcon />
        </a>
        <button
          onClick={() => setConfirming(true)}
          className="ml-1 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-full border border-red-200 hover:border-red-600 transition focus-ring"
        >
          Delete
        </button>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" onClick={() => !deleting && setConfirming(false)}>
          <div className="bg-white rounded-2xl card-shadow p-6 max-w-sm w-full animate-fade-rise" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl mb-2">⚠️</p>
            <h2 className="font-display text-lg font-bold text-ink-900">Delete "{picture.name}"?</h2>
            <p className="text-sm text-ink-700/70 mt-1">This removes the picture permanently. This cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setConfirming(false)} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-banana-100 hover:bg-banana-200 text-ink-900 font-bold text-sm transition focus-ring">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-60 focus-ring">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageGallery({ token, pictures, onPicturesChange }) {
  function handleUploaded(newPic) {
    onPicturesChange([newPic, ...pictures]);
  }
  function handleUpdated(updated) {
    onPicturesChange(pictures.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
  }
  function handleDeleted(id) {
    onPicturesChange(pictures.filter((p) => p._id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold text-ink-900 mb-3">Add a picture</h2>
        <UploadForm token={token} onUploaded={handleUploaded} />
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink-900 mb-3">
          Your pictures <span className="text-ink-700/50 font-normal">({pictures.length})</span>
        </h2>
        {pictures.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-banana-300 bg-banana-100/50">
            <p className="text-3xl mb-2">🍌</p>
            <p className="font-display font-semibold text-ink-900">No pictures yet — add your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pictures.map((p) => (
              <PictureRow key={p._id} picture={p} token={token} onUpdated={handleUpdated} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
