import BananaMark from './BananaMark';

// The circular account picture shown in search results and on the gallery
// page. Falls back to a plain banana mark when the account has no avatar.
export default function AccountAvatar({ url, size = 48, className = '' }) {
  return (
    <div
      className={`rounded-full bg-banana-200 overflow-hidden flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <BananaMark size={Math.round(size * 0.55)} />
      )}
    </div>
  );
}
