import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type InfoBadgeProps } from "./InfoBadge.types";

/**
 * InfoBadge component variants using CVA (Class Variance Authority).
 * Defines different visual styles for displaying metadata information.
 */
export const infoBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      /**
       * Visual style variants for different types of information
       */
      variant: {
        year: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        rating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        genre: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        duration: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        status: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        default: "bg-secondary text-secondary-foreground",
      },
      /**
       * Size variants for the badge
       */
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/**
 * InfoBadge component for displaying metadata information.
 * 
 * Features:
 * - Optional icon support using Lucide icons
 * - Optional label and value display
 * - CVA-based variant styling for different information types
 * - Responsive design with Tailwind CSS
 * - Dark mode support
 * - Accessibility attributes
 * 
 * @example
 * ```tsx
 * import { Calendar, Star, Clock } from "lucide-react";
 * 
 * // Year badge
 * <InfoBadge
 *   icon={Calendar}
 *   value="2024"
 *   variant="year"
 * />
 * 
 * // Rating badge
 * <InfoBadge
 *   icon={Star}
 *   label="Rating"
 *   value="8.5"
 *   variant="rating"
 * />
 * 
 * // Duration badge
 * <InfoBadge
 *   icon={Clock}
 *   value="2h 30m"
 *   variant="duration"
 * />
 * 
 * // Genre badge (no icon)
 * <InfoBadge
 *   value="Action"
 *   variant="genre"
 * />
 * ```
 */
export function InfoBadge({
  icon: Icon,
  label,
  value,
  variant,
  size,
  className,
  "aria-label": ariaLabel,
}: InfoBadgeProps) {
  // Construct aria-label if not provided
  const accessibleLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;
    if (label) return `${label}: ${value}`;
    return String(value);
  }, [ariaLabel, label, value]);

  return (
    <span
      className={cn(infoBadgeVariants({ variant, size }), className)}
      role="status"
      aria-label={accessibleLabel}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {label && <span className="font-semibold">{label}:</span>}
      <span>{value}</span>
    </span>
  );
}

InfoBadge.displayName = "InfoBadge";
