import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { useReactions } from '../hooks/useReactions';
import HeroSlider from '../components/HeroSlider';
import CardGrid from '../components/CardGrid';

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { like, dislike } = useReactions(setPictures);

  useEffect(() => {
    const visitorId = getVisitorId();
    Promise.allSettled([
      api.get('/slider'),
      api.get('/pictures/home', { params: { limit: 12, visitorId } }),
    ]).then(([slideRes, picRes]) => {
      if (slideRes.status === 'fulfilled') setSlides(slideRes.value.data);
      if (picRes.status === 'fulfilled') setPictures(picRes.value.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <HeroSlider slides={slides} />

      <section className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">Loved by friends</h1>
            <p className="text-ink-700/70 text-sm mt-1">The most-liked pictures across every gallery.</p>
          </div>
          <Link to="/top" className="hidden sm:inline-block text-sm font-bold text-ink-900 bg-banana-200 hover:bg-banana-300 px-4 py-2 rounded-full transition focus-ring">
            See all →
          </Link>
        </div>

        <CardGrid pictures={pictures} loading={loading} onLike={like} onDislike={dislike} emptyMessage="No pictures yet — be the first to upload!" />
      </section>

      <section className="mt-14 grid sm:grid-cols-3 gap-4">
        <Link to="/create-account" className="rounded-2xl p-5 bg-banana-500 text-ink-900 card-shadow hover:bg-banana-400 transition group">
          <p className="text-3xl mb-2">✨</p>
          <p className="font-display font-bold text-lg">Make a Gallery</p>
          <p className="text-sm text-ink-900/70 mt-1">Free, no email — just a name.</p>
        </Link>
        <Link to="/accounts" className="rounded-2xl p-5 bg-white border border-banana-200 card-shadow hover:border-banana-400 transition">
          <p className="text-3xl mb-2">🔎</p>
          <p className="font-display font-bold text-lg">Find a Gallery</p>
          <p className="text-sm text-ink-700/70 mt-1">Search by name and open it up.</p>
        </Link>
        <Link to="/premium" className="rounded-2xl p-5 bg-white border border-banana-200 card-shadow hover:border-banana-400 transition">
          <p className="text-3xl mb-2">👑</p>
          <p className="font-display font-bold text-lg">Premium Pics</p>
          <p className="text-sm text-ink-700/70 mt-1">The most-liked pictures, front and center.</p>
        </Link>
      </section>
    </div>
  );
}
