import { motion } from 'framer-motion';
import { memo } from 'react';
import { AddToCollectionButton } from '@/components/AddToCollectionButton';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year?: number;
  rating?: number;
  layoutId?: string;
  tmdbId?: number;
  type?: 'movie' | 'tv';
  posterPath?: string | null;
  onClick?: () => void;
}

export const MovieCard = memo(({ id, title, posterUrl, year, rating, layoutId, tmdbId, type, posterPath, onClick }: MovieCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="group relative aspect-[2/3] overflow-hidden rounded-none bg-[#14141a] cursor-pointer focus:outline-none border border-white/5 transition-colors duration-500"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      whileHover={{ 
        y: -2,
        x: -2,
        boxShadow: '3px 3px 0px 0px rgba(212, 160, 86, 1)',
        borderColor: 'rgba(212, 160, 86, 1)'
      }}
      whileFocus={{ 
        y: -2,
        x: -2,
        boxShadow: '3px 3px 0px 0px rgba(212, 160, 86, 1)',
        borderColor: 'rgba(212, 160, 86, 1)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="w-full h-full relative">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:grayscale-[30%] group-hover:contrast-110"
          loading="lazy"
        />

        {/* Add to Collection Button */}
        {tmdbId && type && (
          <div
            className="absolute top-3 right-3 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform lg:translate-y-[-10px] lg:group-hover:translate-y-0"
            onClick={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <AddToCollectionButton
              tmdbId={tmdbId}
              type={type}
              title={title}
              posterPath={posterPath || null}
            />
          </div>
        )}

        {/* Prestige Overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex flex-col justify-end z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.5) 45%, transparent 100%)',
          }}
        >
          <div 
            className="p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out"
          >
            <h3 
              style={{ fontFamily: '"Inter Tight", sans-serif', letterSpacing: '-0.01em' }}
              className="font-semibold text-[#f3efe6] text-base mb-1.5 line-clamp-2 leading-tight drop-shadow-md"
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: '#b8b1a3' }}>
              {year && <span>{year}</span>}
              {rating && rating > 0 && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1.5" style={{ color: '#d4a056' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';
