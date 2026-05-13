import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '@/hooks/useTMDB';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { MovieLinksManager } from '@/components/MovieLinksManager';
import { ReviewsSection } from '@/components/ReviewsSection';
import { MovieDetailsHeader } from '@/components/MovieDetailsHeader';
import { MetaInfo } from '@/components/MetaInfo';
import AdditionalInfoGrid from '@/components/AdditionalInfoGrid';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useMovieDetails(parseInt(id || '0'));
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
        <p className="text-foreground-secondary">Brak wyników</p>
        <Button onClick={() => navigate('/movies')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
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
      <MovieDetailsHeader data={data} />

      <div className="max-w-6xl mx-auto space-y-8 px-6 lg:px-8 pb-24">
        <MetaInfo data={data} />

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

        {isAdmin && <MovieLinksManager tmdbId={data.id} movieTitle={data.title} />}

        <div
          style={{
            background: '#14141a',
            border: '1px solid rgba(255,248,230,0.06)',
            borderRadius: 8,
            padding: '24px 28px',
          }}
        >
          <h2 style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#f3efe6', letterSpacing: '-0.01em' }}>Opis</h2>
          <p
            style={{
              fontFamily: '"Inter Tight", sans-serif',
              fontSize: 16,
              lineHeight: 1.75,
              color: '#b8b1a3',
              maxWidth: 800,
            }}
          >
            {data.overview || 'Brak opisu'}
          </p>
        </div>

        <AdditionalInfoGrid data={data} />

        <ReviewsSection tmdbId={data.id} type="movie" mediaTitle={data.title} />
      </div>
    </motion.div>
  );
};

export default MovieDetails;
