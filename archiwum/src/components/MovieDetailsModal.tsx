import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Clock, Play } from 'lucide-react';
import { useMovieDetails, useTVShowDetails } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { Button } from './ui/button';
import { useEffect } from 'react';

interface MovieDetailsModalProps {
  id: string | null;
  type: 'movie' | 'tv';
  onClose: () => void;
}

export const MovieDetailsModal = ({ id, type, onClose }: MovieDetailsModalProps) => {
  const numericId = id ? parseInt(id) : 0;
  
  const { data: movieData, isLoading: movieLoading } = useMovieDetails(numericId);
  const { data: tvData, isLoading: tvLoading } = useTVShowDetails(numericId);
  
  const data = type === 'movie' ? movieData : tvData;
  const isLoading = type === 'movie' ? movieLoading : tvLoading;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!id) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background-secondary rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : data ? (
            <>
              {/* Backdrop Image */}
              <div className="relative h-64 md:h-96 overflow-hidden rounded-t-2xl">
                <img
                  src={tmdbService.getImageUrl(data.backdrop_path || data.poster_path, 'original')}
                  alt={data.title || data.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-background-secondary/50 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute bottom-6 left-6">
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Odtwórz
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Title & Rating */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {data.title || data.name}
                    </h2>
                    {data.tagline && (
                      <p className="text-foreground-secondary italic">{data.tagline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg shrink-0">
                    <Star className="w-5 h-5 text-primary fill-current" />
                    <span className="text-xl font-bold">{data.vote_average.toFixed(1)}</span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-foreground-secondary">
                  {(data.release_date || data.first_air_date) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(data.release_date || data.first_air_date || '').getFullYear()}
                      </span>
                    </div>
                  )}
                  {(data.runtime || data.episode_run_time?.[0]) && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{data.runtime || data.episode_run_time?.[0]} min</span>
                    </div>
                  )}
                  {data.status && (
                    <div className="px-3 py-1 bg-background rounded-full text-sm">
                      {data.status}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {data.genres && data.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {data.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Opis</h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    {data.overview || 'Brak opisu.'}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <h4 className="text-sm text-foreground-secondary mb-1">Popularność</h4>
                    <p className="font-semibold">{data.popularity.toFixed(0)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-foreground-secondary mb-1">Liczba głosów</h4>
                    <p className="font-semibold">{data.vote_count.toLocaleString()}</p>
                  </div>
                  {data.spoken_languages && data.spoken_languages.length > 0 && (
                    <div>
                      <h4 className="text-sm text-foreground-secondary mb-1">Języki</h4>
                      <p className="font-semibold">
                        {data.spoken_languages.map(lang => lang.name).join(', ')}
                      </p>
                    </div>
                  )}
                  {data.production_companies && data.production_companies.length > 0 && (
                    <div>
                      <h4 className="text-sm text-foreground-secondary mb-1">Produkcja</h4>
                      <p className="font-semibold">
                        {data.production_companies[0].name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-foreground-secondary">Nie znaleziono szczegółów</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
