import { type VariantProps } from "class-variance-authority";
import { type loadingStateVariants } from "./LoadingState";

/**
 * Props for the LoadingState component
 */
export interface LoadingStateProps extends VariantProps<typeof loadingStateVariants> {
  /**
   * Optional message to display below the spinner
   * @example "Loading movies..."
   */
  message?: string;

  /**
   * Additional CSS classes to apply to the container
   * @example "min-h-screen"
   */
  className?: string;
}
