// Main app — assemble the design canvas

const Intro = () => (
  <div style={{padding:'40px 60px 0', maxWidth:980}}>
    <div className="mono" style={{color:'var(--ink-3)'}}>ARCHIWUM · WIREFRAMES · v0.1</div>
    <h1 style={{fontFamily:'Caveat', fontSize:56, margin:'4px 0 6px', fontWeight:700}}>Przeróbka designu — szkic</h1>
    <div className="lbl" style={{fontSize:17, color:'var(--ink-2)', maxWidth:680, lineHeight:1.35}}>
      Mid-fi wireframes dla aplikacji <b>Archiwum</b> (osobisty katalog filmów i seriali).
      Dwa warianty na ekran, układ strukturalny (nawigacja, siatka/lista, hero vs. zagęszczenie).
      Mobile PWA jako główny cel — przełącz na Desktop w panelu <span className="mono">Tweaks</span>.
    </div>
    <div className="legend mt-12" style={{marginTop:16}}>
      <div className="k"><span className="sw red"/> Filmy</div>
      <div className="k"><span className="sw blue"/> Seriale</div>
      <div className="k"><span className="sw" style={{background:'var(--yellow)', borderColor:'#c9a400'}}/> Notatka projektowa</div>
      <div className="k mono" style={{fontSize:11}}>plakaty = paski placeholder</div>
    </div>
  </div>
);

const App = () => (
  <>
    <Intro/>
    <DesignCanvas>
      <DCSection id="login" title="01 · Logowanie" subtitle="Ekran wejścia — jedno kliknięcie przez Google">
        <DCArtboard id="v1" label="V1 · Minimalny" width={380} height={780}><LoginV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Hero narracyjny" width={380} height={780}><LoginV2/></DCArtboard>
      </DCSection>

      <DCSection id="dashboard" title="02 · Panel (Dashboard)" subtitle="Strona startowa po zalogowaniu">
        <DCArtboard id="v1" label="V1 · Klasyczny feed (rzędy + szukanie)" width={380} height={780}><DashboardV1/></DCArtboard>
        <DCArtboard id="v2" label={'V2 · Personalny („co dziś?”)'} width={380} height={780}><DashboardV2/></DCArtboard>
        <DCArtboard id="desktop" label="Desktop · Panel + znajomi w sidebarze" width={1280} height={800}><DashboardDesktop/></DCArtboard>
      </DCSection>

      <DCSection id="movies" title="03 · Filmy" subtitle="Biblioteka filmów — odkrywanie vs. filtrowanie">
        <DCArtboard id="v1" label="V1 · Sekcje (Netflix-style)" width={380} height={780}><MoviesV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Filtr + gęsta siatka" width={380} height={780}><MoviesV2/></DCArtboard>
      </DCSection>

      <DCSection id="series" title="04 · Seriale" subtitle="Seriale — odkrywanie vs. tracker odcinków">
        <DCArtboard id="v1" label={'V1 · Sekcje + „kontynuuj”'} width={380} height={780}><SeriesV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Tracker (status-first)" width={380} height={780}><SeriesV2/></DCArtboard>
      </DCSection>

      <DCSection id="movie-details" title="05 · Szczegóły filmu" subtitle="Pełny widok tytułu filmowego">
        <DCArtboard id="v1" label="V1 · Hero + plakat + sekcje" width={380} height={780}><DetailsMovieV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Kompakt + status segment" width={380} height={780}><DetailsMovieV2/></DCArtboard>
      </DCSection>

      <DCSection id="series-details" title="06 · Szczegóły serialu" subtitle="Widok tytułu serialowego — tracker odcinków">
        <DCArtboard id="v1" label="V1 · Lista odcinków" width={380} height={780}><DetailsSeriesV1/></DCArtboard>
        <DCArtboard id="v2" label={'V2 · „Filmstrip” sezonów'} width={380} height={780}><DetailsSeriesV2/></DCArtboard>
      </DCSection>

      <DCSection id="collections" title="07 · Kolekcje" subtitle="Zestawy tworzone przez użytkownika">
        <DCArtboard id="v1" label="V1 · Lista kafelków z kolażem" width={380} height={780}><CollectionsV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Półka (grzbiety książek)" width={380} height={780}><CollectionsV2/></DCArtboard>
      </DCSection>

      <DCSection id="profile" title="08 · Profil / Konto" subtitle="Ustawienia i Twoja statystyka">
        <DCArtboard id="v1" label="V1 · Ustawienia klasyczne" width={380} height={780}><ProfileV1/></DCArtboard>
        <DCArtboard id="v2" label="V2 · Year-in-review" width={380} height={780}><ProfileV2/></DCArtboard>
      </DCSection>

      <DCSection id="friends" title="09 · Znajomi" subtitle="Social — kto co ogląda teraz">
        <DCArtboard id="v1" label="V1 · Lista + aktywność" width={380} height={780}><FriendsScreen/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
