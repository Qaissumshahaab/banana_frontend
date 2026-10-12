import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';
import { useReactions } from '../hooks/useReactions';
import { useToast } from '../context/ToastContext';
import { getSession, clearSession, authHeader } from '../utils/accountAuth';
import CardGrid from '../components/CardGrid';
import AccountAvatar from '../components/AccountAvatar';
import LoginForm from '../components/LoginForm';
import ManageGallery from '../components/ManageGallery';
import AccountSettings from '../components/AccountSettings';

export default function AccountGallery() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // 'loading' | 'notfound' | 'locked' | 'ready'
  const [state, setState] = useState('loading');
  const [account, setAccount] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState('gallery'); // gallery | manage | settings
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { like, dislike } = useReactions(setPictures);

  const load = useCallback(async () => {
    setState('loading');
    setShowLoginPrompt(false);
    const visitorId = getVisitorId();
    const saved = getSession(slug);

    // If we have a saved session for this gallery, try restoring it first —
    // this works for both public and private galleries.
    if (saved?.token) {
      try {
        const { data } = await api.get('/accounts/me', {
          headers: authHeader(saved.token),
          params: { visitorId },
        });
        if (data.account.slug === slug) {
          setAccount(data.account);
          setPictures(data.pictures);
          setToken(saved.token);
          setLoggedIn(true);
          setTab('gallery');
          setState('ready');
          return;
        }
      } catch {
        clearSession(slug);
      }
    }

    // Anonymous view.
    try {
      const { data } = await api.get(`/accounts/${slug}`, { params: { visitorId } });
      if (data.locked) {
        setAccount({ name: data.name, slug: data.slug, isPrivate: true });
        setState('locked');
      } else {
        setAccount(data.account);
        setPictures(data.pictures);
        setLoggedIn(false);
        setTab('gallery');
        setState('ready');
      }
    } catch (err) {
      if (err?.response?.status === 404) setState('notfound');
      else {
        setState('notfound');
        toast.error('Could not load this gallery. Please try again.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  function handleLoginSuccess(data) {
    setAccount(data.account);
    setPictures(data.pictures);
    setToken(data.token);
    setLoggedIn(true);
    setTab('gallery');
    setShowLoginPrompt(false);
    setState('ready');
    toast.success(`Welcome back, ${data.account.name}! 🍌`);
  }

  function handleLogout() {
    clearSession(slug);
    setToken(null);
    setLoggedIn(false);
    if (account?.isPrivate) {
      setPictures([]);
      setState('locked');
    } else {
      setTab('gallery');
    }
  }

  function handleSlugChanged(newSlug) {
    navigate(`/g/${newSlug}`, { replace: true });
  }

  if (state === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl animate-pulse">🍌</p>
        <p className="text-ink-700/60 text-sm mt-2">Loading gallery…</p>
      </div>
    );
  }

  if (state === 'notfound') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-3">🙈</p>
        <h1 className="font-display text-2xl font-bold text-ink-900">Gallery not found</h1>
        <p className="text-ink-700/70 text-sm mt-2">That gallery name doesn't exist (yet).</p>
        <Link to="/accounts" className="inline-block mt-5 text-sm font-bold text-ink-900 bg-banana-300 hover:bg-banana-400 px-5 py-2.5 rounded-full transition">
          Search galleries →
        </Link>
      </div>
    );
  }

  if (state === 'locked') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <LoginForm
          slug={slug}
          title="Private Gallery"
          subtitle="Enter the gallery name and password to view it."
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <AccountAvatar url={account?.avatarUrl} size={56} />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 flex items-center gap-2">
              {account?.name}
              {account?.isPrivate ? <span title="Private gallery">🔒</span> : <span title="Public gallery">🌐</span>}
            </h1>
            <p className="text-ink-700/60 text-sm">
              {pictures.length} picture{pictures.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-bold bg-banana-100 hover:bg-banana-200 text-ink-900 transition focus-ring"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => setShowLoginPrompt((v) => !v)}
            className="px-4 py-2 rounded-full text-sm font-bold bg-banana-500 hover:bg-banana-400 text-ink-900 transition active:scale-95 card-shadow focus-ring"
          >
            {showLoginPrompt ? 'Close' : '🔐 Log in to manage'}
          </button>
        )}
      </div>

      {showLoginPrompt && !loggedIn && (
        <div className="mb-10 animate-fade-rise">
          <LoginForm
            slug={slug}
            defaultName={account?.name}
            subtitle="Log in with this gallery's name and password to upload, edit and manage pictures."
            onSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {loggedIn && (
        <div className="flex items-center gap-1 mb-8 border-b border-banana-200">
          {[
            { id: 'gallery', label: 'Gallery' },
            { id: 'manage', label: 'Manage Gallery' },
            { id: 'settings', label: 'Settings' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition focus-ring -mb-px border-b-2 ${
                tab === t.id
                  ? 'border-banana-500 text-ink-900'
                  : 'border-transparent text-ink-700/50 hover:text-ink-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'gallery' && (
        <CardGrid
          pictures={pictures}
          loading={false}
          onLike={like}
          onDislike={dislike}
          emptyMessage="No pictures here yet — be the first to upload one!"
        />
      )}

      {loggedIn && tab === 'manage' && (
        <ManageGallery token={token} pictures={pictures} onPicturesChange={setPictures} />
      )}

      {loggedIn && tab === 'settings' && (
        <AccountSettings
          token={token}
          account={account}
          onUpdated={(updatedAccount, newToken) => {
            setAccount(updatedAccount);
            setToken(newToken);
          }}
          onSlugChanged={handleSlugChanged}
        />
      )}
    </div>
  );
}
