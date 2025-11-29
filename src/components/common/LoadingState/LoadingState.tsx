import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * LoadingState component variants using CVA (Class Variance Authority).
 * Defines different sizes for the loading spinner.
 */
export const loadingStateVariants = cva(
  "flex flex-col items-center justify-center gap-3",
  {
    variants: {
      /**
       * Size variants for the loading spinner
       */
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Icon size mapping for different size variants
 */
const iconSizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export interface LoadingStateProps extends VariantProps<typeof loadingStateVariants> {
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
}

/**
 * LoadingState component displays a loading spinner with an optional message.
 * 
 * Features:
 * - Accessible with proper ARIA attributes for screen readers
 * - Animated spinner using Lucide icons
 * - Configurable size variants
 * - Optional loading message
 * - Tailwind CSS styling with className composition
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingState />
 * 
 * // With message
 * <LoadingState message="Loading movies..." />
 * 
 * // Different sizes
 * <LoadingState size="sm" message="Loading..." />
 * <LoadingState size="lg" message="Please wait..." />
 * 
 * // Custom styling
 * <LoadingState 
 *   size="md" 
 *   message="Fetching data..." 
 *   className="min-h-[400px]" 
 * />
 * ```
 */
export function LoadingState({
  message,
  size,
  className,
}: LoadingStateProps) {
  const iconSize = iconSizeMap[size || "md"];

  return (
    <div
      className={cn(loadingStateVariants({ size }), className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className="animate-spin text-primary"
        size={iconSize}
        aria-hidden="true"
      />
      {message && (
        <p className="text-muted-foreground">
          {message}
        </p>
      )}
      {/* Screen reader only text */}
      <span className="sr-only">
        {message || "Loading"}
      </span>
    </div>
  );
}

LoadingState.displayName = "LoadingState";
