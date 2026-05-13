// Collections, Profile, and supporting screens

const CollectionsV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <h1 style={{fontSize:28}}>Moje kolekcje</h1>
        <div className="tiny">7 kolekcji · 184 pozycje</div>
      </div>
      <div className="bx-2" style={{padding:'6px 10px'}}><span className="hand" style={{fontSize:14, fontWeight:700}}>+ Nowa</span></div>
    </div>

    <div className="px-14 mt-12 col gap-10">
      {[
        ['Ulubione','ulubione filmy i seriale','red',12],
        ['Do obejrzenia','zapisane na później','blue',38],
        ['Kino autorskie','Villeneuve, Nolan, PTA','red',24],
        ['Polskie seriale','HBO MAX & Netflix PL','blue',8],
      ].map(([t,d,c,n],i)=>(
        <div key={i} className="bx" style={{padding:10}}>
          <div className="row gap-8 ai-c">
            {/* 4-poster collage */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, width:72, height:72, flex:'0 0 auto'}}>
              {[0,1,2,3].map(k=><div key={k} className={'poster ' + c} style={{width:'auto', height:'auto'}}/>)}
            </div>
            <div style={{flex:1}}>
              <div className="hand" style={{fontSize:20, fontWeight:700}}>{t}</div>
              <div className="tiny">{d}</div>
              <div className="row gap-4 mt-4">
                <span className="chip" style={{fontSize:11, padding:'1px 6px'}}>{n} pozycji</span>
                <span className={'chip ' + c} style={{fontSize:11, padding:'1px 6px'}}><span className={'dot ' + c}/> {c==='red'?'filmy':'seriale'}</span>
              </div>
            </div>
            <span className="mono">›</span>
          </div>
        </div>
      ))}
      <div className="bx-d" style={{padding:20, textAlign:'center'}}>
        <div className="hand" style={{fontSize:18}}>+ Utwórz kolekcję</div>
      </div>
    </div>

    <TabBar active="coll" />
    <Note top={80} right={6} w={140} rotate={3}>Kolaż 2×2 jako okładka</Note>
  </div>
);

const CollectionsV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{fontSize:28}}>Półka</h1>
      <span className="mono">+ NOWA</span>
    </div>
    <div className="px-14 tiny mt-4">Przesuwaj, przeciągaj, układaj własne zestawy</div>

    {/* Horizontal shelf: each collection = tall "book spine" */}
    <div className="px-14 mt-16">
      <div className="tiny mb-4">Prywatne</div>
      <div style={{display:'flex', gap:6, overflow:'hidden'}}>
        {[
          ['Ulubione','red',12],
          ['Do obejrzenia','blue',38],
          ['Kino autorskie','red',24],
          ['Retro','blue',9],
        ].map(([t,c,n],i)=>(
          <div key={i} className="bx" style={{
            width:88, height:200, flex:'0 0 auto',
            background: c==='red'?'color-mix(in oklch, var(--red) 14%, var(--paper))':'color-mix(in oklch, var(--blue) 14%, var(--paper))',
            display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:8
          }}>
            <div className="hand" style={{fontSize:16, fontWeight:700, writingMode:'vertical-rl', transform:'rotate(180deg)', lineHeight:1, height:120}}>{t}</div>
            <div className="tiny mt-4" style={{color:'var(--ink)'}}>{n}</div>
          </div>
        ))}
        <div className="bx-d center" style={{width:88, height:200, flex:'0 0 auto'}}>
          <span className="hand" style={{fontSize:18}}>+</span>
        </div>
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="tiny mb-4">Współdzielone z Kasią</div>
      <div style={{display:'flex', gap:6, overflow:'hidden'}}>
        {[['Horror-marathon','red',11],['Niedziela','blue',5]].map(([t,c,n],i)=>(
          <div key={i} className="bx" style={{
            width:88, height:200, flex:'0 0 auto',
            background: c==='red'?'color-mix(in oklch, var(--red) 14%, var(--paper))':'color-mix(in oklch, var(--blue) 14%, var(--paper))',
            display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:8
          }}>
            <div className="hand" style={{fontSize:16, fontWeight:700, writingMode:'vertical-rl', transform:'rotate(180deg)', lineHeight:1, height:120}}>{t}</div>
            <div className="tiny mt-4" style={{color:'var(--ink)'}}>{n} · K+J</div>
          </div>
        ))}
      </div>
    </div>

    {/* Smart collections */}
    <div className="px-14 mt-20">
      <div className="section-title mb-8">Inteligentne</div>
      <div className="col gap-6">
        {['Obejrzane w 2026 · 12 pozycji','Oceny 5★ · 18 pozycji','Dłuższe niż 3h · 4 pozycje'].map((t,i)=>(
          <div key={i} className="bx" style={{padding:'8px 10px', display:'flex', justifyContent:'space-between'}}>
            <span className="lbl" style={{fontSize:13}}>⚙ {t}</span>
            <span className="mono">›</span>
          </div>
        ))}
      </div>
    </div>

    <TabBar active="coll" />
    <Note top={190} right={6} w={150} rotate={-2}>Kolekcje jak grzbiety książek na półce</Note>
  </div>
);

const ProfileV1 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12}}>
      <h1 style={{fontSize:28}}>Konto</h1>
    </div>

    {/* Identity card */}
    <div className="px-14 mt-12">
      <div className="bx-2" style={{padding:14, display:'flex', gap:12, alignItems:'center'}}>
        <div style={{width:54,height:54,borderRadius:27, border:'2px solid var(--line)', display:'flex', alignItems:'center',justifyContent:'center', fontFamily:'Caveat', fontSize:24, fontWeight:700}}>J</div>
        <div style={{flex:1}}>
          <div className="hand" style={{fontSize:20, fontWeight:700}}>Jakub Galosz</div>
          <div className="tiny">jakub@gmail.com</div>
          <div className="chip on" style={{fontSize:11, padding:'1px 6px', marginTop:4}}>♛ Administrator</div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="px-14 mt-12" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
      {[['142','Filmy','red'],['23','Seriale','blue'],['7','Kolekcje','']].map(([n,l,c],i)=>(
        <div key={i} className="bx" style={{padding:'10px 4px', textAlign:'center'}}>
          <div className="hand" style={{fontSize:26, fontWeight:700, color: c==='red'?'var(--red)': c==='blue'?'var(--blue)':'var(--ink)'}}>{n}</div>
          <div className="tiny">{l}</div>
        </div>
      ))}
    </div>

    {/* Menu groups */}
    <div className="px-14 mt-16">
      <div className="section-title mb-8">Ustawienia</div>
      <div className="bx">
        {['Informacje o koncie','Wygląd (jasny / ciemny)','Powiadomienia','Znajomi i współdzielenie','Importuj z Filman','Zainstaluj jako aplikację'].map((t,i,a)=>(
          <div key={i} style={{padding:'10px 12px', borderBottom: i<a.length-1?'1px dashed var(--muted)':'none', display:'flex', justifyContent:'space-between'}}>
            <span className="lbl" style={{fontSize:13}}>{t}</span>
            <span className="mono">›</span>
          </div>
        ))}
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="bx" style={{padding:12, borderColor:'var(--red)'}}>
        <span className="hand" style={{fontSize:16, color:'var(--red)', fontWeight:700}}>⎋ Wyloguj się</span>
      </div>
    </div>

    <TabBar active="me" />
    <Note top={180} right={6} w={140} rotate={2}>Liczniki = osobisty „passport"</Note>
  </div>
);

const ProfileV2 = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    {/* Poster-wall avatar */}
    <div style={{position:'relative', height:160}}>
      <div style={{position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(6,1fr)'}}>
        {Array.from({length:6}).map((_,i)=><div key={i} className={'poster ' + (i%2?'red':'blue')} style={{height:'100%'}}/>)}
      </div>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(250,247,242,0) 0%, var(--paper) 90%)'}}/>
      <div style={{position:'absolute', left:14, bottom:6, display:'flex', gap:10, alignItems:'flex-end'}}>
        <div style={{width:62,height:62,borderRadius:31, border:'2.5px solid var(--line)', background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Caveat', fontSize:28, fontWeight:700}}>J</div>
        <div style={{paddingBottom:4}}>
          <div className="hand" style={{fontSize:22, fontWeight:700, lineHeight:1}}>Jakub</div>
          <div className="tiny">@jakubg · dołączył 2024</div>
        </div>
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8">Ten rok w liczbach</div>
      <div className="bx p-14">
        <div className="row jc-sb">
          <div>
            <div className="hand" style={{fontSize:34, fontWeight:700, color:'var(--red)'}}>38</div>
            <div className="tiny">filmów obejrzanych</div>
          </div>
          <div>
            <div className="hand" style={{fontSize:34, fontWeight:700, color:'var(--blue)'}}>124</div>
            <div className="tiny">odcinków</div>
          </div>
          <div>
            <div className="hand" style={{fontSize:34, fontWeight:700}}>82h</div>
            <div className="tiny">czasu ekranu</div>
          </div>
        </div>
        {/* activity heatmap */}
        <div className="mt-12">
          <div className="tiny mb-4">aktywność</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(26,1fr)', gap:2}}>
            {Array.from({length:52}).map((_,i)=>{
              const v = Math.floor(Math.random()*4);
              return <div key={i} style={{height:10, background: ['var(--muted-2)','color-mix(in oklch, var(--red) 30%, var(--paper))','color-mix(in oklch, var(--red) 55%, var(--paper))','var(--red)'][v], border:'1px solid var(--line)'}}/>
            })}
          </div>
        </div>
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8">Znajomi</div>
      <div style={{display:'flex', gap:6, overflow:'hidden'}}>
        {['K','M','A','P','N','+'].map((n,i)=>(
          <div key={i} style={{width:44,height:44,borderRadius:22, border:'1.5px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam', fontSize:14, flex:'0 0 auto', background: n==='+'?'var(--paper-2)':'var(--paper)'}}>{n}</div>
        ))}
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="bx" style={{padding:'8px 10px', display:'flex', justifyContent:'space-between', marginBottom:6}}>
        <span className="lbl">Ustawienia</span><span className="mono">›</span>
      </div>
      <div className="bx" style={{padding:'8px 10px', display:'flex', justifyContent:'space-between'}}>
        <span className="lbl" style={{color:'var(--red)'}}>Wyloguj się</span><span className="mono">›</span>
      </div>
    </div>

    <TabBar active="me" />
    <Note top={20} right={6} w={140} rotate={-3}>Profil jak „year in review"</Note>
  </div>
);

// Friends (supporting screen - shown as a single wireframe, no V2)
const FriendsScreen = () => (
  <div className="wf wf-scroll" style={{height:'100%', paddingBottom:90}}>
    <div className="px-14" style={{paddingTop:12}}>
      <div className="row jc-sb ai-c">
        <h1 style={{fontSize:26}}>Znajomi</h1>
        <span className="mono">+ Zaproś</span>
      </div>
    </div>

    <div className="px-14 mt-12">
      <div className="bx" style={{padding:'10px 12px', display:'flex', gap:8, alignItems:'center'}}>
        <span className="mono">⌕</span>
        <span className="lbl" style={{color:'var(--ink-3)', fontSize:13}}>Szukaj po e-mail lub nazwie…</span>
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8">Teraz oglądają</div>
      <div className="col gap-8">
        {[
          ['Kasia','The Bear · S2E4','blue',72],
          ['Marek','Dune: Część Druga','red',40],
          ['Ania','Fleabag · S1E3','blue',15],
        ].map(([n,what,c,p],i)=>(
          <div key={i} className="bx" style={{padding:10, display:'flex', gap:10, alignItems:'center'}}>
            <div style={{width:36,height:36,borderRadius:18, border:'1.5px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam'}}>{n[0]}</div>
            <div style={{flex:1}}>
              <div className="lbl" style={{fontSize:14, fontWeight:700}}>{n}</div>
              <div className="tiny">▶ {what}</div>
              <div style={{height:3, background:'var(--muted-2)', marginTop:6}}>
                <div style={{width:p+'%', height:'100%', background: c==='red'?'var(--red)':'var(--blue)'}}/>
              </div>
            </div>
            <span className="mono">⋯</span>
          </div>
        ))}
      </div>
    </div>

    <div className="px-14 mt-16">
      <div className="section-title mb-8">Wszyscy (5)</div>
      <div className="col gap-6">
        {['Kasia','Marek','Ania','Paweł','Natalia'].map((n,i)=>(
          <div key={i} className="bx" style={{padding:'8px 10px', display:'flex', gap:10, alignItems:'center'}}>
            <div style={{width:28,height:28,borderRadius:14, border:'1.5px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam', fontSize:13}}>{n[0]}</div>
            <span className="lbl" style={{flex:1, fontSize:13}}>{n}</span>
            <span className="tiny">{(i+1)*17} obejrzanych</span>
          </div>
        ))}
      </div>
    </div>

    <TabBar active="me" />
    <Note top={150} right={6} w={150} rotate={2}>Social: kto co ogląda teraz</Note>
  </div>
);

Object.assign(window, {CollectionsV1, CollectionsV2, ProfileV1, ProfileV2, FriendsScreen});
