import { useNavigate } from 'react-router-dom';
import { tmdbService, MovieDetails as MovieDetailsType } from '@/lib/tmdb';

interface MovieDetailsHeaderProps {
  data: MovieDetailsType;
}

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
};

export const MovieDetailsHeader = ({ data }: MovieDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Back Button Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/movies')}
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
      
      {/* Backdrop Image */}
      <img
        src={tmdbService.getImageUrl(data.backdrop_path || data.poster_path, 'original')}
        alt={data.title}
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0c, rgba(10,10,12,0.5) 50%, transparent)' }} />

      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto w-full px-0 lg:px-8">
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 400, color: A.text, lineHeight: 1, marginBottom: 16 }}>
            {data.title}
          </h1>
          {data.tagline && (
            <p style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontStyle: 'italic', color: A.text2 }}>
              {data.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
