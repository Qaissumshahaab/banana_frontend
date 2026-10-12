import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import AccountAvatar from '../components/AccountAvatar';

function AccountSkeleton() {
  return (
    <div className="rounded-2xl border border-banana-200 bg-white p-4 animate-pulse flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-banana-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/2 bg-banana-200 rounded" />
        <div className="h-2.5 w-1/3 bg-banana-100 rounded" />
      </div>
    </div>
  );
}

export default function AccountsSearch() {
  const [search, setSearch] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .get('/accounts', { params: { search, page, limit: 18 } })
        .then(({ data }) => {
          setAccounts(data.accounts);
          setPages(data.pages);
        })
        .finally(() => setLoading(false));
    }, 300); // debounce
    return () => clearTimeout(t);
  }, [search, page]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">Find a Gallery</h1>
        <p className="text-ink-700/70 text-sm mt-1">Search by name to open and upload to a friend's gallery.</p>
      </div>

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search gallery names…"
          className="w-full rounded-full border border-banana-300 bg-white pl-11 pr-4 py-3 focus-ring"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AccountSkeleton key={i} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-banana-300 bg-banana-100/50">
          <p className="text-4xl mb-2">🙈</p>
          <p className="font-display font-semibold text-ink-900">No galleries found.</p>
          <Link to="/create-account" className="inline-block mt-3 text-sm font-bold text-ink-900 bg-banana-300 hover:bg-banana-400 px-4 py-2 rounded-full transition">
            Create one →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 animate-fade-rise">
          {accounts.map((acc) => (
            <Link
              key={acc._id}
              to={`/g/${acc.slug}`}
              className="rounded-2xl border border-banana-200 bg-white p-4 flex items-center gap-3 hover:border-banana-400 hover:shadow-md card-shadow transition"
            >
              <AccountAvatar url={acc.avatarUrl} size={48} />
              <div className="min-w-0">
                <p className="font-display font-bold text-ink-900 truncate">{acc.name}</p>
                <p className="text-xs text-ink-700/60">
                  {acc.pictureCount} picture{acc.pictureCount === 1 ? '' : 's'}
                  {acc.isPrivate ? ' · 🔒 Private' : ' · 🌐 Public'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

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
