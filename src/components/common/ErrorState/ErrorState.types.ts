import { type LucideIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { errorStateVariants } from "./ErrorState";

/**
 * Props for the ErrorState component
 */
export interface ErrorStateProps extends VariantProps<typeof errorStateVariants> {
  /**
   * Error object or error message to display
   * Can be an Error instance, APIError, or a string message
   * @example
   * ```tsx
   * <ErrorState error={new Error("Something went wrong")} />
   * <ErrorState error="Failed to load data" />
   * ```
   */
  error: Error | string;

  /**
   * Optional custom icon (Lucide icon component)
   * Defaults to AlertCircle
   * @example
   * ```tsx
   * import { XCircle } from "lucide-react";
   * <ErrorState error={error} icon={XCircle} />
   * ```
   */
  icon?: LucideIcon;

  /**
   * Optional custom title
   * If not provided, defaults to "Something went wrong"
   */
  title?: string;

  /**
   * Optional retry callback
   * When provided, displays a retry button
   * @example
   * ```tsx
   * <ErrorState
   *   error={error}
   *   onRetry={() => refetch()}
   * />
   * ```
   */
  onRetry?: () => void;

  /**
   * Optional text for the retry button
   * Defaults to "Try Again"
   */
  retryText?: string;

  /**
   * Whether to show the full error message
   * Defaults to true
   */
  showErrorMessage?: boolean;

  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
}
