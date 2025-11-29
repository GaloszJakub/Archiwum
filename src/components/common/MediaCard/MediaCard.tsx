import { Card } from "@/components/common/Card";
import { AddToCollectionButton } from "@/components/AddToCollectionButton";
import { cn } from "@/lib/utils";
import { type MediaCardProps } from "./MediaCard.types";

/**
 * Get the full TMDB image URL for a poster
 */
const getTMDBImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) {
    return "/placeholder.svg";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Extract year from release date string (YYYY-MM-DD)
 */
const getYear = (releaseDate: string | null): number | undefined => {
  if (!releaseDate) return undefined;
  const year = parseInt(releaseDate.split("-")[0], 10);
  return isNaN(year) ? undefined : year;
};

/**
 * MediaCard component - A specialized card for displaying movies and TV shows.
 * 
 * This component extends the generic Card component and provides
 * movie/series-specific rendering including:
 * - Poster image with lazy loading
 * - Title, year, and rating display
 * - Hover overlay with metadata
 * - Add to collection button
 * - 3D tilt effect
 * 
 * @example
 * ```tsx
 * <MediaCard
 *   media={movie}
 *   onClick={(media) => navigate(`/movie/${media.id}`)}
 *   showActions
 *   enable3DEffect
 * />
 * ```
 */
export function MediaCard({
  media,
  onClick,
  showActions = true,
  layoutId,
  className,
  enable3DEffect = true,
  enableHoverEffect = true,
}: MediaCardProps) {
  const posterUrl = getTMDBImageUrl(media.posterPath);
  const year = getYear(media.releaseDate);
  const rating = media.voteAverage;

  return (
    <Card
      data={media}
      layoutId={layoutId}
      onClick={onClick}
      enable3DEffect={enable3DEffect}
      enableHoverEffect={enableHoverEffect}
      variant="ghost"
      padding="none"
      className={cn("aspect-[2/3] group", className)}
      renderContent={(mediaItem) => (
        <div className="relative w-full h-full">
          {/* Poster Image */}
          <img
            src={posterUrl}
            alt={mediaItem.title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            decoding="async"
          />

          {/* Add to Collection Button */}
          {showActions && (
            <div
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <AddToCollectionButton
                tmdbId={mediaItem.id}
                type={mediaItem.type}
                title={mediaItem.title}
                posterPath={mediaItem.posterPath}
              />
            </div>
          )}

          {/* Hover Overlay with Metadata */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-white">
                {mediaItem.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
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
        </div>
      )}
    />
  );
}

MediaCard.displayName = "MediaCard";
