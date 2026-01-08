import { DetailedMovie } from '@/lib/tmdb';

interface AdditionalInfoGridProps {
  data: DetailedMovie;
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {infoItems.map((item, index) => (
        <div key={index} className="bg-background-secondary rounded-xl p-6">
          <h3 className="text-sm text-foreground-secondary mb-2">{item.label}</h3>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdditionalInfoGrid;
