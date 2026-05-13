import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || 'Użytkownik';
  const initial = firstName[0]?.toUpperCase() || 'U';

  const menuItems = [
    { label: 'Informacje o koncie', sub: user?.email || '', icon: undefined, action: undefined },
    { label: 'Wygląd', sub: theme === 'dark' ? 'Ciemny motyw' : 'Jasny motyw', icon: theme === 'dark' ? Sun : Moon, action: toggleTheme },
    { label: 'Powiadomienia', sub: '', icon: undefined, action: undefined },
    { label: 'Zainstaluj jako aplikację', sub: 'PWA', icon: undefined, action: undefined },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Panel admina', sub: '', icon: Crown, action: () => navigate('/admin/users') });
  }

  return (
    <div className="space-y-6 pb-20 max-w-lg">
      {/* Header */}
      <h1 style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
        Konto
      </h1>

      {/* Identity card */}
      <div
        className="flex items-center gap-4"
        style={{ padding: '14px 16px', border: '2px solid var(--ink)', borderRadius: 4, background: 'var(--paper)' }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            border: '2px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--ink)',
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
            {user?.displayName || 'Użytkownik'}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink-3)' }}>
            {user?.email}
          </div>
          {isAdmin && (
            <div
              style={{
                marginTop: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                padding: '1px 8px',
                border: '1.5px solid var(--ink)',
                borderRadius: 3,
                background: 'var(--ink)',
                color: 'var(--paper)',
              }}
            >
              <Crown style={{ width: 10, height: 10 }} />
              Administrator
            </div>
          )}
        </div>
      </div>

      {/* Stats grid — wireframe ProfileV1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {[
          { n: '—', label: 'Filmy', color: 'var(--red)' },
          { n: '—', label: 'Seriale', color: 'var(--blue)' },
          { n: '—', label: 'Kolekcje', color: 'var(--ink)' },
        ].map(({ n, label, color }) => (
          <div key={label} style={{ border: '1.5px solid var(--line)', background: 'var(--paper)', padding: '10px 4px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 26, fontWeight: 700, color, lineHeight: 1.1 }}>{n}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="section-title" style={{ marginTop: 8 }}>Ustawienia</div>
      <div style={{ border: '1.5px solid var(--line)', overflow: 'hidden' }}>
        {menuItems.map(({ label, sub, icon: Icon, action }, i) => (
          <div
            key={label}
            className="list-item-interactive flex items-center justify-between"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' && action) action(); }}
            style={{
              padding: '0 14px',
              minHeight: 52,
              borderBottom: i < menuItems.length - 1 ? '1px dashed var(--line)' : 'none',
              background: 'var(--paper)',
              display: 'flex',
              alignItems: 'center',
              cursor: action ? 'pointer' : 'default',
            }}
            onClick={() => { if (action) action(); }}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon style={{ width: 16, height: 16, color: 'var(--ink-3)', flexShrink: 0 }} />}
              <div>
                <span style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 18, color: 'var(--ink)' }}>{label}</span>
                {sub && (
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink-3)', marginTop: 1 }}>
                    {sub}
                  </div>
                )}
              </div>
            </div>
            {action && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'var(--ink-3)' }}>›</span>}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleSignOut}
        aria-label="Wyloguj się"
        className="list-item-interactive flex items-center gap-3 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          padding: '0 14px',
          minHeight: 52,
          border: '1.5px solid var(--line)',
          borderRadius: 4,
          background: 'var(--paper)',
          touchAction: 'manipulation',
        }}
      >
        <LogOut aria-hidden="true" style={{ width: 16, height: 16, color: 'var(--red)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>Wyloguj się</span>
      </button>
    </div>
  );
};

export default Profile;
