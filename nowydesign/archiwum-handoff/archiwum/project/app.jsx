/* ARCHIWUM — design canvas assembly */

function App() {
  return (
    <DesignCanvas
      title="Archiwum"
      subtitle="Personal media library · ciemny, kinowy redesign"
    >
      <DCSection
        id="mobile"
        title="Mobile"
        subtitle="iOS · 402 × 874"
      >
        <DCArtboard id="m-home" label="Główna · Biblioteka" width={402} height={874}>
          <IOSDevice dark={true} width={402} height={874}>
            <MobileHome />
          </IOSDevice>
        </DCArtboard>

        <DCArtboard id="m-browse" label="Przeglądaj · Siatka" width={402} height={874}>
          <IOSDevice dark={true} width={402} height={874}>
            <MobileBrowse />
          </IOSDevice>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="desktop"
        title="Desktop"
        subtitle="Responsywny · 1440px"
      >
        <DCArtboard id="d-home" label="Główna · Web" width={1440} height={980}>
          <Desktop />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
