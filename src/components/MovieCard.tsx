import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

export const MovieCard = memo(({ id, title, posterUrl, year, rating, layoutId, tmdbId, type, posterPath, onClick }: MovieCardProps & { onClick?: () => void }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    setRotateY(percentX * 10);
    setRotateX(-percentY * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-background-secondary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      whileHover={{ scale: 1.05 }}
      whileFocus={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full h-full"
      >
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Add to Collection Button */}
        {tmdbId && type && (
          <div
            className="absolute top-2 right-2 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-foreground-secondary">
              {year && <span>{year}</span>}
              {rating && rating > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    ⭐ {rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';
