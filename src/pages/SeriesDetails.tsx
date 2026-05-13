import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTVShowDetails } from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { AddToCollectionButton } from '@/components/AddToCollectionButton';
import { EpisodeManager } from '@/components/EpisodeManager';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ScraperButton } from '@/components/ScraperButton';
import { useAuth } from '@/contexts/AuthContext';

const A = {
  bg: '#0a0a0c',
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
};

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error } = useTVShowDetails(parseInt(id || '0'));
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const { isAdmin } = useAuth();
  const initialState = location.state as { initialSeason?: number; initialEpisode?: number } | null;

  useEffect(() => {
    if (initialState?.initialSeason) {
      setExpandedSeason(initialState.initialSeason);
    }
  }, [initialState]);

  useEffect(() => {
    if (data?.seasons && initialState?.initialSeason) {
      const activeSeasons = data.seasons.filter(s => s.season_number > 0);
      const targetIndex = activeSeasons.findIndex(s => s.season_number === initialState.initialSeason);

      if (targetIndex >= 3) {
        setShowAllSeasons(true);
      }
    }
  }, [data, initialState]);

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
          onClick={() => navigate('/series')}
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
      {/* Backdrop Image Header */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => navigate('/series')}
            style={{
              background: 'rgba(10,10,12,0.4)',
              border: `1px solid ${A.border}`,
              color: A.text,
              padding: '8px 16px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              backdropFilter: 'blur(4px)',
            }}
            className="hover:bg-black/80 transition-colors cursor-pointer"
          >
            ← Powrót
          </button>
        </div>
        <img
          src={tmdbService.getImageUrl(data.backdrop_path || data.poster_path, 'original')}
          alt={data.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0c, rgba(10,10,12,0.5) 50%, transparent)' }} />

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto w-full px-0 lg:px-8">
            <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 400, color: A.text, lineHeight: 1, marginBottom: 16 }}>
              {data.name}
            </h1>
            {data.tagline && (
              <p style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', color: A.text2 }}>
                {data.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto space-y-12 px-6 lg:px-8 pb-32" style={{ fontFamily: '"Inter Tight", "Inter", sans-serif', marginTop: 40 }}>
        
        {/* Meta Actions & Quick Info */}
        <div className="flex flex-wrap items-center gap-4">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${A.border}`, padding: '8px 16px', color: A.text }}>
              <span style={{ color: A.amber }}>★</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>{data.vote_average.toFixed(1)}</span>
            </div>
          )}

          {data.first_air_date && (
            <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }}>
              {new Date(data.first_air_date).getFullYear()}
            </div>
          )}

          {data.episode_run_time && data.episode_run_time[0] && (
            <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }}>
              {data.episode_run_time[0]} MIN
            </div>
          )}

          {data.status && (
            <div style={{ border: `1px solid ${A.border}`, padding: '8px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2, textTransform: 'uppercase' }}>
              {data.status}
            </div>
          )}
        </div>

        {/* Genres */}
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

        {/* Overview */}
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

        {/* Seasons & Episodes */}
        {data.number_of_seasons && data.number_of_seasons > 0 && (
          <div style={{ borderTop: `1px solid ${A.border}`, paddingTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
              <h2 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sezony i Odcinki
              </h2>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
                {data.number_of_seasons} SEZ. / {data.number_of_episodes} ODC.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${A.border}` }}>
              {data.seasons
                ?.filter(season => season.season_number > 0)
                .slice(0, showAllSeasons ? undefined : 3)
                .map((season) => (
                  <div
                    key={season.id}
                    style={{ borderBottom: `1px solid ${A.border}` }}
                  >
                    <button
                      onClick={() => setExpandedSeason(
                        expandedSeason === season.season_number ? null : season.season_number
                      )}
                      aria-expanded={expandedSeason === season.season_number}
                      className="w-full flex items-center gap-6 hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ padding: '24px 0', border: 'none', background: 'transparent' }}
                    >
                      {season.poster_path && (
                        <img
                          src={tmdbService.getImageUrl(season.poster_path, 'w200')}
                          alt={season.name}
                          style={{ width: 60, height: 90, objectFit: 'cover', border: `1px solid ${A.border}` }}
                        />
                      )}
                      <div className="flex-1 text-left">
                        <h3 style={{ fontSize: 20, fontWeight: 400, color: A.text, margin: 0 }}>{season.name}</h3>
                        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, marginTop: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          {season.episode_count} ODC.
                          {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                        </p>
                      </div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: A.amber, paddingRight: 16 }}>
                        {expandedSeason === season.season_number ? '↓' : '→'}
                      </div>
                    </button>

                    {expandedSeason === season.season_number && (
                      <div style={{ padding: '24px 0', borderTop: `1px dashed ${A.border}` }}>
                        <EpisodeManager
                          tmdbId={data.id}
                          seasonNumber={season.season_number}
                          episodeCount={season.episode_count}
                          seasonName={season.name}
                          seriesName={data.name}
                          targetEpisode={initialState?.initialSeason === season.season_number ? initialState.initialEpisode : undefined}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Show More Button */}
            {data.seasons && data.seasons.filter(s => s.season_number > 0).length > 3 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAllSeasons(!showAllSeasons)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${A.border}`,
                    color: A.text,
                    padding: '12px 32px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  {showAllSeasons ? 'Pokaż mniej' : `Pokaż więcej (${data.seasons.filter(s => s.season_number > 0).length})`}
                </button>
              </div>
            )}
          </div>
        )}

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
            <div style={{ borderTop: `1px solid ${A.border}`, display: 'flex', borderBottom: `1px solid ${A.border}` }}>
              {infoItems.map((item, index) => (
                <div key={index} style={{ flex: 1, borderRight: index < infoItems.length - 1 ? `1px solid ${A.border}` : 'none', padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 36, color: A.text, lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
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
