/* ARCHIWUM — shared primitives and icons */

const A = {
  bg: '#0a0a0c',
  surface: '#14141a',
  surface2: '#1c1c23',
  surface3: '#25252d',
  border: 'rgba(255,248,230,0.06)',
  border2: 'rgba(255,248,230,0.10)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  muted: '#847d6f',
  subtle: '#58524a',
  amber: '#d4a056',
  amberSoft: '#e0b06a',
};

// ─────────────────────────────────────────────────────
// Icons (stroke-based, 24px viewbox unless noted)
// ─────────────────────────────────────────────────────
const Icon = {
  play: (s = 14, c = '#0a0a0c') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c} aria-hidden="true">
      <path d="M7 4.5v15c0 .8.9 1.3 1.6.9l12.4-7.5c.7-.4.7-1.4 0-1.8L8.6 3.6c-.7-.4-1.6.1-1.6.9z"/>
    </svg>
  ),
  plus: (s = 18, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  info: (s = 18, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25"/>
      <path d="M12 11v6" strokeLinecap="round"/>
      <circle cx="12" cy="7.75" r="1" fill={c}/>
    </svg>
  ),
  search: (s = 22, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l5 5"/>
    </svg>
  ),
  home: (s = 22, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 11l8.5-7 8.5 7v8.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V11z"/>
    </svg>
  ),
  list: (s = 22, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M5 6h14M5 12h14M5 18h9"/>
    </svg>
  ),
  download: (s = 22, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 11l5 5 5-5M4 19h16"/>
    </svg>
  ),
  profile: (s = 22, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5"/>
      <path d="M4.5 20c1.2-3.4 4.2-5.5 7.5-5.5s6.3 2.1 7.5 5.5"/>
    </svg>
  ),
  bell: (s = 20, c = A.text) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2.5h-15L6 16z"/>
      <path d="M10 20.5c.4.9 1.2 1.5 2 1.5s1.6-.6 2-1.5"/>
    </svg>
  ),
  chevron: (s = 12, c = A.muted) => (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 2l4 4-4 4"/>
    </svg>
  ),
  filter: (s = 16, c = A.text2) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4"/>
    </svg>
  ),
  star: (s = 12, c = A.amber) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c} aria-hidden="true">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.1 1.13-6.58L2.45 9.45l6.6-.95L12 2.5z"/>
    </svg>
  ),
  hd: (c = A.text2) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 18, padding: '0 5px',
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      color: c, border: `1px solid ${c}`, borderRadius: 3,
    }}>4K · HDR</span>
  ),
};

// ─────────────────────────────────────────────────────
// Poster placeholder — abstract, with optional title overlay
// ─────────────────────────────────────────────────────
function Poster({ tone = 'a', ratio = '2/3', title, year, runtime, badge, progress, w, style = {} }) {
  return (
    <div
      className={`poster-ph ph-tone-${tone} grain`}
      style={{
        aspectRatio: ratio,
        width: w,
        position: 'relative',
        ...style,
      }}
    >
      {/* Inner abstract composition: circle + bar to fake key art */}
      <div style={{
        position: 'absolute',
        top: '12%', left: '10%',
        width: '30%', aspectRatio: '1/1',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), rgba(0,0,0,0.4) 65%)',
        filter: 'blur(0.3px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%', left: '8%', right: '14%',
        height: '0.5px',
        background: 'rgba(255,255,255,0.18)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '14%', left: '8%',
        width: '40%', height: '6px',
        background: 'rgba(212,160,86,0.55)',
      }} />

      {/* badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: 6, left: 6, zIndex: 2,
          fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
          padding: '2px 5px', borderRadius: 3,
          background: 'rgba(10,10,12,0.7)',
          color: A.amber,
          textTransform: 'uppercase',
          backdropFilter: 'blur(6px)',
        }}>{badge}</div>
      )}

      {/* progress bar (continue watching) */}
      {progress != null && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 3, background: 'rgba(0,0,0,0.5)', zIndex: 2,
        }}>
          <div style={{ width: `${progress}%`, height: '100%', background: A.amber }} />
        </div>
      )}

      {/* meta overlay (title/year) */}
      {(title || year) && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '40px 10px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 13, color: A.text, lineHeight: 1.1,
          }}>{title}</div>
          {year && <div style={{ fontSize: 9, color: A.muted, marginTop: 3, letterSpacing: '0.05em' }}>
            {year}{runtime && ` · ${runtime}`}
          </div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Lorem-style title generator (placeholder feel, but legible)
// ─────────────────────────────────────────────────────
const FAKE_TITLES = [
  'Lorem Ipsum',
  'Dolor Sit Amet',
  'Consectetur',
  'Adipiscing Elit',
  'Sed Do Eiusmod',
  'Tempor Incididunt',
  'Ut Labore',
  'Magna Aliqua',
  'Ad Minim Veniam',
  'Quis Nostrud',
  'Exercitation',
  'Ullamco Laboris',
  'Duis Aute Irure',
  'In Voluptate',
  'Esse Cillum',
  'Fugiat Nulla',
  'Pariatur Excepteur',
  'Sint Occaecat',
];

const TONES = ['a','b','c','d','e','f','g','h'];

Object.assign(window, { A, Icon, Poster, FAKE_TITLES, TONES });
