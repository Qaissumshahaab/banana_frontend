import PictureCard from './PictureCard';
import SkeletonCard from './SkeletonCard';

export default function CardGrid({ pictures, loading, onLike, onDislike, emptyMessage, showAccountBadges }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!pictures || pictures.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-banana-300 bg-banana-100/50">
        <p className="text-4xl mb-2">🍌</p>
        <p className="font-display font-semibold text-ink-900">{emptyMessage || 'No pictures yet.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {pictures.map((pic, i) => (
        <PictureCard
          key={pic._id}
          picture={pic}
          index={i}
          onLike={onLike}
          onDislike={onDislike}
          showAccountBadge={showAccountBadges ? pic.accountName : undefined}
        />
      ))}
    </div>
  );
}
