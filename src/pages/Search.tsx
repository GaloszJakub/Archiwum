import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchMulti } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';

const A = {
  text: '#f3efe6',
  muted: '#847d6f',
  amber: '#d4a056',
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { data, isLoading } = useSearchMulti(query);

  const results = data?.pages[0]?.results || [];

  return (
    <div
      style={{
        padding: '32px 24px 100px',
        fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: A.text,
          marginBottom: 8,
        }}
      >
        Wyniki wyszukiwania
      </h1>
      {query && (
        <p style={{ fontSize: 14, color: A.muted, marginBottom: 32 }}>
          dla "{query}"
        </p>
      )}

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <Loader2 className="animate-spin" size={32} color={A.amber} />
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: A.muted, fontSize: 15 }}>
          Nie znaleziono wyników dla "{query}"
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((item: any) => {
            const isMovie = item.media_type === 'movie';
            const title = isMovie ? item.title : item.name;
            const year = isMovie
              ? item.release_date ? new Date(item.release_date).getFullYear() : undefined
              : item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined;

            return (
              <div
                key={item.id}
                onClick={() => navigate(isMovie ? `/movie/${item.id}` : `/series/${item.id}`)}
              >
                <MovieCard
                  id={item.id.toString()}
                  title={title || 'Unknown'}
                  posterUrl={tmdbService.getImageUrl(item.poster_path)}
                  year={year}
                  rating={item.vote_average}
                  tmdbId={item.id}
                  type={isMovie ? 'movie' : 'tv'}
                  posterPath={item.poster_path}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
