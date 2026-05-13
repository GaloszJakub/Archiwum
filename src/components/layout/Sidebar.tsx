import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Download, Film, Tv, FileText, Sparkles, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const A = {
  bg: '#0a0a0c',
  surface: '#14141a',
  surface2: '#1c1c23',
  border: 'rgba(255,248,230,0.06)',
  border2: 'rgba(255,248,230,0.10)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  muted: '#847d6f',
  subtle: '#58524a',
  amber: '#d4a056',
  amberDim: 'rgba(212,160,86,0.18)',
};

interface SidebarProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const Sidebar = ({ onClose, showCloseButton }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/', exact: true, Icon: Home, label: 'Główna' },
    { path: '/search', exact: false, Icon: Search, label: 'Wyszukaj' },
    { path: '/collections', exact: false, Icon: Heart, label: 'Moja lista' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin/users', exact: false, Icon: Shield, label: 'Admin' });
  }

  const libraryItems = [
    { path: '/movies', label: 'Filmy', Icon: Film },
    { path: '/series', label: 'Seriale', Icon: Tv },
  ];

  const genreItems = [
    { label: 'Dramat', id: 18 },
    { label: 'Sci-Fi', id: 878 },
    { label: 'Komedia', id: 35 },
    { label: 'Thriller', id: 53 },
    { label: 'Dokument', id: 99 },
  ];

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <aside
      style={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        background: A.bg,
        borderRight: `1px solid ${A.border}`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      aria-label="Nawigacja boczna"
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid ${A.border}`, marginBottom: 20 }}>
        <Link to="/" onClick={onClose} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: '"Instrument Serif", "Times New Roman", serif',
                fontStyle: 'italic',
                fontSize: 28,
                color: A.text,
                lineHeight: 1,
              }}
            >
              Archiwum
            </span>
          </div>
        </Link>
        <div
          style={{
            fontSize: 10,
            color: A.amber,
            letterSpacing: '0.18em',
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          NAS · LOCAL
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
        {navItems.map(({ path, exact, Icon, label }) => {
          const active = isActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                background: active ? A.surface2 : 'transparent',
                color: active ? A.text : A.text2,
                fontSize: 13.5,
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                position: 'relative',
              }}
            >
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    left: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 18,
                    background: A.amber,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon size={18} style={{ color: active ? A.text : A.text2, strokeWidth: 1.75 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Biblioteka section */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: A.muted,
            textTransform: 'uppercase',
          }}
        >
          Biblioteka
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
        {libraryItems.map(({ path, label }) => {
          const active = isActive(path, false);
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                color: active ? A.text : A.text2,
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Gatunki section */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: A.muted,
            textTransform: 'uppercase',
          }}
        >
          Gatunki
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
        {genreItems.map(({ label, id }) => (
          <Link
            key={id}
            to={`/movies?genre=${id}`}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 12px',
              borderRadius: 8,
              color: A.text2,
              fontSize: 12.5,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div style={{ padding: '12px 12px 16px' }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 8,
            color: A.muted,
            fontSize: 13,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            fontFamily: 'inherit',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <LogOut size={17} style={{ color: A.muted, strokeWidth: 1.75 }} />
          <span>Wyloguj</span>
        </button>
      </div>
    </aside>
  );
};
