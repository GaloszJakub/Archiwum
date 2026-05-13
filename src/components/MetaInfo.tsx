import { MovieDetails as MovieDetailsType } from '@/lib/tmdb';
import { AddToCollectionButton } from './AddToCollectionButton';
import { ScraperButton } from './ScraperButton';

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
};

interface MetaInfoProps {
  data: MovieDetailsType;
}

export const MetaInfo = ({ data }: MetaInfoProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AddToCollectionButton
        tmdbId={data.id}
        type="movie"
        title={data.title}
        posterPath={data.poster_path}
      />
      
      <ScraperButton
        movieId={`tmdb_${data.id}`}
        title={data.title}
        type="movie"
        year={data.release_date ? new Date(data.release_date).getFullYear() : undefined}
      />
      
      {data.vote_average > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${A.border}`, padding: '8px 16px', color: A.text }}>
          <span style={{ color: A.amber }}>★</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>{data.vote_average.toFixed(1)}</span>
        </div>
      )}
      
      {data.release_date && (
        <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }}>
          {new Date(data.release_date).getFullYear()}
        </div>
      )}
      
      {data.runtime && (
        <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }}>
          {data.runtime} MIN
        </div>
      )}
      
      {data.status && (
        <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2, textTransform: 'uppercase' }}>
          {data.status}
        </div>
      )}
    </div>
  );
};
