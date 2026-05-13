// Movies, Series library wireframes

const MoviesV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{fontSize:32, color:'var(--red)'}}>▶ Filmy</h1>
      <div className="bx" style={{width:32,height:32, display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span className="mono">⇅</span>
      </div>
    </div>
    <div className="px-14 mt-8">
      <div className="bx" style={{padding:'10px 12px', display:'flex', alignItems:'center', gap:8}}>
        <span className="mono">⌕</span>
        <span className="lbl" style={{fontSize:14, color:'var(--ink-3)'}}>Szukaj filmów…</span>
      </div>
    </div>
    {/* genre chips */}
    <div className="px-14 mt-8" style={{display:'flex', gap:6, overflow:'hidden'}}>
      <span className="chip on">Wszystkie</span>
      {['Akcja','Komedia','Dramat','Horror','Sci-Fi','Thriller'].map(g=>(
        <span key={g} className="chip">{g}</span>
      ))}
    </div>

    {/* Sections view (default) */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark red"/> Popularne teraz</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster red" style={{width:104, height:150, flex:'0 0 auto'}}>
          <span className="tag">★ {(7+i*0.2).toFixed(1)}</span>
        </div>)}
      </div>
    </div>
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark red"/> Nadchodzące premiery</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster red" style={{width:104, height:150, flex:'0 0 auto'}}>
          <span className="tag">2026</span>
        </div>)}
      </div>
    </div>
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark red"/> Najlepiej oceniane</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster red" style={{width:104, height:150, flex:'0 0 auto'}}>
          <span className="tag">★ {(8.5+i*0.1).toFixed(1)}</span>
        </div>)}
      </div>
    </div>
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark red"/> Kino Akcji</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster red" style={{width:104, height:150, flex:'0 0 auto'}} />)}
      </div>
    </div>
    <TabBar active="movies" />
    <Note top={140} right={6} w={140} rotate={3}>Rzędy przewijane — „Netflix-style"</Note>
  </div>
);

// V2 — filter-first, single dense grid
const MoviesV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{fontSize:28}}>Biblioteka filmów</h1>
      <span className="mono">1 284</span>
    </div>

    {/* sticky-ish filter block */}
    <div className="px-14 mt-8">
      <div className="bx" style={{padding:10}}>
        <div className="row gap-6 ai-c">
          <span className="mono">⌕</span>
          <span className="lbl" style={{fontSize:14, color:'var(--ink-3)', flex:1}}>Tytuł, reżyser, aktor…</span>
          <span className="mono">⇅</span>
        </div>
        <div style={{height:1, background:'var(--muted)', margin:'10px 0'}}/>
        <div className="row gap-6 ai-c">
          <div className="bx" style={{padding:'4px 8px', fontSize:12, fontFamily:'Kalam'}}>Gatunek: <b>Dramat</b> ×</div>
          <div className="bx" style={{padding:'4px 8px', fontSize:12, fontFamily:'Kalam'}}>Rok: <b>2020+</b> ×</div>
          <div className="bx" style={{padding:'4px 8px', fontSize:12, fontFamily:'Kalam'}}>Ocena ≥ 7.5 ×</div>
        </div>
        <div className="row jc-sb ai-c mt-8">
          <span className="tiny">Sortuj: Najpopularniejsze ▾</span>
          <span className="tiny">Widok: ▦ ▤</span>
        </div>
      </div>
    </div>

    {/* dense grid */}
    <div className="px-14 mt-12" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6}}>
      {Array.from({length:18}).map((_,i)=>(
        <div key={i} className="poster red" style={{height:150}}>
          <span className="tag">★{(6.8+i*0.12).toFixed(1)}</span>
          <span className="rt">'{20+(i%6)}</span>
        </div>
      ))}
    </div>

    <div className="px-14 mt-12" style={{textAlign:'center'}}>
      <div className="lbl" style={{fontSize:13, color:'var(--ink-3)'}}>— ładowanie kolejnych —</div>
    </div>

    <TabBar active="movies" />
    <Note top={210} right={6} w={140} rotate={-2}>Szuflada filtrów zamiast rzędów</Note>
  </div>
);

const SeriesV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{fontSize:32, color:'var(--blue)'}}>■ Seriale</h1>
      <div className="bx" style={{width:32,height:32, display:'flex',alignItems:'center',justifyContent:'center'}}><span className="mono">⇅</span></div>
    </div>
    <div className="px-14 mt-8">
      <div className="bx" style={{padding:'10px 12px', display:'flex', alignItems:'center', gap:8}}>
        <span className="mono">⌕</span>
        <span className="lbl" style={{fontSize:14, color:'var(--ink-3)'}}>Szukaj seriali…</span>
      </div>
    </div>

    {/* Continue watching — special serial feature */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark blue"/> Kontynuuj oglądanie</div>
      <div className="col gap-8">
        {[['The Bear','S02E04 „Sundae"',28],['Succession','S03E07',62],['Severance','S01E02',14]].map(([t,e,p],i)=>(
          <div key={i} className="bx" style={{padding:8, display:'flex', gap:10, alignItems:'center'}}>
            <div className="poster blue" style={{width:56, height:78, flex:'0 0 auto'}} />
            <div style={{flex:1}}>
              <div className="hand" style={{fontSize:18, fontWeight:700}}>{t}</div>
              <div className="lbl" style={{fontSize:12, color:'var(--ink-3)'}}>{e}</div>
              <div style={{height:3, background:'var(--muted-2)', marginTop:6}}>
                <div style={{width:p+'%', height:'100%', background:'var(--blue)'}} />
              </div>
            </div>
            <span className="mono">▶</span>
          </div>
        ))}
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark blue"/> Popularne teraz</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster blue" style={{width:104, height:150, flex:'0 0 auto'}} />)}
      </div>
    </div>
    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark blue"/> Najlepiej oceniane</div>
      <div style={{display:'flex', gap:8, overflow:'hidden'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className="poster blue" style={{width:104, height:150, flex:'0 0 auto'}} />)}
      </div>
    </div>
    <TabBar active="series" />
    <Note top={150} right={6} w={140} rotate={2}>Kontynuuj oglądanie — sekcja specyficzna dla seriali</Note>
  </div>
);

const SeriesV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div>
        <h1 style={{fontSize:28, color:'var(--blue)'}}>Seriale</h1>
        <div className="tiny">12 w trakcie · 34 ukończone · 8 w kolejce</div>
      </div>
      <div className="bx" style={{width:32,height:32, display:'flex',alignItems:'center',justifyContent:'center'}}><span className="mono">+</span></div>
    </div>

    {/* tabs for status */}
    <div className="px-14 mt-12" style={{display:'flex', gap:0, borderBottom:'1.5px solid var(--line)'}}>
      {['W trakcie','Ukończone','W kolejce','Porzucone'].map((t,i)=>(
        <div key={t} style={{padding:'8px 10px', fontFamily:'Kalam', fontSize:13, borderBottom: i===0?'3px solid var(--blue)':'3px solid transparent', fontWeight: i===0?700:400}}>{t}</div>
      ))}
    </div>

    {/* list view: next episode focus */}
    <div className="px-14 mt-12 col gap-8">
      {[
        ['The Bear','FX','S02E05 — następny','za 3 dni','blue'],
        ['Severance','AppleTV+','S02E02 — obejrzane','wczoraj','blue'],
        ['The Last of Us','HBO','S02E01 — następny','dzisiaj','blue'],
        ['Succession','HBO','S04E09 — następny','niedostępne','blue'],
      ].map(([t,net,ep,when],i)=>(
        <div key={i} className="bx" style={{padding:10}}>
          <div className="row jc-sb ai-c">
            <div>
              <div className="hand" style={{fontSize:20, fontWeight:700}}>{t}</div>
              <div className="tiny">{net}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="lbl" style={{fontSize:13}}>{ep}</div>
              <div className="tiny">{when}</div>
            </div>
          </div>
          <div className="row gap-4 mt-8" title="odcinki">
            {Array.from({length:10}).map((_,j)=>(
              <div key={j} style={{flex:1, height:6, background: j<(4+i) ? 'var(--blue)' : 'var(--muted-2)', border:'1px solid var(--line)'}}/>
            ))}
          </div>
        </div>
      ))}
    </div>

    <TabBar active="series" />
    <Note top={110} right={6} w={150} rotate={-2.5}>Tracker pierwszy, odkrywanie drugie</Note>
  </div>
);

Object.assign(window, {MoviesV1, MoviesV2, SeriesV1, SeriesV2});
