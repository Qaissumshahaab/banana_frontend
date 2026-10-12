import BananaMark from './BananaMark';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-banana-300/60 bg-banana-100/60">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-ink-900/80">
          <BananaMark size={20} />
          <span className="font-display font-semibold">KELA.com</span>
          <span className="text-sm">— a gallery for friends.</span>
        </div>
        <p className="text-xs text-ink-900/60">
          Free to use. No email required. Made for sharing moments with friends.
        </p>
      </div>
    </footer>
  );
}
