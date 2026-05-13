import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { useTheme } from '@/contexts/ThemeContext';

const A = {
  bg: '#0a0a0c',
  border: 'rgba(255,248,230,0.1)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  red: '#ef4444',
  amber: '#d4a056',
};

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

  const initial = user?.displayName?.[0]?.toUpperCase() || 'U';

  const menuItems = [
    { label: 'Informacje o koncie', sub: user?.email || '', action: undefined },
    { label: 'Wygląd interfejsu', sub: theme === 'dark' ? 'Tryb kinowy' : 'Tryb jasny', action: toggleTheme },
    { label: 'Powiadomienia', sub: 'Zarządzaj powiadomieniami', action: undefined },
    { label: 'Instalacja PWA', sub: 'Pobierz aplikację', action: undefined },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Panel administracyjny', sub: 'Pełny dostęp', action: () => navigate('/admin/users') });
  }

  return (
    <div 
      className="pb-24 px-4 sm:px-14 pt-16 max-w-2xl mx-auto"
      style={{
        fontFamily: '"Inter Tight", "Inter", -apple-system, sans-serif',
      }}
    >
      {/* Identity Area - No borders, pure typography */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56 }}>
        <div
          style={{
            width: 70,
            height: 70,
            background: 'linear-gradient(135deg, rgba(212,160,86,0.1) 0%, transparent 100%)',
            border: `1px solid rgba(212,160,86,0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Instrument Serif", serif',
            fontSize: 32,
            fontStyle: 'italic',
            color: A.amber,
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(212,160,86,0.05)',
          }}
        >
          {initial}
        </div>
        <div>
          <h1 
            style={{ 
              fontSize: 34, 
              fontWeight: 400, 
              color: A.text, 
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1
            }}
          >
            {user?.displayName || 'Użytkownik'}
          </h1>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, marginTop: 6, letterSpacing: '0.02em' }}>
            {user?.email}
          </div>
          {isAdmin && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, background: A.amber }} />
              <span style={{ fontSize: 11, color: A.amber, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Konto Administratora
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats - No tiles, just elegant dividers */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        borderTop: `1px solid ${A.border}`, 
        borderBottom: `1px solid ${A.border}`, 
        padding: '32px 0',
        marginBottom: 56
      }}>
        {[
          { n: '—', label: 'Filmy' },
          { n: '—', label: 'Seriale' },
          { n: '—', label: 'Kolekcje' },
        ].map(({ n, label }) => (
          <div key={label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 36, color: A.text, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 11, color: A.text2, marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Menu List - Editorial style */}
      <div style={{ fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24, fontWeight: 500 }}>
        Ustawienia konta
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {menuItems.map(({ label, sub, action }) => (
          <div
            key={label}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' && action) action(); }}
            style={{
              padding: '24px 0',
              borderBottom: `1px solid ${A.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: action ? 'pointer' : 'default',
            }}
            onClick={() => { if (action) action(); }}
            className="group"
          >
            <div>
              <div 
                style={{ fontSize: 18, fontWeight: 400, color: A.text, transition: 'color 0.3s' }}
                className={action ? "group-hover:text-[#d4a056]" : ""}
              >
                {label}
              </div>
              {sub && (
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, marginTop: 8 }}>
                  {sub}
                </div>
              )}
            </div>
            {action && (
              <span 
                style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 24, color: A.text2, transition: 'transform 0.3s' }}
                className="group-hover:translate-x-2 group-hover:text-[#d4a056]"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Logout - Minimalist text button */}
      <div style={{ marginTop: 56 }}>
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-3 transition-opacity hover:opacity-70 active:opacity-50"
          style={{
            background: 'transparent',
            border: 'none',
            color: A.red,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <SignOut size={20} weight="light" />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Wyloguj ze wszystkich urządzeń
          </span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
