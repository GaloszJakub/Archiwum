import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchMovies, usePopularMovies } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';

const Movies = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Use search or popular movies
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    error: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage
  } = useSearchMovies(debouncedQuery);
  
  const { 
    data: popularData, 
    isLoading: popularLoading, 
    error: popularError,
    fetchNextPage: fetchNextPopularPage,
    hasNextPage: hasNextPopularPage,
    isFetchingNextPage: isFetchingNextPopularPage
  } = usePopularMovies();

  // Use search results if query exists, otherwise use popular movies
  const movies = debouncedQuery 
    ? (searchData?.pages.flatMap(page => page.results) || [])
    : (popularData?.pages.flatMap(page => page.results) || []);
  
  const isLoading = debouncedQuery ? searchLoading : popularLoading;
  const error = debouncedQuery ? searchError : popularError;
  const fetchNextPage = debouncedQuery ? fetchNextSearchPage : fetchNextPopularPage;
  const hasNextPage = debouncedQuery ? hasNextSearchPage : hasNextPopularPage;
  const isFetchingNextPage = debouncedQuery ? isFetchingNextSearchPage : isFetchingNextPopularPage;

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
      <div className="flex items-center justify-between">
        <SplitText 
          text={t('movies.title')}
          className="text-4xl lg:text-5xl font-bold"
        />
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <Input
              type="text"
              placeholder={t('movies.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background-secondary border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-background-secondary border-border hover:bg-secondary"
          >
            <SlidersHorizontal className="w-4 h-4" />
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
              <label className="text-sm text-foreground-secondary mb-2 block">{t('common.genre')}</label>
              <select className="w-full bg-background border-border rounded-md px-3 py-2 text-sm">
                <option>{t('common.all')}</option>
                <option>Akcja</option>
                <option>Sci-Fi</option>
                <option>Dramat</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground-secondary mb-2 block">{t('common.year')}</label>
              <select className="w-full bg-background border-border rounded-md px-3 py-2 text-sm">
                <option>{t('common.all')}</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground-secondary mb-2 block">{t('common.sort')}</label>
              <select className="w-full bg-background border-border rounded-md px-3 py-2 text-sm">
                <option>Najnowsze</option>
                <option>Najlepiej oceniane</option>
                <option>Alfabetycznie</option>
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
