import { type VariantProps } from "class-variance-authority";
import { cardVariants } from "./Card";

/**
 * Props for the generic Card component.
 * 
 * @template T - The type of data the card will display
 * 
 * @example
 * ```tsx
 * interface Movie {
 *   id: number;
 *   title: string;
 *   posterUrl: string;
 * }
 * 
 * <Card<Movie>
 *   data={movie}
 *   renderContent={(movie) => <div>{movie.title}</div>}
 *   onClick={(movie) => console.log(movie.id)}
 * />
 * ```
 */
export interface CardProps<T> extends VariantProps<typeof cardVariants> {
  /**
   * The data object to be displayed in the card.
   * This will be passed to renderContent and renderActions functions.
   */
  data: T;

  /**
   * Function to render the main content of the card.
   * Receives the data object as a parameter.
   * 
   * @param data - The data object passed to the card
   * @returns React node to render as card content
   */
  renderContent: (data: T) => React.ReactNode;

  /**
   * Optional function to render action buttons or interactive elements.
   * Receives the data object as a parameter.
   * 
   * @param data - The data object passed to the card
   * @returns React node to render as card actions
   */
  renderActions?: (data: T) => React.ReactNode;

  /**
   * Optional click handler for the entire card.
   * Receives the data object as a parameter.
   * 
   * @param data - The data object passed to the card
   */
  onClick?: (data: T) => void;

  /**
   * Optional additional CSS classes to apply to the card.
   * Will be merged with variant classes using the cn() utility.
   */
  className?: string;

  /**
   * Optional layout ID for Framer Motion animations.
   * Used for shared layout animations between components.
   * 
   * @see https://www.framer.com/motion/layout-animations/
   */
  layoutId?: string;

  /**
   * Enable hover effect on the card.
   * When true, applies scale and shadow effects on hover.
   * 
   * @default false
   */
  enableHoverEffect?: boolean;

  /**
   * Enable 3D tilt effect on the card.
   * When true, applies a 3D perspective transform based on mouse position.
   * 
   * @default false
   */
  enable3DEffect?: boolean;
}
