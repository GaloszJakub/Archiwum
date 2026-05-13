/* ARCHIWUM — Mobile Home (main library) */

function MobileHome() {
  const dark = true;

  const continueWatching = [
    { tone: 'a', title: 'Lorem Ipsum', sub: 'S2 · E04', progress: 62, runtime: '— 18 min' },
    { tone: 'd', title: 'Dolor Sit Amet', sub: 'Film',     progress: 31, runtime: '— 1h 12m' },
    { tone: 'b', title: 'Tempor Incididunt', sub: 'S1 · E07', progress: 88, runtime: '— 6 min' },
    { tone: 'e', title: 'Magna Aliqua', sub: 'Film',     progress: 14, runtime: '— 1h 48m' },
  ];

  const recentlyAdded = [
    { tone: 'c', title: 'Quis Nostrud',   year: 2024, kind: 'Film' },
    { tone: 'f', title: 'Ullamco',        year: 2023, kind: 'Serial' },
    { tone: 'g', title: 'Voluptate',      year: 2024, kind: 'Film' },
    { tone: 'h', title: 'Excepteur',      year: 2022, kind: 'Serial' },
    { tone: 'b', title: 'Occaecat',       year: 2024, kind: 'Film' },
  ];

  const collection = [
    { tone: 'd', title: 'Adipiscing',    badge: '4K' },
    { tone: 'a', title: 'Eiusmod',       badge: 'HDR' },
    { tone: 'e', title: 'Cillum',        badge: '4K' },
    { tone: 'g', title: 'Pariatur',      badge: null },
  ];

  return (
    <div style={{ background: A.bg, minHeight: '100%', paddingBottom: 100, color: A.text }}>
      {/* HERO ═══════════════════════════════════════════════ */}
      <div style={{ position: 'relative', height: 560 }}>
        {/* Background art */}
        <div className="poster-ph ph-tone-d grain" style={{
          position: 'absolute', inset: 0,
        }}>
          {/* Compositional shapes */}
          <div style={{
            position: 'absolute', top: 60, right: -40,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(212,160,86,0.30), rgba(0,0,0,0) 65%)',
            filter: 'blur(2px)',
          }} />
          <div style={{
            position: 'absolute', bottom: 120, left: -60,
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(183,106,138,0.20), rgba(0,0,0,0) 60%)',
            filter: 'blur(2px)',
          }} />
        </div>

        {/* Gradient masks */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0) 25%, rgba(10,10,12,0) 50%, ${A.bg} 100%)`,
        }} />

        {/* Top app bar */}
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0, zIndex: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="wordmark" style={{ fontSize: 26, color: A.text, lineHeight: 1 }}>Archiwum</span>
            <span style={{ fontSize: 9, color: A.amber, letterSpacing: '0.15em', fontWeight: 600 }}>·NAS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={iconBtn}>{Icon.search(22, A.text)}</button>
            <button style={iconBtn}>{Icon.bell(20, A.text)}</button>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4a056, #b76a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              color: A.bg, fontSize: 14,
            }}>L</div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          position: 'absolute', top: 108, left: 0, right: 0, zIndex: 4,
          display: 'flex', gap: 22, padding: '0 18px',
        }}>
          {['Wszystko', 'Filmy', 'Seriale', 'Animacje'].map((t, i) => (
            <div key={t} style={{
              fontSize: 14, fontWeight: i === 0 ? 600 : 500,
              color: i === 0 ? A.text : A.muted,
              position: 'relative', padding: '6px 0',
              letterSpacing: '-0.005em',
            }}>
              {t}
              {i === 0 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  height: 2, background: A.amber, borderRadius: 1,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0,
          padding: '0 22px', zIndex: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{
              fontSize: 10, letterSpacing: '0.16em', color: A.amber, fontWeight: 600,
            }}>POZYCJA DNIA</span>
            <span style={{ width: 14, height: 1, background: A.amber, opacity: 0.5 }} />
            <span style={{ fontSize: 10, color: A.muted, letterSpacing: '0.1em' }}>FILM</span>
          </div>

          <h1 style={{
            margin: 0,
            fontFamily: 'var(--serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 48,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: A.text,
            textWrap: 'pretty',
            maxWidth: '85%',
          }}>Lorem Ipsum Dolor</h1>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 14, fontSize: 12, color: A.text2,
          }}>
            <span>2024</span>
            <span style={{ color: A.subtle }}>·</span>
            <span>2h 14m</span>
            <span style={{ color: A.subtle }}>·</span>
            {Icon.hd()}
            <span style={{ color: A.subtle }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {Icon.star(11)}<span style={{ marginLeft: 2 }}>8.4</span>
            </span>
          </div>

          <p style={{
            margin: '14px 0 0',
            color: A.text2,
            fontSize: 13.5,
            lineHeight: 1.5,
            maxWidth: '94%',
            textWrap: 'pretty',
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              {Icon.play(14, '#0a0a0c')} Odtwórz
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }}>
              {Icon.plus(16, A.text)} Moja lista
            </button>
            <button className="btn btn-ghost" style={{ width: 44, padding: 0 }}>
              {Icon.info(18, A.text)}
            </button>
          </div>
        </div>
      </div>

      {/* CONTINUE WATCHING ═════════════════════════════════ */}
      <div>
        <div className="section-h">
          <h3>Kontynuuj oglądanie</h3>
          <span className="more">Wszystkie ›</span>
        </div>
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          padding: '0 20px 4px',
        }}>
          {continueWatching.map((it, i) => (
            <div key={i} style={{ width: 220, flexShrink: 0 }}>
              <Poster tone={it.tone} ratio="16/9" progress={it.progress} />
              <div style={{ marginTop: 8 }}>
                <div style={{
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 15, color: A.text, lineHeight: 1.1,
                }}>{it.title}</div>
                <div style={{ fontSize: 11, color: A.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{it.sub}</span>
                  <span style={{ color: A.subtle }}>•</span>
                  <span>{it.runtime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENTLY ADDED ══════════════════════════════════════ */}
      <div>
        <div className="section-h">
          <h3>Ostatnio dodane</h3>
          <span className="more">12 nowych ›</span>
        </div>
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          padding: '0 20px 4px',
        }}>
          {recentlyAdded.map((it, i) => (
            <div key={i} style={{ width: 130, flexShrink: 0 }}>
              <Poster tone={it.tone} />
              <div style={{ marginTop: 8 }}>
                <div style={{
                  fontSize: 13, color: A.text, fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.title}</div>
                <div style={{ fontSize: 10.5, color: A.muted, marginTop: 2 }}>
                  {it.kind} · {it.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTION FEATURE ════════════════════════════════ */}
      <div>
        <div className="section-h">
          <h3>Twoja kolekcja</h3>
          <span className="more">427 pozycji ›</span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          padding: '0 20px',
        }}>
          {collection.map((it, i) => (
            <div key={i}>
              <Poster tone={it.tone} ratio="3/4" badge={it.badge} />
              <div style={{ marginTop: 8, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15 }}>
                {it.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GENRES ════════════════════════════════════════════ */}
      <div>
        <div className="section-h">
          <h3>Wg gatunku</h3>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10, padding: '0 20px',
        }}>
          {[
            ['Dramat', 84, 'a'],
            ['Sci-Fi', 42, 'c'],
            ['Komedia', 67, 'd'],
            ['Dokument', 31, 'g'],
            ['Animacja', 28, 'b'],
            ['Thriller', 53, 'e'],
          ].map(([name, count, tone]) => (
            <div key={name} style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: 8, height: 64,
              border: `1px solid ${A.border}`,
            }}>
              <div className={`poster-ph ph-tone-${tone} grain`} style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.5) 100%)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 14px',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: A.text, lineHeight: 1 }}>
                    {name}
                  </div>
                  <div style={{ fontSize: 11, color: A.muted, marginTop: 4, letterSpacing: '0.02em' }}>
                    {count} pozycji
                  </div>
                </div>
                {Icon.chevron(10, A.muted)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVER FOOTER ═════════════════════════════════════ */}
      <div style={{
        margin: '32px 20px 0',
        padding: '14px 16px',
        border: `1px solid ${A.border}`, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: A.surface,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#7dd181', boxShadow: '0 0 8px #7dd181',
          }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>nas.local · online</div>
            <div style={{ fontSize: 10.5, color: A.muted, marginTop: 2, fontFamily: 'var(--mono)' }}>
              4.2 TB / 8 TB · indeksowanie zakończone
            </div>
          </div>
        </div>
        {Icon.chevron(10, A.muted)}
      </div>

      {/* BOTTOM TAB BAR ════════════════════════════════════ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 84,
        background: 'linear-gradient(to top, rgba(10,10,12,0.97) 60%, rgba(10,10,12,0))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `0.5px solid ${A.border}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        paddingBottom: 18,
      }}>
        {[
          { icon: Icon.home, label: 'Główna', active: true },
          { icon: Icon.search, label: 'Szukaj' },
          { icon: Icon.list, label: 'Moja lista' },
          { icon: Icon.download, label: 'Pobrane' },
          { icon: Icon.profile, label: 'Konto' },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: t.active ? A.text : A.muted,
          }}>
            {t.icon(20, t.active ? A.text : A.muted)}
            <span style={{ fontSize: 10, fontWeight: t.active ? 600 : 500, letterSpacing: '0.01em' }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: 999,
  background: 'transparent', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

Object.assign(window, { MobileHome });
