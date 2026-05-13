// Login + Dashboard wireframes

// ──────────────── LOGIN ────────────────
const LoginV1 = () => (
  <div className="wf" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 28px',height:'100%'}}>
    <div style={{width:72,height:72,border:'2px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', marginBottom:18, background:'color-mix(in oklch, var(--red) 14%, var(--paper))'}}>
      <span style={{fontFamily:'Caveat', fontSize:44, fontWeight:700, lineHeight:1}}>A</span>
    </div>
    <h1 style={{fontSize:44, marginBottom:4}}>Archiwum</h1>
    <div className="lbl" style={{fontSize:15,color:'var(--ink-3)',marginBottom:32, textAlign:'center'}}>
      Twój osobisty katalog filmów i seriali
    </div>
    <div className="bx-2 w-full" style={{padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:14}}>
      <div className="bx" style={{width:20,height:20,borderRadius:10, display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'JetBrains Mono',fontSize:12}}>G</div>
      <span className="hand" style={{fontSize:18,fontWeight:600}}>Zaloguj się przez Google</span>
    </div>
    <div className="tiny" style={{textAlign:'center', marginTop:8}}>Logując się, akceptujesz warunki użytkowania</div>
    <Note top={80} right={-10} w={140} rotate={4}>Jeden przycisk — bez formularzy</Note>
  </div>
);

const LoginV2 = () => (
  <div className="wf" style={{height:'100%', position:'relative', overflow:'hidden'}}>
    <div className="banner" style={{position:'absolute',inset:0}} />
    <div style={{position:'absolute',inset:0, background:'linear-gradient(180deg, transparent 0%, var(--paper) 78%)'}} />
    <div style={{position:'absolute',top:40, left:24, right:24}}>
      <div className="mono" style={{color:'var(--ink)'}}>ARCHIWUM · v0.3</div>
      <h1 style={{fontSize:40, marginTop:4, lineHeight:1}}>Twoja biblioteka.<br/>Twoje tempo.</h1>
      <div className="lbl" style={{fontSize:15, marginTop:12, maxWidth:240}}>
        Zapisuj, oceniaj i układaj wszystko co oglądasz — w jednym miejscu.
      </div>
    </div>
    <div style={{position:'absolute', bottom:40, left:24, right:24}}>
      <div className="bx-2" style={{padding:'14px 16px', display:'flex',alignItems:'center',justifyContent:'center',gap:10, background:'var(--ink)', color:'var(--paper)'}}>
        <span className="hand" style={{fontSize:18, fontWeight:600}}>Kontynuuj z Google →</span>
      </div>
      <div className="tiny" style={{textAlign:'center', marginTop:10}}>Tylko konta Google · szyfrowane przez Firebase</div>
    </div>
    <Note top={340} right={12} w={150} rotate={-3}>Storytelling zamiast neutralnego formularza</Note>
  </div>
);

// ──────────────── DASHBOARD ────────────────
const posterRow = (count, variant='red', tall=116) => (
  <div style={{display:'flex', gap:8, overflow:'hidden'}}>
    {Array.from({length:count}).map((_,i)=>(
      <div key={i} className={'poster ' + variant} style={{width:78, height:tall, flex:'0 0 auto'}}>
        <span className="tag">#{i+1}</span>
        <span className="rt">★ {(7.1 + (i*0.21)%2).toFixed(1)}</span>
      </div>
    ))}
  </div>
);

const DashboardV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{fontSize:32}}>Panel</h1>
      <div className="bx" style={{width:32,height:32, borderRadius:16, display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam',fontSize:13}}>J</div>
    </div>
    <div className="px-14" style={{paddingBottom:10}}>
      <div className="bx" style={{padding:'10px 12px', display:'flex', alignItems:'center', gap:8}}>
        <span className="mono">⌕</span>
        <span className="lbl" style={{fontSize:14, color:'var(--ink-3)'}}>Szukaj filmów i seriali…</span>
      </div>
    </div>
    <div className="px-14" style={{paddingBottom:8, display:'flex', gap:6, overflow:'hidden'}}>
      <span className="chip on">Wszystko</span>
      <span className="chip red"><span className="dot red"/> Filmy</span>
      <span className="chip blue"><span className="dot blue"/> Seriale</span>
      <span className="chip">Do obejrzenia</span>
    </div>

    <div className="px-14 mt-12">
      <div className="row jc-sb ai-c mb-8">
        <div className="section-title"><span className="mark" /> Ostatnio oglądane</div>
        <span className="lbl" style={{fontSize:13}}>→</span>
      </div>
      {posterRow(6, 'blue')}
    </div>

    <div className="px-14 mt-16">
      <div className="row jc-sb ai-c mb-8">
        <div className="section-title"><span className="mark red" /> Popularne filmy</div>
        <span className="lbl" style={{fontSize:13}}>Zobacz wszystkie →</span>
      </div>
      {posterRow(6, 'red')}
    </div>

    <div className="px-14 mt-16">
      <div className="row jc-sb ai-c mb-8">
        <div className="section-title"><span className="mark blue" /> Popularne seriale</div>
        <span className="lbl" style={{fontSize:13}}>Zobacz wszystkie →</span>
      </div>
      {posterRow(6, 'blue')}
    </div>

    <div className="px-14 mt-20">
      <div className="bx" style={{padding:16, textAlign:'center'}}>
        <div className="hand" style={{fontSize:24, fontWeight:700}}>Odkryj najlepiej oceniane</div>
        <div className="lbl" style={{fontSize:13, color:'var(--ink-3)', marginTop:4}}>Tysiące produkcji z całego świata</div>
        <div className="row gap-8 jc-c mt-12">
          <span className="chip red on">▶ Filmy</span>
          <span className="chip blue">■ Seriale</span>
        </div>
      </div>
    </div>

    <TabBar active="home" />
    <Note top={180} right={4} w={140} rotate={3}>Dwa akcenty: czerwony = film, niebieski = serial</Note>
  </div>
);

const DashboardV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div>
        <div className="lbl" style={{fontSize:13, color:'var(--ink-3)'}}>Wieczór, Jakub</div>
        <h1 style={{fontSize:26}}>Co dziś?</h1>
      </div>
      <div className="bx" style={{width:32,height:32, borderRadius:16, display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam',fontSize:13}}>J</div>
    </div>

    {/* Hero "kontynuuj oglądanie" */}
    <div className="px-14 mt-12">
      <div className="bx-2" style={{padding:0, overflow:'hidden'}}>
        <div className="banner" style={{height:120}}></div>
        <div style={{padding:12}}>
          <div className="row jc-sb ai-c">
            <div className="mono">SERIAL · S02E04</div>
            <span className="chip blue on" style={{fontSize:11, padding:'1px 6px'}}>kontynuuj</span>
          </div>
          <div className="hand" style={{fontSize:22, fontWeight:700, marginTop:2}}>The Bear</div>
          <div className="lbl" style={{fontSize:13, color:'var(--ink-3)'}}>„Sundae" · 12 min oglądane</div>
          <div style={{height:4, background:'var(--muted-2)', marginTop:10}}>
            <div style={{width:'28%', height:'100%', background:'var(--blue)'}} />
          </div>
        </div>
      </div>
    </div>

    {/* Bento quick stats */}
    <div className="px-14 mt-16" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
      <div className="bx" style={{padding:10}}>
        <div className="mono">FILMY</div>
        <div className="hand" style={{fontSize:28, fontWeight:700, color:'var(--red)'}}>142</div>
        <div className="lbl" style={{fontSize:12}}>obejrzane</div>
      </div>
      <div className="bx" style={{padding:10}}>
        <div className="mono">SERIALE</div>
        <div className="hand" style={{fontSize:28, fontWeight:700, color:'var(--blue)'}}>23</div>
        <div className="lbl" style={{fontSize:12}}>w trakcie</div>
      </div>
      <div className="bx" style={{padding:10, gridColumn:'span 2'}}>
        <div className="row jc-sb ai-c">
          <div className="mono">W KOLEJCE</div>
          <span className="lbl" style={{fontSize:12}}>8 pozycji</span>
        </div>
        <div className="row gap-4 mt-8">
          {Array.from({length:5}).map((_,i)=>(
            <div key={i} className={'poster ' + (i%2?'red':'blue')} style={{width:'100%', height:54}} />
          ))}
        </div>
      </div>
    </div>

    {/* Szybkie akcje */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8">Szybkie akcje</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6}}>
        {[['⌕','Szukaj'],['✎','Dodaj'],['☐','Kolekcje'],['♻','Losuj']].map(([ic,l],i)=>(
          <div key={i} className="bx" style={{padding:'10px 4px', textAlign:'center'}}>
            <div className="mono" style={{fontSize:16}}>{ic}</div>
            <div className="lbl" style={{fontSize:11}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8"><span className="mark" /> Polecane na wieczór</div>
      {posterRow(6, 'red', 130)}
    </div>

    <TabBar active="home" />
    <Note top={260} right={2} w={140} rotate={2.5}>Mniej siatek, więcej „co zrobić teraz"</Note>
  </div>
);

// Desktop dashboard (same content, top nav + sidebar friends)
const DashboardDesktop = () => (
  <div className="wf" style={{height:'100%'}}>
    <TopNav active="home" />
    <div style={{display:'grid', gridTemplateColumns:'1fr 280px', height: 'calc(100% - 50px)'}}>
      <div className="wf-scroll p-20" style={{paddingBottom:40}}>
        <h1 style={{fontSize:44, textAlign:'center'}}>Panel</h1>
        <div className="lbl" style={{fontSize:16, textAlign:'center', color:'var(--ink-3)', marginTop:2}}>Odkryj najpopularniejsze filmy i seriale</div>
        <div className="bx" style={{margin:'18px auto 0', maxWidth:520, padding:'10px 14px'}}>
          <span className="mono">⌕</span> <span className="lbl" style={{marginLeft:8, color:'var(--ink-3)'}}>Szukaj filmów i seriali…</span>
        </div>

        <div style={{marginTop:32}}>
          <div className="section-title mb-8"><span className="mark" /> Ostatnio oglądane</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10}}>
            {Array.from({length:6}).map((_,i)=><div key={i} className={'poster ' + (i%2?'red':'blue')} style={{height:180}} />)}
          </div>
        </div>
        <div style={{marginTop:28}}>
          <div className="row jc-sb ai-c mb-8"><div className="section-title"><span className="mark red" /> Popularne filmy</div><span className="lbl" style={{fontSize:13}}>Zobacz wszystkie →</span></div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10}}>
            {Array.from({length:6}).map((_,i)=><div key={i} className="poster red" style={{height:180}} />)}
          </div>
        </div>
        <div style={{marginTop:28}}>
          <div className="row jc-sb ai-c mb-8"><div className="section-title"><span className="mark blue" /> Popularne seriale</div><span className="lbl" style={{fontSize:13}}>Zobacz wszystkie →</span></div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10}}>
            {Array.from({length:6}).map((_,i)=><div key={i} className="poster blue" style={{height:180}} />)}
          </div>
        </div>
      </div>
      {/* Friends sidebar */}
      <div style={{borderLeft:'1.5px solid var(--line)', padding:16, overflow:'auto'}}>
        <div className="section-title mb-8">Znajomi</div>
        {Array.from({length:5}).map((_,i)=>(
          <div key={i} className="bx" style={{padding:10, display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
            <div style={{width:34,height:34,borderRadius:17, border:'1.5px solid var(--line)', display:'flex', alignItems:'center',justifyContent:'center', fontFamily:'Kalam'}}>{'KMAPN'[i]}</div>
            <div style={{flex:1}}>
              <div className="lbl" style={{fontSize:14, fontWeight:600}}>{['Kasia','Marek','Ania','Paweł','Natalia'][i]}</div>
              <div className="tiny">ogląda „{['Dune','Succession','Bear','Oppenheimer','Fleabag'][i]}"</div>
            </div>
            <span className={'dot ' + (i%2?'red':'blue')} />
          </div>
        ))}
        <div className="bx-d" style={{padding:10, textAlign:'center', marginTop:8}}>
          <span className="lbl" style={{fontSize:13}}>+ Zaproś znajomego</span>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {LoginV1, LoginV2, DashboardV1, DashboardV2, DashboardDesktop});
