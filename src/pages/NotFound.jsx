import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">🍌</p>
      <h1 className="font-display text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="text-ink-700/70 text-sm mt-2">This page slipped on a banana peel.</p>
      <Link to="/" className="inline-block mt-6 text-sm font-bold text-ink-900 bg-banana-300 hover:bg-banana-400 px-5 py-2.5 rounded-full transition">
        ← Back home
      </Link>
    </div>
  );
}
