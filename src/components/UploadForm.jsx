import { useRef, useState } from 'react';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { authHeader } from '../utils/accountAuth';
import { useToast } from '../context/ToastContext';

const ACCEPTED_EXT = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'ai'];
const ACCEPT_ATTR = '.jpg,.jpeg,.png,.svg,.webp,.gif,.ai,image/*';
const MAX_BYTES = 20 * 1024 * 1024;

function extOf(filename = '') {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Uploads a new picture into the logged-in friend's gallery. Requires a
// valid account session token (upload is a management action now, gated
// the same way for public and private galleries).
export default function UploadForm({ token, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');
  const [moment, setMoment] = useState('');
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  function pickFile(f) {
    if (!f) return;
    const ext = extOf(f.name);
    if (!ACCEPTED_EXT.includes(ext)) {
      toast.error(`Unsupported format .${ext}. Allowed: ${ACCEPTED_EXT.join(', ').toUpperCase()}`);
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error('File is too large. Max size is 20MB.');
      return;
    }
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^/.]+$/, ''));
    if (f.type.startsWith('image/') && ext !== 'ai') {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview('');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return toast.error('Please choose a picture to upload.');
    if (!name.trim()) return toast.error('Please give this picture a name.');

    const form = new FormData();
    form.append('file', file);
    form.append('name', name.trim());
    form.append('moment', moment.trim());
    form.append('visitorId', getVisitorId());

    setSubmitting(true);
    setProgress(0);
    try {
      const { data } = await api.post('/pictures', form, {
        headers: { 'Content-Type': 'multipart/form-data', ...authHeader(token) },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      onUploaded?.(data);
      setFile(null);
      setPreview('');
      setName('');
      setMoment('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow border border-banana-200 p-5 sm:p-6 space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition flex items-center gap-4 p-4 ${
          dragging ? 'border-banana-500 bg-banana-100' : 'border-banana-300 bg-banana-50 hover:bg-banana-100'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {preview ? (
          <img src={preview} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-banana-200 flex items-center justify-center text-2xl shrink-0">
            {file ? '📄' : '🍌'}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm text-ink-900 truncate">{file ? file.name : 'Drag & drop or tap to choose a picture'}</p>
          <p className="text-xs text-ink-700/60 mt-0.5">JPEG, PNG, SVG, WEBP, GIF or AI · up to 20MB</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pic-name" className="block text-sm font-bold text-ink-900 mb-1.5">
            Picture name
          </label>
          <input
            id="pic-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="e.g. Beach day"
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
          />
        </div>
        <div>
          <label htmlFor="pic-moment" className="block text-sm font-bold text-ink-900 mb-1.5">
            Moment <span className="text-ink-700/50 font-normal">(optional)</span>
          </label>
          <input
            id="pic-moment"
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
            maxLength={200}
            placeholder="What moment does this capture?"
            className="w-full rounded-xl border border-banana-300 px-4 py-2.5 focus-ring"
          />
        </div>
      </div>

      {submitting && (
        <div className="h-2 rounded-full bg-banana-100 overflow-hidden">
          <div className="h-full bg-banana-500 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-banana-500 hover:bg-banana-400 text-ink-900 font-display font-bold transition active:scale-[0.99] disabled:opacity-60 focus-ring"
      >
        {submitting ? `Uploading… ${progress}%` : 'Upload picture 🍌'}
      </button>
    </form>
  );
}
