import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { TrendingUp, Film, Tv, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePopularMovies, usePopularTVShows } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: popularMoviesData } = usePopularMovies();
  const { data: popularTVData } = usePopularTVShows();

  const popularMovies = popularMoviesData?.pages[0]?.results.slice(0, 6) || [];
  const popularTV = popularTVData?.pages[0]?.results.slice(0, 6) || [];
  const trending = [...popularMovies.slice(0, 3), ...popularTV.slice(0, 3)];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <SplitText 
          text={t('nav.dashboard')}
          className="text-5xl lg:text-6xl font-bold"
        />
        <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
          {t('dashboard.recommendations')}
        </p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Trendy</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.map((item) => {
            const isMovie = item.media_type === 'movie' || item.title;
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
      </section>

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
