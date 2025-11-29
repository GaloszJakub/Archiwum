import { type LucideIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { emptyStateVariants } from "./EmptyState";

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  /**
   * Icon to display (Lucide icon component)
   * @example
   * ```tsx
   * import { Inbox } from "lucide-react";
   * <EmptyState icon={Inbox} />
   * ```
   */
  icon?: LucideIcon;

  /**
   * Title text to display
   */
  title: string;

  /**
   * Optional description text to provide more context
   */
  description?: string;

  /**
   * Optional action element (typically a button)
   * @example
   * ```tsx
   * <EmptyState
   *   title="No movies found"
   *   action={<Button onClick={handleAdd}>Add Movie</Button>}
   * />
   * ```
   */
  action?: React.ReactNode;

  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
}
