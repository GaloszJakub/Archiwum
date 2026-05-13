/* ARCHIWUM — Mobile Browse / Grid view */

function MobileBrowse() {
  const items = [
    { tone: 'a', title: 'Lorem Ipsum',      kind: 'Film',   year: 2024, runtime: '2h 14m', rating: 8.4, badge: '4K' },
    { tone: 'b', title: 'Dolor Sit',        kind: 'Serial', year: 2023, runtime: 'S3 · 24 ep.', rating: 9.1, badge: 'HDR' },
    { tone: 'c', title: 'Consectetur',      kind: 'Film',   year: 2024, runtime: '1h 48m', rating: 7.6 },
    { tone: 'd', title: 'Adipiscing Elit',  kind: 'Film',   year: 2022, runtime: '2h 02m', rating: 8.0, badge: '4K' },
    { tone: 'e', title: 'Sed Do Eiusmod',   kind: 'Serial', year: 2024, runtime: 'S1 · 8 ep.', rating: 7.9 },
    { tone: 'f', title: 'Tempor Incidi.',   kind: 'Film',   year: 2021, runtime: '1h 36m', rating: 8.8 },
    { tone: 'g', title: 'Ut Labore',        kind: 'Film',   year: 2023, runtime: '2h 21m', rating: 7.2, badge: 'HDR' },
    { tone: 'h', title: 'Magna Aliqua',     kind: 'Serial', year: 2022, runtime: 'S2 · 16 ep.', rating: 8.5 },
    { tone: 'a', title: 'Ad Minim',         kind: 'Film',   year: 2024, runtime: '1h 52m', rating: 7.7 },
    { tone: 'c', title: 'Quis Nostrud',     kind: 'Film',   year: 2020, runtime: '2h 06m', rating: 8.3, badge: '4K' },
  ];

  return (
    <div style={{ background: A.bg, minHeight: '100%', color: A.text, paddingBottom: 100 }}>
      {/* Header — large title */}
      <div style={{ padding: '64px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 11, color: A.muted, letterSpacing: '0.18em',
            textTransform: 'uppercase', fontWeight: 600,
          }}>Biblioteka</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <button style={iconBtn2}>{Icon.search(20, A.text2)}</button>
            <button style={iconBtn2}>{Icon.filter(18, A.text2)}</button>
          </div>
        </div>
        <h1 style={{
          margin: '8px 0 4px',
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400,
          fontSize: 44, lineHeight: 1, letterSpacing: '-0.02em',
          color: A.text,
        }}>Wszystko</h1>
        <div style={{ fontSize: 13, color: A.muted, fontFamily: 'var(--mono)' }}>
          427 pozycji <span style={{ color: A.subtle }}>· uporządkowane: nowe</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar" style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '22px 22px 0',
      }}>
        <span className="chip is-active">Wszystko · 427</span>
        <span className="chip">Filmy · 248</span>
        <span className="chip">Seriale · 124</span>
        <span className="chip">Dokumenty · 33</span>
        <span className="chip">Animacja · 22</span>
      </div>

      {/* Sort row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 22px 12px',
      }}>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: A.muted, alignItems: 'center' }}>
          <span style={{ color: A.text2, fontWeight: 500 }}>Sortuj:</span>
          <span style={{ color: A.text, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Najnowsze {Icon.chevron(8, A.text)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {/* grid view toggle (active) */}
          <button style={{
            ...iconBtn2,
            background: A.surface2, borderRadius: 6, width: 28, height: 28,
            border: `1px solid ${A.border2}`,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="0.5" fill={A.text}/>
              <rect x="8" y="1" width="5" height="5" rx="0.5" fill={A.text}/>
              <rect x="1" y="8" width="5" height="5" rx="0.5" fill={A.text}/>
              <rect x="8" y="8" width="5" height="5" rx="0.5" fill={A.text}/>
            </svg>
          </button>
          {/* list view */}
          <button style={{ ...iconBtn2, width: 28, height: 28 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={A.muted} strokeWidth="1.4" strokeLinecap="round">
              <path d="M2 3h10M2 7h10M2 11h10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* GRID */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px 12px', padding: '0 22px',
      }}>
        {items.map((it, i) => (
          <div key={i}>
            <div style={{ position: 'relative' }}>
              <Poster tone={it.tone} badge={it.badge} />
              {/* Mini kind label, top-right */}
              <div style={{
                position: 'absolute', top: 6, right: 6,
                fontSize: 9, fontWeight: 600, letterSpacing: '0.06em',
                color: A.text2,
                padding: '2px 5px', borderRadius: 3,
                background: 'rgba(10,10,12,0.7)',
                backdropFilter: 'blur(6px)',
                textTransform: 'uppercase',
              }}>{it.kind === 'Serial' ? 'SERIAL' : 'FILM'}</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 15.5, color: A.text, lineHeight: 1.1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.title}</div>
              <div style={{
                fontSize: 11, color: A.muted, marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{it.year}</span>
                <span style={{ color: A.subtle }}>·</span>
                <span>{it.runtime}</span>
              </div>
              <div style={{
                fontSize: 10.5, color: A.amber, marginTop: 5,
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--mono)',
              }}>
                {Icon.star(10)} <span>{it.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more sentinel */}
      <div style={{
        margin: '28px 22px 0',
        padding: '14px',
        textAlign: 'center', color: A.muted,
        fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
        borderTop: `1px dashed ${A.border2}`,
      }}>
        Wczytano 10 z 427 pozycji
      </div>

      {/* Bottom tab bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 84,
        background: 'linear-gradient(to top, rgba(10,10,12,0.97) 60%, rgba(10,10,12,0))',
        backdropFilter: 'blur(20px)',
        borderTop: `0.5px solid ${A.border}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        paddingBottom: 18,
      }}>
        {[
          { icon: Icon.home, label: 'Główna' },
          { icon: Icon.search, label: 'Szukaj' },
          { icon: Icon.list, label: 'Moja lista', active: true },
          { icon: Icon.download, label: 'Pobrane' },
          { icon: Icon.profile, label: 'Konto' },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: t.active ? A.text : A.muted,
          }}>
            {t.icon(20, t.active ? A.text : A.muted)}
            <span style={{ fontSize: 10, fontWeight: t.active ? 600 : 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const iconBtn2 = {
  width: 36, height: 36, borderRadius: 999,
  background: 'transparent', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
};

Object.assign(window, { MobileBrowse });
