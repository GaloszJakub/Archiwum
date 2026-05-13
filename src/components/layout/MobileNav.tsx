import { Link, useLocation } from 'react-router-dom';
import { Home, Film, FolderHeart, Tv } from 'lucide-react';

const A = {
  bg: '#0a0a0c',
  border: 'rgba(255,248,230,0.06)',
  text: '#f3efe6',
  muted: '#847d6f',
};

const navItems = [
  { path: '/', exact: true, Icon: Home, label: 'Główna' },
  { path: '/movies', exact: false, Icon: Film, label: 'Filmy' },
  { path: '/collections', exact: false, Icon: FolderHeart, label: 'Moja lista' },
  { path: '/series', exact: false, Icon: Tv, label: 'Seriale' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Nawigacja główna"
    >
      <div
        style={{
          height: 84,
          background: 'linear-gradient(to top, rgba(10,10,12,0.97) 60%, rgba(10,10,12,0))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `0.5px solid ${A.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom, 18px)',
          fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        }}
      >
        {navItems.map(({ path, exact, Icon, label }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);

          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
                color: isActive ? A.text : A.muted,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon
                size={20}
                style={{
                  color: isActive ? A.text : A.muted,
                  strokeWidth: isActive ? 2 : 1.75,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
