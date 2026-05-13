import { DetailedMovie } from '@/lib/tmdb';

interface AdditionalInfoGridProps {
  data: DetailedMovie;
}

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
};

const AdditionalInfoGrid = ({ data }: AdditionalInfoGridProps) => {
  const infoItems = [];

  if (data.popularity > 0) {
    infoItems.push({ label: 'Popularność', value: data.popularity.toFixed(0) });
  }
  if (data.vote_count > 0) {
    infoItems.push({ label: 'Głosy', value: data.vote_count.toLocaleString() });
  }
  if (data.budget && data.budget > 0) {
    infoItems.push({ label: 'Budżet', value: `$${(data.budget / 1000000).toFixed(0)}M` });
  }
  if (data.revenue && data.revenue > 0) {
    infoItems.push({ label: 'Przychód', value: `$${(data.revenue / 1000000).toFixed(0)}M` });
  }
  if (data.spoken_languages && data.spoken_languages.length > 0) {
    infoItems.push({ label: 'Język', value: data.spoken_languages.map(lang => lang.name).join(', ') });
  }
  if (data.production_companies && data.production_companies.length > 0) {
    infoItems.push({ label: 'Produkcja', value: data.production_companies[0].name });
  }

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <div style={{ borderTop: `1px solid ${A.border}`, display: 'flex', flexWrap: 'wrap', borderBottom: `1px solid ${A.border}` }}>
      {infoItems.map((item, index) => (
        <div key={index} style={{ flex: '1 1 200px', borderRight: index < infoItems.length - 1 ? `1px solid ${A.border}` : 'none', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 36, color: A.text, lineHeight: 1 }}>{item.value}</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalInfoGrid;
