import { useEffect, useState } from 'react';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { useReactions } from '../hooks/useReactions';
import CardGrid from '../components/CardGrid';

export default function TopPictures() {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { like, dislike } = useReactions(setPictures);

  useEffect(() => {
    setLoading(true);
    const visitorId = getVisitorId();
    api
      .get('/pictures/top', { params: { page, limit: 24, visitorId } })
      .then(({ data }) => {
        setPictures(data.pictures);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">🏆 Top Pictures</h1>
        <p className="text-ink-700/70 text-sm mt-1">Every picture, ranked by likes — newest breaks ties.</p>
      </div>

      <CardGrid pictures={pictures} loading={loading} onLike={like} onDislike={dislike} emptyMessage="No pictures yet." />

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full text-sm font-bold bg-banana-200 disabled:opacity-40 hover:bg-banana-300 transition focus-ring"
          >
            ← Prev
          </button>
          <span className="text-sm font-semibold text-ink-900/70">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full text-sm font-bold bg-banana-200 disabled:opacity-40 hover:bg-banana-300 transition focus-ring"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
