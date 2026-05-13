import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchMulti } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlass, Faders } from '@phosphor-icons/react';

const A = {
  bg: '#0a0a0c',
  surface: '#14141a',
  surface2: '#1c1c23',
  border: 'rgba(255,248,230,0.06)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  muted: '#847d6f',
  amber: '#d4a056',
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const filterType = searchParams.get('type') || 'all';
  const filterYear = searchParams.get('year') || '';
  const filterSort = searchParams.get('sort') || 'popularity.desc';

  const [localQuery, setLocalQuery] = useState(query);
  const [localType, setLocalType] = useState(filterType);
  const [localYear, setLocalYear] = useState(filterYear);
  const [localSort, setLocalSort] = useState(filterSort);

  useEffect(() => {
    setLocalQuery(query);
    setLocalType(filterType);
    setLocalYear(filterYear);
    setLocalSort(filterSort);
  }, [query, filterType, filterYear, filterSort]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (localQuery.trim()) params.append('q', localQuery.trim());
    if (localType !== 'all') params.append('type', localType);
    if (localYear.trim()) params.append('year', localYear.trim());
    if (localSort !== 'popularity.desc') params.append('sort', localSort);
    setSearchParams(params);
  };
  
  const { data, isLoading } = useSearchMulti(query);

  const results = useMemo(() => {
    if (!data) return [];
    
    // Flatten all pages
    let items = data.pages.flatMap((page: any) => page.results) || [];

    // Filter by type
    if (filterType !== 'all') {
      items = items.filter((item: any) => item.media_type === filterType);
    }

    // Filter by year
    if (filterYear) {
      items = items.filter((item: any) => {
        const year = item.media_type === 'movie'
          ? item.release_date?.substring(0, 4)
          : item.first_air_date?.substring(0, 4);
        return year === filterYear;
      });
    }

    // Filter out people (only movies and tv)
    items = items.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');

    // Sort
    items = [...items].sort((a: any, b: any) => {
      if (filterSort === 'vote_average.desc') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (filterSort === 'primary_release_date.desc') {
        const dateA = new Date(a.media_type === 'movie' ? a.release_date || '' : a.first_air_date || '').getTime() || 0;
        const dateB = new Date(b.media_type === 'movie' ? b.release_date || '' : b.first_air_date || '').getTime() || 0;
        return dateB - dateA;
      }
      // default: popularity.desc
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return items;
  }, [data, filterType, filterYear, filterSort]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      {/* Left Filter Panel */}
      <div
        style={{
          width: 300,
          borderRight: `1px solid ${A.border}`,
          background: A.bg,
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
        className="hidden md:flex"
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: A.text, margin: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Faders weight="light" color={A.amber} /> Wyszukiwarka
          </h1>
          <p style={{ fontSize: 13, color: A.muted, margin: 0 }}>
            Skorzystaj z filtrów, aby doprecyzować wyniki.
          </p>
        </div>

        {/* Form elements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tytuł</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: A.surface,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                padding: '0 12px',
                height: 38,
                transition: 'all 0.2s',
              }}
              className="focus-within:border-[var(--amber)] focus-within:shadow-[0_0_0_1px_var(--amber)]"
            >
              <MagnifyingGlass size={16} color={A.muted} />
              <input
                type="text"
                placeholder="np. Matrix"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: A.text,
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typ mediów</label>
            <select
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
              style={{
                background: A.surface,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                height: 38,
                padding: '0 12px',
                color: A.text,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
              className="focus:border-[var(--amber)]"
            >
              <option value="all">Wszystko</option>
              <option value="movie">Tylko Filmy</option>
              <option value="tv">Tylko Seriale</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rok premiery</label>
            <input
              type="number"
              placeholder="np. 2023"
              value={localYear}
              onChange={(e) => setLocalYear(e.target.value)}
              style={{
                background: A.surface,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                height: 38,
                padding: '0 12px',
                color: A.text,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit'
              }}
              className="focus:border-[var(--amber)]"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sortowanie</label>
            <select
              value={localSort}
              onChange={(e) => setLocalSort(e.target.value)}
              style={{
                background: A.surface,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                height: 38,
                padding: '0 12px',
                color: A.text,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
              className="focus:border-[var(--amber)]"
            >
              <option value="popularity.desc">Najpopularniejsze</option>
              <option value="vote_average.desc">Najwyżej oceniane</option>
              <option value="primary_release_date.desc">Najnowsze</option>
            </select>
          </div>

          <button
            onClick={handleApply}
            style={{
              marginTop: 12,
              background: A.text,
              color: A.bg,
              border: 'none',
              borderRadius: 8,
              padding: '12px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="hover:opacity-90 active:scale-95"
          >
            Szukaj wyników
          </button>
        </div>
      </div>

      {/* Main Results Area */}
      <div style={{ flex: 1, padding: '32px 24px 100px', display: 'flex', flexDirection: 'column' }}>
        <div className="md:hidden mb-6">
          <h1 style={{ fontSize: 24, fontWeight: 600, color: A.text, margin: 0 }}>Wyszukiwarka</h1>
          <p style={{ fontSize: 14, color: A.muted }}>Użyj komputera, aby zobaczyć zaawansowane filtry.</p>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <Loader2 className="animate-spin" size={32} color={A.amber} />
          </div>
        )}

        {!isLoading && results.length === 0 && query && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: A.muted, fontSize: 15 }}>
            Nie znaleziono wyników dla Twoich kryteriów.
          </div>
        )}

        {!isLoading && !query && results.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: A.muted, opacity: 0.5 }}>
             <MagnifyingGlass size={64} weight="light" style={{ marginBottom: 16 }} />
             <p style={{ fontSize: 16 }}>Wpisz tytuł w panelu obok i kliknij "Szukaj wyników".</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </div>
  );
};

export default Search;
