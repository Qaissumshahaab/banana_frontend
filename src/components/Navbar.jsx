import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/premium', label: 'Premium' },
  { to: '/top', label: 'Top Pictures' },
  { to: '/accounts', label: 'Find a Gallery' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-semibold transition-colors focus-ring ${
      isActive
        ? 'bg-ink-900 text-banana-200'
        : 'text-ink-900/80 hover:bg-banana-200/70 hover:text-ink-900'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-banana-50/85 border-b border-banana-300/60">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="focus-ring rounded-lg" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate('/create-account')}
            className="px-4 py-2 rounded-full text-sm font-bold bg-banana-500 text-ink-900 hover:bg-banana-400 active:scale-95 transition card-shadow focus-ring"
          >
            + Make a Gallery
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-banana-200 focus-ring"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="#2b2410" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-banana-300/60 bg-banana-50 px-4 py-3 flex flex-col gap-1 animate-fade-rise">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              navigate('/create-account');
            }}
            className="mt-2 px-4 py-2 rounded-full text-sm font-bold bg-banana-500 text-ink-900 hover:bg-banana-400 active:scale-95 transition focus-ring"
          >
            + Make a Gallery
          </button>
        </div>
      )}
    </header>
  );
}
