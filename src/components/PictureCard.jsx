import { useState } from 'react';

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7.5-4.6-10-9C.5 8.6 2.8 4 7 4c2.2 0 3.7 1.3 5 3 1.3-1.7 2.8-3 5-3 4.2 0 6.5 4.6 5 8-2.5 4.4-10 9-10 9z" strokeLinejoin="round" />
    </svg>
  );
}
function DislikeIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M17 14V3M17 14l-5.5 7c-.8 0-1.5-.7-1.5-1.5V17H5a2 2 0 0 1-2-2l1-7a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PictureCard({ picture, index = 0, onLike, onDislike, showAccountBadge }) {
  const [busy, setBusy] = useState(false);
  const [pop, setPop] = useState('');

  const isSvgOrRaw = picture.format === 'svg' || picture.resourceType === 'raw';

  async function handle(action, fn) {
    if (busy) return;
    setBusy(true);
    setPop(action);
    try {
      await fn(picture._id);
    } finally {
      setBusy(false);
      setTimeout(() => setPop(''), 300);
    }
  }

  return (
    <figure
      className="group relative rounded-2xl overflow-hidden bg-white card-shadow border border-banana-200/70 animate-fade-rise"
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
    >
      <div className="relative aspect-[4/5] bg-banana-100 overflow-hidden">
        <img
          src={picture.url}
          alt={picture.name}
          loading="lazy"
          className={`w-full h-full ${isSvgOrRaw ? 'object-contain p-6' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
        />
        <a
          href={picture.downloadUrl || picture.url}
          download
          target="_blank"
          rel="noreferrer"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-ink-900 shadow hover:bg-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition focus-ring"
          title="Download"
          aria-label={`Download ${picture.name}`}
        >
          <DownloadIcon />
        </a>
      </div>

      <figcaption className="p-3">
        <p className="font-display font-semibold text-sm text-ink-900 truncate" title={picture.name}>
          {picture.name}
        </p>
        {picture.moment ? (
          <p className="text-xs text-ink-700/70 truncate mt-0.5" title={picture.moment}>
            {picture.moment}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => handle('like', onLike)}
            disabled={!onLike || busy}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition focus-ring ${
              picture.likedByMe
                ? 'bg-banana-500 text-ink-900'
                : 'bg-banana-100 text-ink-900/70 hover:bg-banana-200'
            } ${pop === 'like' ? 'animate-pop' : ''}`}
            aria-pressed={picture.likedByMe}
          >
            <HeartIcon filled={picture.likedByMe} /> {picture.likes ?? 0}
          </button>
          <button
            onClick={() => handle('dislike', onDislike)}
            disabled={!onDislike || busy}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition focus-ring ${
              picture.dislikedByMe
                ? 'bg-ink-900 text-banana-100'
                : 'bg-banana-100 text-ink-900/70 hover:bg-banana-200'
            } ${pop === 'dislike' ? 'animate-pop' : ''}`}
            aria-pressed={picture.dislikedByMe}
          >
            <DislikeIcon filled={picture.dislikedByMe} /> {picture.dislikes ?? 0}
          </button>

          {showAccountBadge ? (
            <span className="ml-auto text-[10px] uppercase tracking-wide font-bold text-leaf-600 bg-leaf-500/10 px-2 py-1 rounded-full truncate max-w-[6rem]">
              {showAccountBadge}
            </span>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
