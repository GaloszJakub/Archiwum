/* ARCHIWUM — Desktop / Wide view */

function Desktop() {
  const continueWatching = [
    { tone: 'a', title: 'Lorem Ipsum',     sub: 'S2 · E04', progress: 62, time: '18 min do końca' },
    { tone: 'd', title: 'Dolor Sit Amet',  sub: 'Film',     progress: 31, time: '1h 12m do końca' },
    { tone: 'b', title: 'Tempor Inci.',    sub: 'S1 · E07', progress: 88, time: '6 min do końca' },
    { tone: 'e', title: 'Magna Aliqua',    sub: 'Film',     progress: 14, time: '1h 48m do końca' },
    { tone: 'c', title: 'Quis Nostrud',    sub: 'S4 · E12', progress: 47, time: '24 min do końca' },
  ];

  const rails = [
    {
      title: 'Ostatnio dodane',
      sub: '12 nowych w tym tygodniu',
      items: [
        { tone: 'c', title: 'Quis Nostrud',   year: 2024, kind: 'Film',   rating: 8.4 },
        { tone: 'f', title: 'Ullamco Laboris',year: 2023, kind: 'Serial', rating: 7.9 },
        { tone: 'g', title: 'In Voluptate',   year: 2024, kind: 'Film',   rating: 8.1 },
        { tone: 'h', title: 'Excepteur',      year: 2022, kind: 'Serial', rating: 9.0 },
        { tone: 'b', title: 'Occaecat',       year: 2024, kind: 'Film',   rating: 7.6 },
        { tone: 'a', title: 'Cupidatat',      year: 2023, kind: 'Film',   rating: 8.2 },
      ],
    },
    {
      title: 'Premiery w 4K HDR',
      sub: 'Wyselekcjonowane z Twojej kolekcji',
      items: [
        { tone: 'd', title: 'Pariatur',     year: 2024, kind: 'Film', rating: 8.5, badge: '4K' },
        { tone: 'a', title: 'Adipiscing',   year: 2024, kind: 'Film', rating: 8.1, badge: 'HDR' },
        { tone: 'e', title: 'Cillum',       year: 2024, kind: 'Film', rating: 7.8, badge: '4K' },
        { tone: 'g', title: 'Eiusmod',      year: 2023, kind: 'Serial', rating: 8.9, badge: 'HDR' },
        { tone: 'c', title: 'Sint Occaec.', year: 2024, kind: 'Film', rating: 8.2, badge: '4K' },
        { tone: 'h', title: 'Fugiat Nulla', year: 2023, kind: 'Film', rating: 7.7, badge: 'HDR' },
      ],
    },
  ];

  const SIDEBAR_W = 232;

  return (
    <div style={{
      width: 1440, minHeight: 980,
      background: A.bg, color: A.text,
      display: 'flex',
      position: 'relative',
    }}>
      {/* ═══════ SIDEBAR ═══════ */}
      <aside style={{
        width: SIDEBAR_W, flexShrink: 0,
        background: A.bg,
        borderRight: `1px solid ${A.border}`,
        padding: '28px 0',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, alignSelf: 'flex-start',
        minHeight: 980,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 28px', borderBottom: `1px solid ${A.border}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="wordmark" style={{ fontSize: 28, color: A.text, lineHeight: 1 }}>Archiwum</span>
          </div>
          <div style={{
            fontSize: 10, color: A.amber, letterSpacing: '0.18em',
            fontWeight: 600, marginTop: 4,
          }}>NAS · LOCAL</div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
          {[
            { icon: Icon.home, label: 'Główna', active: true },
            { icon: Icon.search, label: 'Wyszukaj' },
            { icon: Icon.list, label: 'Moja lista', badge: '12' },
            { icon: Icon.download, label: 'Pobrane offline' },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8,
              background: it.active ? A.surface2 : 'transparent',
              color: it.active ? A.text : A.text2,
              fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
              position: 'relative',
            }}>
              {it.active && (
                <div style={{
                  position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 18, background: A.amber, borderRadius: 2,
                }} />
              )}
              {it.icon(18, it.active ? A.text : A.text2)}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge && (
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 999,
                  background: A.amberDim || 'rgba(212,160,86,0.18)',
                  color: A.amber, fontWeight: 600,
                }}>{it.badge}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Categories */}
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
            color: A.muted, textTransform: 'uppercase',
          }}>Biblioteka</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
          {[
            ['Filmy', 248],
            ['Seriale', 124],
            ['Dokumenty', 33],
            ['Animacja', 22],
          ].map(([name, count], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 8,
              color: A.text2, fontSize: 13, cursor: 'pointer',
            }}>
              <span>{name}</span>
              <span style={{ fontSize: 11, color: A.subtle, fontFamily: 'var(--mono)' }}>{count}</span>
            </div>
          ))}
        </nav>

        {/* Categories */}
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
            color: A.muted, textTransform: 'uppercase',
          }}>Gatunki</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
          {[
            ['Dramat', 84],
            ['Sci-Fi', 42],
            ['Komedia', 67],
            ['Thriller', 53],
            ['Dokument', 31],
          ].map(([name, count], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 12px', borderRadius: 8,
              color: A.text2, fontSize: 12.5, cursor: 'pointer',
            }}>
              <span>{name}</span>
              <span style={{ fontSize: 10.5, color: A.subtle, fontFamily: 'var(--mono)' }}>{count}</span>
            </div>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Server status footer */}
        <div style={{
          margin: '0 16px',
          padding: '12px 14px',
          background: A.surface,
          border: `1px solid ${A.border}`,
          borderRadius: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#7dd181', boxShadow: '0 0 8px #7dd181',
            }} />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: A.text }}>nas.local</span>
            <span style={{ fontSize: 10, color: A.muted, marginLeft: 'auto', fontFamily: 'var(--mono)' }}>online</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '52%', height: '100%', background: A.amber }} />
          </div>
          <div style={{
            fontSize: 10, color: A.muted, marginTop: 6,
            display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)',
          }}>
            <span>4.2 / 8.0 TB</span>
            <span>52%</span>
          </div>
        </div>
      </aside>

      {/* ═══════ MAIN ═══════ */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(10,10,12,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${A.border}`,
          padding: '14px 36px',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          {/* Search */}
          <div style={{
            flex: 1, maxWidth: 480,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 14px', height: 38,
            background: A.surface,
            border: `1px solid ${A.border}`,
            borderRadius: 999,
          }}>
            {Icon.search(16, A.muted)}
            <span style={{ color: A.muted, fontSize: 13.5 }}>Szukaj w bibliotece…</span>
            <span style={{
              marginLeft: 'auto', fontSize: 10, color: A.subtle,
              fontFamily: 'var(--mono)', padding: '2px 6px',
              border: `1px solid ${A.border2}`, borderRadius: 4,
            }}>⌘K</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Quick controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={topBtn}>{Icon.filter(16, A.text2)} <span style={{ marginLeft: 6, fontSize: 12 }}>Filtry</span></button>
            <button style={topBtn}>{Icon.bell(16, A.text2)}</button>
          </div>

          {/* Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: `1px solid ${A.border}` }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4a056, #b76a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              color: A.bg, fontSize: 14, fontWeight: 500,
            }}>L</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>Lorem User</span>
              <span style={{ fontSize: 10.5, color: A.muted }}>admin</span>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
          <div className="poster-ph ph-tone-d grain" style={{ position: 'absolute', inset: 0 }}>
            <div style={{
              position: 'absolute', top: 80, right: 100,
              width: 420, height: 420, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(212,160,86,0.35), rgba(0,0,0,0) 65%)',
              filter: 'blur(4px)',
            }} />
            <div style={{
              position: 'absolute', bottom: 60, left: 200,
              width: 360, height: 360, borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 50%, rgba(183,106,138,0.20), rgba(0,0,0,0) 60%)',
              filter: 'blur(4px)',
            }} />
            {/* Subtle film strip lines */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.15,
              background: 'repeating-linear-gradient(180deg, transparent 0 90px, rgba(255,255,255,0.04) 90px 91px)',
            }} />
          </div>

          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, ${A.bg} 0%, rgba(10,10,12,0.4) 60%, rgba(10,10,12,0) 100%)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, rgba(10,10,12,0) 60%, ${A.bg} 100%)`,
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            padding: '80px 56px',
            maxWidth: 640,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ width: 24, height: 1, background: A.amber }} />
              <span style={{
                fontSize: 11, letterSpacing: '0.2em', color: A.amber, fontWeight: 600,
              }}>POZYCJA DNIA</span>
              <span style={{ color: A.subtle, fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: A.muted, letterSpacing: '0.1em' }}>FILM · 2024</span>
            </div>

            <h1 style={{
              margin: 0,
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400,
              fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.025em',
              color: A.text, textWrap: 'pretty',
            }}>Lorem Ipsum<br/>Dolor Sit.</h1>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              marginTop: 22, fontSize: 13, color: A.text2,
            }}>
              <span>2024</span>
              <span style={{ color: A.subtle }}>·</span>
              <span>2h 14m</span>
              <span style={{ color: A.subtle }}>·</span>
              {Icon.hd()}
              <span style={{ color: A.subtle }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {Icon.star(12)} <span style={{ color: A.amber, fontWeight: 500 }}>8.4</span>
              </span>
              <span style={{ color: A.subtle }}>·</span>
              <span>Reż. Dolor Adipiscing</span>
            </div>

            <p style={{
              margin: '22px 0 0',
              color: A.text2,
              fontSize: 15, lineHeight: 1.55, maxWidth: 540,
              textWrap: 'pretty',
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button className="btn btn-primary" style={{ padding: '0 24px' }}>
                {Icon.play(14, '#0a0a0c')} Odtwórz
              </button>
              <button className="btn btn-ghost" style={{ padding: '0 20px' }}>
                {Icon.plus(16, A.text)} Moja lista
              </button>
              <button className="btn btn-ghost" style={{ padding: '0 20px' }}>
                {Icon.info(16, A.text)} Więcej
              </button>
            </div>
          </div>
        </div>

        {/* ─── CONTINUE WATCHING ─── */}
        <section style={{ padding: '0 56px', marginTop: -40, position: 'relative', zIndex: 3 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 18,
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: 22, fontWeight: 600, letterSpacing: '-0.018em',
              }}>Kontynuuj oglądanie</h2>
              <div style={{ fontSize: 12, color: A.muted, marginTop: 4 }}>
                Wróć tam, gdzie skończyłeś
              </div>
            </div>
            <span style={{
              fontSize: 11, color: A.muted, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>Wszystkie →</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {continueWatching.map((it, i) => (
              <div key={i}>
                <div style={{ position: 'relative' }}>
                  <Poster tone={it.tone} ratio="16/9" progress={it.progress} />
                  {/* Play overlay hint */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0,
                  }} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{
                    fontFamily: 'var(--serif)', fontStyle: 'italic',
                    fontSize: 16, color: A.text, lineHeight: 1.1,
                  }}>{it.title}</div>
                  <div style={{
                    fontSize: 11, color: A.muted, marginTop: 4,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>{it.sub}</span>
                    <span style={{ color: A.subtle }}>•</span>
                    <span>{it.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── RAILS ─── */}
        {rails.map((rail, ri) => (
          <section key={ri} style={{ padding: '0 56px', marginTop: 48 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 18,
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: 22, fontWeight: 600, letterSpacing: '-0.018em',
                }}>{rail.title}</h2>
                <div style={{ fontSize: 12, color: A.muted, marginTop: 4 }}>{rail.sub}</div>
              </div>
              <span style={{
                fontSize: 11, color: A.muted, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Pokaż wszystko →</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
              {rail.items.map((it, i) => (
                <div key={i}>
                  <Poster tone={it.tone} badge={it.badge} />
                  <div style={{ marginTop: 10 }}>
                    <div style={{
                      fontFamily: 'var(--serif)', fontStyle: 'italic',
                      fontSize: 16, color: A.text, lineHeight: 1.1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{it.title}</div>
                    <div style={{
                      fontSize: 11, color: A.muted, marginTop: 4,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span>{it.kind}</span>
                      <span style={{ color: A.subtle }}>·</span>
                      <span>{it.year}</span>
                      <span style={{ color: A.subtle }}>·</span>
                      <span style={{ color: A.amber, display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--mono)' }}>
                        {Icon.star(10)}{it.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Genres band */}
        <section style={{ padding: '56px 56px 64px' }}>
          <h2 style={{
            margin: '0 0 18px',
            fontSize: 22, fontWeight: 600, letterSpacing: '-0.018em',
          }}>Przeglądaj wg gatunku</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
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
                borderRadius: 10, height: 96,
                border: `1px solid ${A.border}`,
                cursor: 'pointer',
              }}>
                <div className={`poster-ph ph-tone-${tone} grain`} style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(120deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.3) 100%)',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  padding: '16px 18px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: 10.5, color: A.muted, letterSpacing: '0.06em', fontFamily: 'var(--mono)' }}>
                    {count} pozycji
                  </div>
                  <div style={{
                    fontFamily: 'var(--serif)', fontStyle: 'italic',
                    fontSize: 22, color: A.text, lineHeight: 1,
                  }}>{name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const topBtn = {
  display: 'inline-flex', alignItems: 'center',
  height: 34, padding: '0 12px', borderRadius: 8,
  background: 'transparent', color: A.text2,
  border: `1px solid ${A.border}`,
  fontFamily: 'var(--sans)', cursor: 'pointer',
};

Object.assign(window, { Desktop });
