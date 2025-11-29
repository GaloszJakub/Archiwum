import { type MediaItem } from "@/types/domain/media";

/**
 * Props for the MediaCard component.
 * A specialized card component for displaying movies and TV shows.
 */
export interface MediaCardProps {
  /**
   * The media item (movie or TV show) to display
   */
  media: MediaItem;

  /**
   * Optional click handler when the card is clicked
   * @param media - The media item that was clicked
   */
  onClick?: (media: MediaItem) => void;

  /**
   * Whether to show action buttons (e.g., add to collection)
   * @default true
   */
  showActions?: boolean;

  /**
   * Optional layout ID for Framer Motion shared layout animations
   */
  layoutId?: string;

  /**
   * Optional additional CSS classes
   */
  className?: string;

  /**
   * Enable 3D tilt effect on hover
   * @default true
   */
  enable3DEffect?: boolean;

  /**
   * Enable hover scale effect
   * @default true
   */
  enableHoverEffect?: boolean;
}
