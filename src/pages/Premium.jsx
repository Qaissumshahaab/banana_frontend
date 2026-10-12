import { useEffect, useState } from 'react';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { useReactions } from '../hooks/useReactions';
import CardGrid from '../components/CardGrid';

export default function Premium() {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { like, dislike } = useReactions(setPictures);

  useEffect(() => {
    const visitorId = getVisitorId();
    api
      .get('/pictures/premium', { params: { limit: 30, visitorId } })
      .then(({ data }) => setPictures(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-3xl banana-gradient p-6 sm:p-8 mb-8 card-shadow">
        <p className="text-3xl mb-1">👑</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">Premium</h1>
        <p className="text-ink-900/70 text-sm mt-1 max-w-xl">
          The crowd favorites — pictures with the most likes from across every public gallery.
        </p>
      </div>

      <CardGrid
        pictures={pictures}
        loading={loading}
        onLike={like}
        onDislike={dislike}
        emptyMessage="Nothing liked yet — go spread some love on the Home page!"
      />
    </div>
  );
}
