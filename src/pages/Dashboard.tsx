import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { Shuffle, Film, Tv, Star, Search, Loader2, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { usePopularMovies, usePopularTVShows, useSearchMulti } from '@/hooks/useTMDB';
import { useUserCollections } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: popularMoviesData } = usePopularMovies();
  const { data: popularTVData } = usePopularTVShows();
  const { data: searchData, isLoading: searchLoading } = useSearchMulti(debouncedQuery);
  const { data: collections } = useUserCollections();

  const popularMovies = popularMoviesData?.pages[0]?.results.slice(0, 6) || [];
  const popularTV = popularTVData?.pages[0]?.results.slice(0, 6) || [];

  // Get random items from all collections
  const [randomCollectionItems, setRandomCollectionItems] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRandomItems = async () => {
      if (!collections || collections.length === 0 || !user) {
        setRandomCollectionItems([]);
        return;
      }

      try {
        const { collectionsService } = await import('@/lib/collections');

        const allItemsPromises = collections.map(async (col) => {
          const items = await collectionsService.getCollectionItems(user.uid, col.id);
          return items.map(item => ({
            ...item,
            collectionName: col.name
          }));
        });

        const allItemsArrays = await Promise.all(allItemsPromises);
        const allItems = allItemsArrays.flat();

        // Shuffle and take 6 random items
        const shuffled = [...allItems].sort(() => Math.random() - 0.5);
        setRandomCollectionItems(shuffled.slice(0, 6));
      } catch (error) {
        console.error('Error fetching collection items:', error);
        setRandomCollectionItems([]);
      }
    };

    fetchRandomItems();
  }, [collections, user]);

  const searchResults = searchData?.pages[0]?.results || [];
  const showSearchResults = debouncedQuery.trim().length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        {/* Mobile Profile Icon */}


        <div className="text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <SplitText
              text={t('nav.dashboard')}
              className="text-5xl lg:text-6xl font-bold"
            />
            <div className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 scale-150">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="rounded-full w-12 h-12"
              >
                <User className="w-8 h-8" />
              </Button>
            </div>
          </div>

          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            {t('dashboard.recommendations')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Szukaj filmów i seriali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-6 text-lg bg-background-secondary border-border"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Wyniki wyszukiwania dla "{debouncedQuery}"
                </h2>
              </div>
            </div>

            {searchLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!searchLoading && searchResults.length === 0 && (
              <div className="text-center py-16 bg-background-secondary rounded-xl">
                <p className="text-foreground-secondary text-lg">
                  Nie znaleziono wyników dla "{debouncedQuery}"
                </p>
              </div>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((item: any) => {
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
          </motion.section>
        )}
      </AnimatePresence>

      {randomCollectionItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shuffle className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Z Twoich Kolekcji</h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/collections')}
              className="text-primary hover:text-primary-hover"
            >
              Zobacz wszystkie →
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {randomCollectionItems.map((item) => {
              const isMovie = item.type === 'movie';
              return (
                <div
                  key={`${item.tmdbId}-${item.type}-${item.id}`}
                  onClick={() => navigate(isMovie ? `/movie/${item.tmdbId}` : `/series/${item.tmdbId}`)}
                >
                  <MovieCard
                    id={item.tmdbId.toString()}
                    title={item.title}
                    posterUrl={tmdbService.getImageUrl(item.posterPath)}
                    tmdbId={item.tmdbId}
                    type={item.type}
                    posterPath={item.posterPath}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">{t('movies.popular')}</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/movies')}
            className="text-primary hover:text-primary-hover"
          >
            {t('dashboard.viewAll')} →
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <MovieCard
                id={movie.id.toString()}
                title={movie.title || 'Unknown'}
                posterUrl={tmdbService.getImageUrl(movie.poster_path)}
                year={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                rating={movie.vote_average}
                tmdbId={movie.id}
                type="movie"
                posterPath={movie.poster_path}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tv className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">{t('series.popular')}</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/series')}
            className="text-primary hover:text-primary-hover"
          >
            {t('dashboard.viewAll')} →
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularTV.map((show) => (
            <div
              key={show.id}
              onClick={() => navigate(`/series/${show.id}`)}
            >
              <MovieCard
                id={show.id.toString()}
                title={show.name || 'Unknown'}
                posterUrl={tmdbService.getImageUrl(show.poster_path)}
                year={show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined}
                rating={show.vote_average}
                tmdbId={show.id}
                type="tv"
                posterPath={show.poster_path}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="bg-background-secondary rounded-xl p-8 text-center space-y-4">
        <Star className="w-12 h-12 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Odkryj najlepiej oceniane produkcje</h2>
        <p className="text-foreground-secondary max-w-xl mx-auto">
          Przeglądaj tysiące filmów i seriali z całego świata
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => navigate('/movies')} size="lg">
            <Film className="w-5 h-5 mr-2" />
            Filmy
          </Button>
          <Button onClick={() => navigate('/series')} variant="outline" size="lg">
            <Tv className="w-5 h-5 mr-2" />
            {t('series.title')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
