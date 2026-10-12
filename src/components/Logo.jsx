import BananaMark from './BananaMark';

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <BananaMark size={26} />
      <span className="font-display text-xl font-bold tracking-tight text-ink-900">
        KELA<span className="text-banana-600">.com</span>
      </span>
    </div>
  );
}
