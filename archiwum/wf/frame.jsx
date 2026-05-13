// Device frames — iPhone-like and desktop browser shell.
// MobileFrame: 360x760 inner viewport.
// DesktopFrame: 1280x800 inner viewport.

const MobileFrame = ({children, label, anno}) => (
  <div style={{position:'relative', width: 380, height: 780, padding: 10,
    background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div style={{
      width: 360, height: 760, border:'2.5px solid var(--line)', borderRadius: 36,
      background:'var(--paper)', overflow:'hidden', position:'relative',
      boxShadow:'3px 3px 0 var(--line)',
    }}>
      <div style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%)',
        width:100,height:22,background:'var(--ink)',borderRadius:12,zIndex:10}} />
      <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column'}}>
        <div className="statusbar" style={{paddingTop:14}}>
          <span>9:41</span>
          <span className="right mono">•••  ▲  ▮▮▮</span>
        </div>
        <div style={{flex:1, minHeight:0, position:'relative'}}>{children}</div>
      </div>
    </div>
  </div>
);

const DesktopFrame = ({children, label}) => (
  <div style={{width: 1280, height: 800, border:'2.5px solid var(--line)', borderRadius: 10,
    overflow:'hidden', background:'var(--paper)', boxShadow:'3px 3px 0 var(--line)'}}>
    <div style={{height:30, borderBottom:'1.5px solid var(--line)', display:'flex', alignItems:'center', gap:6, padding:'0 10px', background:'var(--paper-2)'}}>
      <div style={{width:10,height:10,borderRadius:5,border:'1.5px solid var(--line)'}} />
      <div style={{width:10,height:10,borderRadius:5,border:'1.5px solid var(--line)'}} />
      <div style={{width:10,height:10,borderRadius:5,border:'1.5px solid var(--line)'}} />
      <div style={{flex:1,textAlign:'center',fontFamily:'JetBrains Mono, monospace',fontSize:11,color:'var(--ink-3)'}}>
        archiwum.app {label? ' / ' + label : ''}
      </div>
    </div>
    <div style={{width:'100%', height:770, position:'relative'}}>{children}</div>
  </div>
);

const Frame = ({variant, mobile, desktop, label}) => {
  const [mode, setMode] = React.useState(document.body.getAttribute('data-frame') || 'mobile');
  React.useEffect(()=>{
    const h = (e)=> setMode(e.detail.frame);
    window.addEventListener('tweak-change', h);
    return ()=>window.removeEventListener('tweak-change', h);
  },[]);
  if(mode==='desktop') return <DesktopFrame label={label}>{desktop || mobile}</DesktopFrame>;
  return <MobileFrame label={label}>{mobile || desktop}</MobileFrame>;
};

// Shared bits
const TabBar = ({active='home'}) => {
  const items = [
    {k:'home', lbl:'Panel', ic:'◉'},
    {k:'movies', lbl:'Filmy', ic:'▶'},
    {k:'series', lbl:'Seriale', ic:'■'},
    {k:'coll', lbl:'Kolekcje', ic:'☐'},
    {k:'me', lbl:'Konto', ic:'◯'},
  ];
  return (
    <div className="tabbar">
      {items.map(it=>(
        <div key={it.k} className={'t'+(active===it.k?' on':'')}>
          <div className="ic">{it.ic}</div>
          <div>{it.lbl}</div>
        </div>
      ))}
    </div>
  );
};

const TopNav = ({active='home'}) => (
  <div className="topbar">
    <div className="logo">Archiwum</div>
    <div className="nav" style={{marginLeft:10}}>
      {[['home','Panel'],['movies','Filmy'],['series','Seriale'],['coll','Moje kolekcje']].map(([k,l])=>(
        <span key={k} style={{borderBottom: active===k? '2px solid var(--ink)':'2px solid transparent', paddingBottom:2, fontWeight: active===k?700:400}}>{l}</span>
      ))}
    </div>
    <div className="grow" />
    <div className="bx" style={{padding:'6px 10px', display:'flex', alignItems:'center', gap:6, width:260}}>
      <span className="mono" style={{color:'var(--ink-3)'}}>⌕</span>
      <span className="hand" style={{fontSize:14, color:'var(--ink-3)'}}>Szukaj filmów i seriali…</span>
    </div>
    <div className="bx" style={{width:32, height:32, borderRadius:16, display:'flex',alignItems:'center',justifyContent:'center', fontFamily:'Kalam',fontSize:13}}>J</div>
  </div>
);

// Note (like post-it inside a screen, optional via tweak)
const Note = ({top, left, right, bottom, rotate=-1.5, w=160, children}) => {
  const [show, setShow] = React.useState(document.body.getAttribute('data-notes') !== 'off');
  React.useEffect(()=>{
    const h = (e)=> setShow(e.detail.notes !== 'off');
    window.addEventListener('tweak-change', h);
    return ()=>window.removeEventListener('tweak-change', h);
  },[]);
  if(!show) return null;
  return <div style={{
    position:'absolute', top, left, right, bottom, width:w,
    background:'var(--yellow)', padding:'8px 10px',
    fontFamily:'Caveat, cursive', fontSize:14, lineHeight:1.2, color:'#3a2a10',
    transform:`rotate(${rotate}deg)`, zIndex:20,
    boxShadow:'2px 2px 0 rgba(0,0,0,.2)',
  }}>{children}</div>;
};

Object.assign(window, {MobileFrame, DesktopFrame, Frame, TabBar, TopNav, Note});
