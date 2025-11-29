import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchMovies, usePopularMovies, useDiscoverMovies, useMovieGenres } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';

const Movies = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const observerTarget = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data: genresData } = useMovieGenres();

  const hasFilters = selectedGenre || selectedYear || sortBy !== 'popularity.desc';

  // Use search, discover with filters, or popular movies
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    error: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage
  } = useSearchMovies(debouncedQuery);
  
  const { 
    data: discoverData, 
    isLoading: discoverLoading, 
    error: discoverError,
    fetchNextPage: fetchNextDiscoverPage,
    hasNextPage: hasNextDiscoverPage,
    isFetchingNextPage: isFetchingNextDiscoverPage
  } = useDiscoverMovies({
    with_genres: selectedGenre,
    sort_by: sortBy,
    year: selectedYear ? parseInt(selectedYear) : undefined,
  });
  
  const { 
    data: popularData, 
    isLoading: popularLoading, 
    error: popularError,
    fetchNextPage: fetchNextPopularPage,
    hasNextPage: hasNextPopularPage,
    isFetchingNextPage: isFetchingNextPopularPage
  } = usePopularMovies();

  // Use search results if query exists, discover if filters, otherwise popular
  const movies = debouncedQuery 
    ? (searchData?.pages.flatMap(page => page.results) || [])
    : hasFilters
    ? (discoverData?.pages.flatMap(page => page.results) || [])
    : (popularData?.pages.flatMap(page => page.results) || []);
  
  const isLoading = debouncedQuery ? searchLoading : hasFilters ? discoverLoading : popularLoading;
  const error = debouncedQuery ? searchError : hasFilters ? discoverError : popularError;
  const fetchNextPage = debouncedQuery ? fetchNextSearchPage : hasFilters ? fetchNextDiscoverPage : fetchNextPopularPage;
  const hasNextPage = debouncedQuery ? hasNextSearchPage : hasFilters ? hasNextDiscoverPage : hasNextPopularPage;
  const isFetchingNextPage = debouncedQuery ? isFetchingNextSearchPage : hasFilters ? isFetchingNextDiscoverPage : isFetchingNextPopularPage;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SplitText 
            text={t('movies.title')}
            className="text-3xl lg:text-5xl font-bold"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-background-secondary border-border hover:bg-secondary shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Mobile-friendly search bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
          <Input
            type="text"
            placeholder={t('movies.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background-secondary border-border w-full"
          />
        </div>

        {/* Quick genre filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedGenre === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('')}
            className="shrink-0"
          >
            Wszystkie
          </Button>
          <Button
            variant={selectedGenre === '28' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('28')}
            className="shrink-0"
          >
            Akcja
          </Button>
          <Button
            variant={selectedGenre === '12' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('12')}
            className="shrink-0"
          >
            Przygodowy
          </Button>
          <Button
            variant={selectedGenre === '16' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('16')}
            className="shrink-0"
          >
            Animacja
          </Button>
          <Button
            variant={selectedGenre === '35' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('35')}
            className="shrink-0"
          >
            Komedia
          </Button>
          <Button
            variant={selectedGenre === '80' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('80')}
            className="shrink-0"
          >
            Kryminał
          </Button>
          <Button
            variant={selectedGenre === '18' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('18')}
            className="shrink-0"
          >
            Dramat
          </Button>
          <Button
            variant={selectedGenre === '14' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('14')}
            className="shrink-0"
          >
            Fantasy
          </Button>
          <Button
            variant={selectedGenre === '27' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('27')}
            className="shrink-0"
          >
            Horror
          </Button>
          <Button
            variant={selectedGenre === '10749' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10749')}
            className="shrink-0"
          >
            Romans
          </Button>
          <Button
            variant={selectedGenre === '878' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('878')}
            className="shrink-0"
          >
            Sci-Fi
          </Button>
          <Button
            variant={selectedGenre === '53' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('53')}
            className="shrink-0"
          >
            Thriller
          </Button>
          <Button
            variant={selectedGenre === '10752' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10752')}
            className="shrink-0"
          >
            Wojenny
          </Button>
        </div>
      </div>

      {/* Filters (collapsible) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-background-secondary rounded-lg p-4 border border-border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-foreground-secondary mb-2 block">Gatunek</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Wszystkie</option>
                {genresData?.genres.map((genre) => (
                  <option key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground-secondary mb-2 block">Rok</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Wszystkie</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground-secondary mb-2 block">Sortowanie</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity.desc">Najpopularniejsze</option>
                <option value="vote_average.desc">Najlepiej oceniane</option>
                <option value="release_date.desc">Najnowsze</option>
                <option value="title.asc">Alfabetycznie A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-foreground-secondary mb-4">
            Błąd podczas ładowania filmów. Sprawdź klucz API.
          </p>
        </div>
      )}

      {/* Movies Grid */}
      {!isLoading && !error && movies.length > 0 && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {Array.from(new Map(movies.map(m => [m.id, m])).values()).map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <MovieCard
                id={movie.id.toString()}
                title={movie.title || 'Unknown'}
                posterUrl={tmdbService.getImageUrl(movie.poster_path)}
                year={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                rating={movie.vote_average}
                layoutId={`movie-${movie.id}`}
                tmdbId={movie.id}
                type="movie"
                posterPath={movie.poster_path}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && movies.length === 0 && debouncedQuery && (
        <div className="text-center py-16">
          <p className="text-foreground-secondary mb-4">
            Nie znaleziono filmów dla "{debouncedQuery}"
          </p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasNextPage && !isLoading && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          )}
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && movies.length > 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-foreground-secondary text-sm">
            {debouncedQuery 
              ? `To wszystkie wyniki dla "${debouncedQuery}"`
              : `Wyświetlono ${movies.length} filmów`
            }
          </p>
        </div>
      )}

    </div>
  );
};

export default Movies;
