import { AlertCircle } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { APIError } from "@/utils/errors/APIError";
import type { ErrorStateProps } from "./ErrorState.types";

/**
 * ErrorState component variants using CVA (Class Variance Authority).
 * Defines different sizes for the error state display.
 */
export const errorStateVariants = cva(
  "flex flex-col items-center justify-center gap-4 text-center",
  {
    variants: {
      /**
       * Size variants for the error state
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
 * Get user-friendly error message from error object
 */
function getErrorMessage(error: Error | string): string {
  if (typeof error === "string") {
    return error;
  }

  // Handle APIError with specific messages
  if (APIError.isAPIError(error)) {
    return error.message;
  }

  // Handle generic Error
  return error.message || "An unexpected error occurred";
}

/**
 * ErrorState component displays error information with an optional retry action.
 * 
 * Features:
 * - Displays user-friendly error messages
 * - Supports Error objects, APIError, and string messages
 * - Optional retry button with customizable callback
 * - Customizable icon (defaults to AlertCircle)
 * - Configurable size variants
 * - Tailwind CSS styling with className composition
 * - Proper ARIA attributes for accessibility
 * 
 * @example
 * ```tsx
 * // Basic usage with string
 * <ErrorState error="Failed to load movies" />
 * 
 * // With Error object
 * <ErrorState error={new Error("Network error")} />
 * 
 * // With APIError
 * <ErrorState error={apiError} />
 * 
 * // With retry button
 * <ErrorState
 *   error="Failed to fetch data"
 *   onRetry={() => refetch()}
 * />
 * 
 * // Custom retry text
 * <ErrorState
 *   error={error}
 *   onRetry={handleRetry}
 *   retryText="Reload"
 * />
 * 
 * // Custom title and icon
 * import { XCircle } from "lucide-react";
 * <ErrorState
 *   error={error}
 *   title="Failed to Load"
 *   icon={XCircle}
 * />
 * 
 * // Different sizes
 * <ErrorState size="sm" error="Error" />
 * <ErrorState size="lg" error="Critical error" />
 * 
 * // Hide error message (show only title)
 * <ErrorState
 *   error={error}
 *   title="Something went wrong"
 *   showErrorMessage={false}
 * />
 * 
 * // Custom styling
 * <ErrorState
 *   error={error}
 *   className="min-h-[400px] bg-destructive/5 rounded-lg"
 * />
 * ```
 */
export function ErrorState({
  error,
  icon: Icon = AlertCircle,
  title = "Something went wrong",
  onRetry,
  retryText = "Try Again",
  showErrorMessage = true,
  size,
  className,
}: ErrorStateProps) {
  const iconSize = iconSizeMap[size || "md"];
  const errorMessage = getErrorMessage(error);

  return (
    <div
      className={cn(errorStateVariants({ size }), className)}
      role="alert"
      aria-live="assertive"
    >
      <Icon
        className="text-destructive"
        size={iconSize}
        aria-hidden="true"
      />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
        
        {showErrorMessage && (
          <p className="text-sm text-muted-foreground max-w-md">
            {errorMessage}
          </p>
        )}
      </div>

      {onRetry && (
        <div className="mt-2">
          <Button
            onClick={onRetry}
            variant="outline"
            size={size === "sm" ? "sm" : "default"}
          >
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
}

ErrorState.displayName = "ErrorState";
