import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchTVShows, usePopularTVShows, useDiscoverTVShows, useTVGenres } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';

const Series = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const observerTarget = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data: genresData } = useTVGenres();

  const hasFilters = selectedGenre || sortBy !== 'popularity.desc';

  // Use search, discover with filters, or popular TV shows
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    error: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage
  } = useSearchTVShows(debouncedQuery);
  
  const { 
    data: discoverData, 
    isLoading: discoverLoading, 
    error: discoverError,
    fetchNextPage: fetchNextDiscoverPage,
    hasNextPage: hasNextDiscoverPage,
    isFetchingNextPage: isFetchingNextDiscoverPage
  } = useDiscoverTVShows({
    with_genres: selectedGenre,
    sort_by: sortBy,
  });
  
  const { 
    data: popularData, 
    isLoading: popularLoading, 
    error: popularError,
    fetchNextPage: fetchNextPopularPage,
    hasNextPage: hasNextPopularPage,
    isFetchingNextPage: isFetchingNextPopularPage
  } = usePopularTVShows();

  // Use search results if query exists, discover if filters, otherwise popular
  const series = debouncedQuery 
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
            text={t('series.title')}
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
            placeholder={t('series.search')}
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
            variant={selectedGenre === '10759' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10759')}
            className="shrink-0"
          >
            Akcja
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
            variant={selectedGenre === '99' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('99')}
            className="shrink-0"
          >
            Dokumentalny
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
            variant={selectedGenre === '10751' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10751')}
            className="shrink-0"
          >
            Familijny
          </Button>
          <Button
            variant={selectedGenre === '9648' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('9648')}
            className="shrink-0"
          >
            Horror
          </Button>
          <Button
            variant={selectedGenre === '10765' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10765')}
            className="shrink-0"
          >
            Sci-Fi
          </Button>
          <Button
            variant={selectedGenre === '10766' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10766')}
            className="shrink-0"
          >
            Soap Opera
          </Button>
          <Button
            variant={selectedGenre === '10768' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre('10768')}
            className="shrink-0"
          >
            Wojenny
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-background-secondary rounded-lg p-4 border border-border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="text-sm text-foreground-secondary mb-2 block">Sortowanie</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity.desc">Najpopularniejsze</option>
                <option value="vote_average.desc">Najlepiej oceniane</option>
                <option value="first_air_date.desc">Najnowsze</option>
                <option value="name.asc">Alfabetycznie A-Z</option>
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
            Błąd podczas ładowania seriali. Sprawdź klucz API.
          </p>
        </div>
      )}

      {/* Series Grid */}
      {!isLoading && !error && series.length > 0 && (
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
          {Array.from(new Map(series.map(s => [s.id, s])).values()).map((show, index) => (
            <motion.div
              key={`${show.id}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => navigate(`/series/${show.id}`)}
            >
              <MovieCard
                id={show.id.toString()}
                title={show.name || 'Unknown'}
                posterUrl={tmdbService.getImageUrl(show.poster_path)}
                year={show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined}
                rating={show.vote_average}
                layoutId={`series-${show.id}`}
                tmdbId={show.id}
                type="tv"
                posterPath={show.poster_path}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && series.length === 0 && debouncedQuery && (
        <div className="text-center py-16">
          <p className="text-foreground-secondary mb-4">
            Nie znaleziono seriali dla "{debouncedQuery}"
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
      {!hasNextPage && series.length > 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-foreground-secondary text-sm">
            {debouncedQuery 
              ? `To wszystkie wyniki dla "${debouncedQuery}"`
              : `Wyświetlono ${series.length} seriali`
            }
          </p>
        </div>
      )}

    </div>
  );
};

export default Series;
