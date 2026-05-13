// Movie & Series details

const DetailsMovieV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:30}}>
    {/* Hero banner */}
    <div style={{position:'relative'}}>
      <div className="banner" style={{height:220}}/>
      <div style={{position:'absolute', top:10, left:12}} className="bx" >
        <span className="mono" style={{padding:'4px 8px'}}>← Powrót</span>
      </div>
      <div style={{position:'absolute', top:10, right:12, display:'flex', gap:6}}>
        <div className="bx" style={{padding:'4px 8px'}}><span className="mono">♡</span></div>
        <div className="bx" style={{padding:'4px 8px'}}><span className="mono">⋯</span></div>
      </div>
      <div style={{position:'absolute', left:14, bottom:-40, display:'flex', gap:12, alignItems:'flex-end'}}>
        <div className="poster red" style={{width:88, height:132}}/>
        <div style={{paddingBottom:6}}>
          <div className="mono">FILM · 2024</div>
          <div className="hand" style={{fontSize:26, fontWeight:700, lineHeight:1}}>Dune: Część Druga</div>
          <div className="tiny">166 min · PG-13</div>
        </div>
      </div>
    </div>

    <div style={{height:50}}/>

    <div className="px-14">
      <div className="row gap-6 ai-c">
        <span className="chip red on" style={{fontSize:12}}>★ 8.6</span>
        <span className="chip" style={{fontSize:12}}>TMDb 84%</span>
        <span className="tiny">· 12 k ocen</span>
      </div>
    </div>

    {/* Primary actions */}
    <div className="px-14 mt-12" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
      <div className="bx-2" style={{padding:'10px 12px', textAlign:'center', background:'var(--ink)', color:'var(--paper)'}}>
        <span className="hand" style={{fontSize:16, fontWeight:700}}>✓ Obejrzane</span>
      </div>
      <div className="bx-2" style={{padding:'10px 12px', textAlign:'center'}}>
        <span className="hand" style={{fontSize:16}}>+ Do kolekcji</span>
      </div>
    </div>

    {/* Genres */}
    <div className="px-14 mt-12" style={{display:'flex', gap:6, flexWrap:'wrap'}}>
      {['Sci-Fi','Przygodowy','Dramat'].map(g=><span key={g} className="pill" style={{background:'var(--red-soft)', borderColor:'var(--red)', color:'var(--red)'}}>{g}</span>)}
    </div>

    {/* Description */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8">Opis</div>
      <div className="bx" style={{padding:12}}>
        <div className="lbl" style={{fontSize:14, lineHeight:1.5, color:'var(--ink-2)'}}>
          Paul Atreydes łączy siły z Chani i Fremenami, rusza na wojnę przeciw tym, którzy zniszczyli jego rodzinę. Musi wybierać pomiędzy miłością a losem wszechświata…
        </div>
      </div>
    </div>

    {/* Info grid */}
    <div className="px-14 mt-16" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
      {[['Reżyseria','Denis Villeneuve'],['Budżet','$190 mln'],['Wpływy','$711 mln'],['Kraj','USA / Kanada']].map(([k,v],i)=>(
        <div key={i} className="bx" style={{padding:8}}>
          <div className="mono">{k}</div>
          <div className="lbl" style={{fontSize:14}}>{v}</div>
        </div>
      ))}
    </div>

    {/* Links (admin) */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8">Linki</div>
      <div className="col gap-4">
        {['Filman · 1080p · PL','Filman · 720p · Napisy','Netflix'].map((l,i)=>(
          <div key={i} className="bx" style={{padding:'8px 10px', display:'flex', justifyContent:'space-between'}}>
            <span className="lbl" style={{fontSize:13}}>{l}</span>
            <span className="mono">↗</span>
          </div>
        ))}
      </div>
    </div>

    {/* Reviews */}
    <div className="px-14 mt-16 mb-16">
      <div className="row jc-sb ai-c mb-8">
        <div className="section-title">Recenzje</div>
        <span className="lbl" style={{fontSize:13}}>+ Dodaj</span>
      </div>
      <div className="bx" style={{padding:10}}>
        <div className="row jc-sb ai-c">
          <div className="row gap-6 ai-c">
            <div style={{width:26,height:26,borderRadius:13, border:'1.5px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam', fontSize:12}}>K</div>
            <span className="lbl" style={{fontSize:13, fontWeight:600}}>Kasia</span>
          </div>
          <span className="mono">★★★★☆</span>
        </div>
        <div className="lbl" style={{fontSize:13, marginTop:6, color:'var(--ink-2)'}}>Wizualnie majstersztyk. Pustynia żyje.</div>
      </div>
    </div>

    <Note top={60} right={8} w={130} rotate={4}>Hero + plakat — kinowo</Note>
    <Note top={380} right={6} w={140} rotate={-2}>Akcje blisko tytułu</Note>
  </div>
);

const DetailsMovieV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:30}}>
    {/* compact header */}
    <div style={{position:'sticky', top:0, zIndex:5, background:'var(--paper)', padding:'8px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1.5px solid var(--line)'}}>
      <span className="mono">←</span>
      <span className="lbl" style={{fontSize:13, fontWeight:600}}>Dune: Część Druga</span>
      <span className="mono">⋯</span>
    </div>

    <div className="p-14">
      <div className="row gap-12">
        <div className="poster red" style={{width:110, height:160, flex:'0 0 auto'}}/>
        <div style={{flex:1}}>
          <div className="mono">FILM · 2024</div>
          <div className="hand" style={{fontSize:22, fontWeight:700, lineHeight:1.05}}>Dune: Część Druga</div>
          <div className="tiny">Denis Villeneuve</div>
          <div className="row gap-4 mt-8">
            <span className="chip red on" style={{fontSize:11, padding:'1px 6px'}}>★ 8.6</span>
            <span className="chip" style={{fontSize:11, padding:'1px 6px'}}>166'</span>
          </div>
          <div className="row gap-6 mt-8" style={{flexWrap:'wrap'}}>
            {['Sci-Fi','Dramat'].map(g=><span key={g} className="pill" style={{fontSize:11, padding:'1px 8px'}}>{g}</span>)}
          </div>
        </div>
      </div>

      {/* Status row — segmented */}
      <div className="mt-16">
        <div className="bx" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)'}}>
          {[['▶','Do obejrzenia'],['◴','W trakcie'],['✓','Obejrzane',true],['✕','Porzucone']].map(([ic,l,on],i)=>(
            <div key={i} style={{padding:'10px 6px', textAlign:'center', background: on?'var(--ink)':'transparent', color: on?'var(--paper)':'var(--ink)', borderRight: i<3?'1.5px solid var(--line)':'none'}}>
              <div className="mono" style={{color: on?'var(--paper)':'var(--ink-3)'}}>{ic}</div>
              <div className="lbl" style={{fontSize:11}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My rating */}
      <div className="bx mt-12" style={{padding:12}}>
        <div className="mono">TWOJA OCENA</div>
        <div className="row gap-4 mt-4 ai-c">
          {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:22, color: n<=4?'var(--red)':'var(--muted)'}}>★</span>)}
          <span className="lbl" style={{marginLeft:'auto', fontSize:13, color:'var(--ink-3)'}}>Dodaj notatkę</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16" style={{display:'flex', borderBottom:'1.5px solid var(--line)'}}>
        {['Opis','Obsada','Linki','Recenzje (3)'].map((t,i)=>(
          <div key={t} style={{padding:'8px 10px', fontFamily:'Kalam',fontSize:13, borderBottom: i===0?'3px solid var(--red)':'3px solid transparent', fontWeight:i===0?700:400}}>{t}</div>
        ))}
      </div>

      <div className="lbl mt-12" style={{fontSize:14, lineHeight:1.5, color:'var(--ink-2)'}}>
        Paul Atreydes łączy siły z Chani i Fremenami, rusza na wojnę przeciw tym, którzy zniszczyli jego rodzinę.
      </div>

      <div className="mt-16">
        <div className="section-title mb-8">Podobne</div>
        <div style={{display:'flex', gap:6, overflow:'hidden'}}>
          {Array.from({length:5}).map((_,i)=><div key={i} className="poster red" style={{width:70,height:100,flex:'0 0 auto'}}/>)}
        </div>
      </div>
    </div>

    <Note top={220} right={6} w={150} rotate={3}>Status jako segment — jeden ruch kciukiem</Note>
  </div>
);

// Series details — highlights episode tracker
const DetailsSeriesV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:30}}>
    <div style={{position:'relative'}}>
      <div className="banner" style={{height:200, background:'repeating-linear-gradient(45deg, transparent 0 10px, rgba(26,26,26,.06) 10px 11px), color-mix(in oklch, var(--blue) 12%, var(--paper))'}}/>
      <div style={{position:'absolute', top:10, left:12}} className="bx"><span className="mono" style={{padding:'4px 8px'}}>← Powrót</span></div>
      <div style={{position:'absolute', left:14, bottom:-30, display:'flex', gap:10, alignItems:'flex-end'}}>
        <div className="poster blue" style={{width:80, height:120}}/>
        <div style={{paddingBottom:6}}>
          <div className="mono">SERIAL · FX · 2022–</div>
          <div className="hand" style={{fontSize:24, fontWeight:700, lineHeight:1}}>The Bear</div>
        </div>
      </div>
    </div>
    <div style={{height:42}}/>

    {/* progress */}
    <div className="px-14 mt-8">
      <div className="bx" style={{padding:10}}>
        <div className="row jc-sb ai-c">
          <div className="lbl" style={{fontSize:13, fontWeight:600}}>Sezon 2 · Odcinek 4</div>
          <span className="chip blue on" style={{fontSize:11, padding:'1px 6px'}}>ogląd.</span>
        </div>
        <div className="tiny">12 z 26 odcinków · 46%</div>
        <div style={{height:4, background:'var(--muted-2)', marginTop:8}}>
          <div style={{width:'46%',height:'100%',background:'var(--blue)'}}/>
        </div>
      </div>
    </div>

    {/* Season picker */}
    <div className="px-14 mt-16" style={{display:'flex', gap:6, overflow:'hidden'}}>
      {['Sezon 1','Sezon 2','Sezon 3'].map((s,i)=><span key={s} className={'chip blue' + (i===1?' on':'')}>{s}</span>)}
    </div>

    {/* Episode list */}
    <div className="px-14 mt-12 col gap-6">
      {[
        ['01','Pass the Torch','S2E1',true],
        ['02','Pasta','S2E2',true],
        ['03','Sundae','S2E3',true],
        ['04','Honeydew','S2E4',false,true], // current
        ['05','Pop','S2E5',false],
        ['06','Fishes','S2E6',false],
      ].map(([n,t,c,seen,cur],i)=>(
        <div key={i} className="bx" style={{padding:'8px 10px', display:'flex', alignItems:'center', gap:10, background: cur?'var(--blue-soft)':'var(--paper)'}}>
          <div className="bx" style={{width:22,height:22, display:'flex',alignItems:'center',justifyContent:'center'}}>
            {seen? <span className="mono">✓</span> : cur? <span className="mono">▶</span> : <span className="mono">{n}</span>}
          </div>
          <div style={{flex:1}}>
            <div className="lbl" style={{fontSize:13, fontWeight: cur?700:500}}>{t}</div>
            <div className="tiny">{c} · 48 min</div>
          </div>
          <span className="mono">⋯</span>
        </div>
      ))}
    </div>

    <Note top={120} right={6} w={140} rotate={2}>Tracker jako główny element</Note>
  </div>
);

const DetailsSeriesV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:30}}>
    {/* "filmstrip" approach */}
    <div className="p-14">
      <div className="row gap-10">
        <div className="poster blue" style={{width:96, height:140, flex:'0 0 auto'}}/>
        <div style={{flex:1}}>
          <div className="mono">SERIAL · FX</div>
          <div className="hand" style={{fontSize:24, fontWeight:700}}>The Bear</div>
          <div className="tiny">2022 · 3 sezony · dramat</div>
          <div className="mt-8 bx" style={{padding:'4px 6px', display:'inline-block'}}>
            <span className="lbl" style={{fontSize:12}}>Następny: <b>S2E4</b></span>
          </div>
        </div>
      </div>

      {/* filmstrip: sezony jako wstążki */}
      <div className="mt-16">
        <div className="section-title mb-8">Przebieg</div>
        <div className="col gap-6">
          {[1,2,3].map(s=>(
            <div key={s}>
              <div className="tiny mb-4">Sezon {s}</div>
              <div style={{display:'flex', gap:2}}>
                {Array.from({length: s===1?8 : s===2?10:10}).map((_,i)=>{
                  const seen = (s===1) || (s===2 && i<3);
                  const cur  = s===2 && i===3;
                  return <div key={i} style={{flex:1, height:22, background: seen?'var(--blue)': cur?'var(--blue-soft)':'var(--muted-2)', border:'1.5px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono', fontSize:9, color: seen?'var(--paper)':'var(--ink-3)'}}>{i+1}</div>
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aktywny odcinek */}
      <div className="mt-16 bx-2" style={{padding:12}}>
        <div className="mono">TERAZ</div>
        <div className="hand" style={{fontSize:20, fontWeight:700}}>S2E4 · „Honeydew"</div>
        <div className="lbl" style={{fontSize:13, color:'var(--ink-2)', marginTop:4}}>Marcus wyrusza do Kopenhagi, by uczyć się u mistrza cukiernictwa.</div>
        <div className="row gap-6 mt-12">
          <div className="bx" style={{flex:1, padding:'8px', textAlign:'center', background:'var(--ink)', color:'var(--paper)'}}>
            <span className="hand" style={{fontSize:14, fontWeight:700}}>✓ Obejrzane</span>
          </div>
          <div className="bx" style={{padding:'8px 12px'}}>
            <span className="mono">↗</span>
          </div>
        </div>
      </div>

      <div className="mt-16 section-title mb-8">Obsada</div>
      <div style={{display:'flex', gap:6, overflow:'hidden'}}>
        {['JAW','AES','LC','EM','ME'].map((n,i)=>(
          <div key={i} className="bx" style={{width:64, flex:'0 0 auto', padding:6, textAlign:'center'}}>
            <div className="banner" style={{height:64, marginBottom:4}}/>
            <div className="tiny" style={{color:'var(--ink)'}}>{n}</div>
          </div>
        ))}
      </div>
    </div>

    <Note top={260} right={8} w={140} rotate={-3}>Wstążki odcinków — postęp „widać"</Note>
  </div>
);

Object.assign(window, {DetailsMovieV1, DetailsMovieV2, DetailsSeriesV1, DetailsSeriesV2});
