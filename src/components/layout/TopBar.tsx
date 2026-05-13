import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const A = {
  bg: '#0a0a0c',
  surface: '#14141a',
  surface2: '#1c1c23',
  border: 'rgba(255,248,230,0.06)',
  border2: 'rgba(255,248,230,0.10)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  muted: '#847d6f',
  amber: '#d4a056',
};

export const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-[260px] z-40"
      style={{
        background: 'rgba(10,10,12,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${A.border}`,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      {/* Search bar */}
      <div
        style={{
          flex: 1,
          maxWidth: 580,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          height: 40,
          background: A.surface,
          border: `1px solid ${A.border}`,
          borderRadius: 999,
          transition: 'all 0.2s ease',
        }}
        className="focus-within:border-[var(--amber)] focus-within:shadow-[0_0_0_1px_var(--amber)]"
      >
        <MagnifyingGlass size={18} weight="bold" color={A.muted} />
        <input
          type="text"
          placeholder="Szukaj w bibliotece…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: A.text,
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={14} weight="bold" color={A.muted} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Profile */}
      <div
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4a056, #b76a8a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            color: A.bg,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {user?.displayName?.[0] || user?.email?.[0] || 'U'}
        </div>
        <div className="hidden md:flex" style={{ flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: A.text }}>
            {user?.displayName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

