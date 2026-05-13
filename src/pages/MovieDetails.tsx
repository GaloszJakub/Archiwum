import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '@/hooks/useTMDB';
import { motion } from 'framer-motion';
import { MovieLinksManager } from '@/components/MovieLinksManager';
import { ReviewsSection } from '@/components/ReviewsSection';
import { MovieDetailsHeader } from '@/components/MovieDetailsHeader';
import { MetaInfo } from '@/components/MetaInfo';
import AdditionalInfoGrid from '@/components/AdditionalInfoGrid';
import { useAuth } from '@/contexts/AuthContext';

const A = {
  bg: '#0a0a0c',
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
};

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useMovieDetails(parseInt(id || '0'));
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: A.bg }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', color: A.amber, fontSize: 12, letterSpacing: '0.1em' }} className="animate-pulse">
          ŁADOWANIE DANYCH...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ backgroundColor: A.bg }}>
        <p style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text2, fontSize: 12 }}>Brak wyników</p>
        <button 
          onClick={() => navigate('/movies')}
          style={{
            background: 'transparent',
            border: `1px solid ${A.border}`,
            color: A.text,
            padding: '12px 24px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          className="hover:bg-white/5 transition-colors"
        >
          Powrót
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
      style={{ backgroundColor: A.bg }}
    >
      <MovieDetailsHeader data={data} />

      <div className="max-w-6xl mx-auto space-y-12 px-6 lg:px-8 pb-32" style={{ fontFamily: '"Inter Tight", "Inter", sans-serif' }}>
        
        <MetaInfo data={data} />

        {data.genres && data.genres.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {data.genres.map((genre) => (
              <span
                key={genre.id}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${A.border}`,
                  color: A.text,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {isAdmin && <MovieLinksManager tmdbId={data.id} movieTitle={data.title} />}

        <div
          style={{
            borderTop: `1px solid ${A.border}`,
            borderBottom: `1px solid ${A.border}`,
            padding: '40px 0',
          }}
        >
          <h2 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 500, marginBottom: 24, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Opis fabuły
          </h2>
          <p
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 28,
              lineHeight: 1.4,
              color: A.text,
              maxWidth: 900,
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
