import { Inbox } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { EmptyStateProps } from "./EmptyState.types";

/**
 * EmptyState component variants using CVA (Class Variance Authority).
 * Defines different sizes for the empty state display.
 */
export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center gap-4 text-center",
  {
    variants: {
      /**
       * Size variants for the empty state
       */
      size: {
        sm: "py-8 px-4",
        md: "py-12 px-6",
        lg: "py-16 px-8",
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
  sm: 32,
  md: 48,
  lg: 64,
} as const;

/**
 * EmptyState component displays a message when no content is available.
 * 
 * Features:
 * - Customizable icon (defaults to Inbox)
 * - Title and optional description
 * - Optional action button
 * - Configurable size variants
 * - Tailwind CSS styling with className composition
 * - Centered layout with proper spacing
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <EmptyState title="No items found" />
 * 
 * // With description
 * <EmptyState
 *   title="No movies in your collection"
 *   description="Start adding movies to build your collection"
 * />
 * 
 * // With custom icon
 * import { Film } from "lucide-react";
 * <EmptyState
 *   icon={Film}
 *   title="No movies found"
 *   description="Try adjusting your search or filters"
 * />
 * 
 * // With action button
 * <EmptyState
 *   title="No collections yet"
 *   description="Create your first collection to organize your movies"
 *   action={
 *     <Button onClick={handleCreate}>
 *       Create Collection
 *     </Button>
 *   }
 * />
 * 
 * // Different sizes
 * <EmptyState size="sm" title="No results" />
 * <EmptyState size="lg" title="Nothing here" />
 * 
 * // Custom styling
 * <EmptyState
 *   title="Empty"
 *   className="min-h-[400px] bg-muted/50 rounded-lg"
 * />
 * ```
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  size,
  className,
}: EmptyStateProps) {
  const iconSize = iconSizeMap[size || "md"];

  return (
    <div
      className={cn(emptyStateVariants({ size }), className)}
      role="status"
      aria-live="polite"
    >
      <Icon
        className="text-muted-foreground/50"
        size={iconSize}
        aria-hidden="true"
      />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}

EmptyState.displayName = "EmptyState";
