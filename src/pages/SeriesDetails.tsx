import { useParams, useNavigate } from 'react-router-dom';
import { useTVShowDetails } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddToCollectionButton } from '@/components/AddToCollectionButton';
import { EpisodeManager } from '@/components/EpisodeManager';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ScraperButton } from '@/components/ScraperButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTVShowDetails(parseInt(id || '0'));
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-foreground-secondary">{t('series.noResults')}</p>
        <Button onClick={() => navigate('/series')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Backdrop Image */}
      <div className="relative h-[50vh] md:h-[60vh] -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-8 overflow-hidden">
        {/* Back Button Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/series')}
            className="gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Button>
        </div>
        <img
          src={tmdbService.getImageUrl(data.backdrop_path || data.poster_path, 'original')}
          alt={data.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.name}</h1>
            {data.tagline && (
              <p className="text-xl text-foreground-secondary italic mb-6">{data.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6">
          <AddToCollectionButton
            tmdbId={data.id}
            type="tv"
            title={data.name}
            posterPath={data.poster_path}
          />
          
          <ScraperButton
            movieId={`tmdb_${data.id}`}
            title={data.name}
            type="series"
            year={data.first_air_date ? new Date(data.first_air_date).getFullYear() : undefined}
          />
          
          {data.vote_average > 0 && (
            <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-primary fill-current" />
              <span className="text-2xl font-bold">{data.vote_average.toFixed(1)}</span>
              <span className="text-foreground-secondary text-sm">/ 10</span>
            </div>
          )}
          
          {data.first_air_date && (
            <div className="flex items-center gap-2 text-foreground-secondary">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">{new Date(data.first_air_date).getFullYear()}</span>
            </div>
          )}
          
          {data.episode_run_time && data.episode_run_time[0] && (
            <div className="flex items-center gap-2 text-foreground-secondary">
              <Clock className="w-5 h-5" />
              <span className="text-lg">{data.episode_run_time[0]} min</span>
            </div>
          )}
          
          {data.status && (
            <div className="px-4 py-2 bg-background-secondary rounded-lg text-lg">
              {data.status}
            </div>
          )}
        </div>

        {/* Genres */}
        {data.genres && data.genres.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {data.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-base font-medium"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Seasons & Episodes */}
        {data.number_of_seasons && data.number_of_seasons > 0 && (
          <div className="bg-background-secondary rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6">Sezony i Odcinki</h2>
            
            <div className="space-y-4">
              {data.seasons
                ?.filter(season => season.season_number > 0)
                .slice(0, showAllSeasons ? undefined : 3)
                .map((season) => (
                <div
                  key={season.id}
                  className="bg-background rounded-lg border border-border overflow-hidden"
                >
                  {/* Season Header */}
                  <button
                    onClick={() => setExpandedSeason(
                      expandedSeason === season.season_number ? null : season.season_number
                    )}
                    className="w-full p-4 flex items-center gap-4 hover:bg-background/80 transition-colors"
                  >
                    {season.poster_path && (
                      <img
                        src={tmdbService.getImageUrl(season.poster_path, 'w200')}
                        alt={season.name}
                        className="w-12 h-18 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg">{season.name}</h3>
                      <p className="text-sm text-foreground-secondary">
                        {season.episode_count} {season.episode_count === 1 ? 'odcinek' : 'odcinków'}
                        {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                      </p>
                    </div>
                    <div className="text-foreground-secondary">
                      {expandedSeason === season.season_number ? '▼' : '▶'}
                    </div>
                  </button>

                  {expandedSeason === season.season_number && isAdmin && (
                    <div className="p-4 border-t border-border">
                      <EpisodeManager
                        tmdbId={data.id}
                        seasonNumber={season.season_number}
                        episodeCount={season.episode_count}
                        seasonName={season.name}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {data.seasons && data.seasons.filter(s => s.season_number > 0).length > 3 && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllSeasons(!showAllSeasons)}
                  className="w-full sm:w-auto"
                >
                  {showAllSeasons ? (
                    <>{t('common.showLess')}</>
                  ) : (
                    <>{t('common.showMore')} ({data.seasons.filter(s => s.season_number > 0).length})</>
                  )}
                </Button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-foreground-secondary">
                <span className="font-semibold">{data.number_of_seasons}</span> {data.number_of_seasons === 1 ? 'sezon' : 'sezonów'} • 
                <span className="font-semibold ml-1">{data.number_of_episodes}</span> {data.number_of_episodes === 1 ? 'odcinek' : 'odcinków'} łącznie
              </p>
            </div>
          </div>
        )}

        {/* Overview */}
        <div className="bg-background-secondary rounded-xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4">{t('common.overview')}</h2>
          <p className="text-foreground-secondary text-lg leading-relaxed">
            {data.overview || t('common.noDescription')}
          </p>
        </div>

        {/* Additional Info Grid */}
        {(() => {
          const infoItems = [];
          
          if (data.popularity > 0) {
            infoItems.push({ label: 'Popularność', value: data.popularity.toFixed(0) });
          }
          if (data.vote_count > 0) {
            infoItems.push({ label: 'Liczba głosów', value: data.vote_count.toLocaleString() });
          }
          if (data.spoken_languages && data.spoken_languages.length > 0) {
            infoItems.push({ label: 'Języki', value: data.spoken_languages.map(lang => lang.name).join(', ') });
          }
          if (data.production_companies && data.production_companies.length > 0) {
            infoItems.push({ label: 'Produkcja', value: data.production_companies[0].name });
          }

          return infoItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infoItems.map((item, index) => (
                <div key={index} className="bg-background-secondary rounded-xl p-6">
                  <h3 className="text-sm text-foreground-secondary mb-2">{item.label}</h3>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null;
        })()}

        {/* Reviews */}
        <ReviewsSection tmdbId={data.id} type="tv" mediaTitle={data.name} />
      </div>
    </motion.div>
  );
};

export default SeriesDetails;
