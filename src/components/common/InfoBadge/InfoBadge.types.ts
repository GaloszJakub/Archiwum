import { type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import { infoBadgeVariants } from "./InfoBadge";

/**
 * Props for the InfoBadge component.
 * 
 * @example
 * ```tsx
 * import { Calendar } from "lucide-react";
 * 
 * <InfoBadge
 *   icon={Calendar}
 *   label="Release Year"
 *   value="2024"
 *   variant="year"
 * />
 * ```
 */
export interface InfoBadgeProps extends VariantProps<typeof infoBadgeVariants> {
  /**
   * Optional icon to display before the label/value.
   * Should be a Lucide icon component.
   * 
   * @example
   * ```tsx
   * import { Star } from "lucide-react";
   * <InfoBadge icon={Star} value="8.5" variant="rating" />
   * ```
   */
  icon?: LucideIcon;

  /**
   * Optional label text to display.
   * If provided, will be shown before the value.
   * 
   * @example
   * ```tsx
   * <InfoBadge label="Year" value="2024" />
   * ```
   */
  label?: string;

  /**
   * The main value to display in the badge.
   * Can be a string or number.
   * 
   * @example
   * ```tsx
   * <InfoBadge value="Action" variant="genre" />
   * <InfoBadge value={2024} variant="year" />
   * ```
   */
  value: string | number;

  /**
   * Optional additional CSS classes to apply to the badge.
   * Will be merged with variant classes using the cn() utility.
   */
  className?: string;

  /**
   * Optional ARIA label for accessibility.
   * If not provided, will be constructed from label and value.
   */
  "aria-label"?: string;
}
