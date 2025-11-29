import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type CardProps } from "./Card.types";

/**
 * Card component variants using CVA (Class Variance Authority).
 * Defines different visual styles for the card component.
 */
export const cardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      /**
       * Visual style variants for the card
       */
      variant: {
        default: "border-border shadow-sm",
        elevated: "border-border shadow-md",
        outlined: "border-2 border-border shadow-none",
        ghost: "border-transparent shadow-none",
      },
      /**
       * Padding size variants
       */
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

/**
 * Generic Card component that can display any type of data.
 * 
 * Features:
 * - TypeScript generics for type-safe data handling
 * - Customizable content and actions via render props
 * - Optional hover and 3D tilt effects
 * - Framer Motion animation support
 * - CVA-based variant styling
 * - Tailwind CSS styling with className composition
 * 
 * @template T - The type of data the card will display
 * 
 * @example
 * ```tsx
 * interface Movie {
 *   id: number;
 *   title: string;
 *   year: number;
 * }
 * 
 * <Card<Movie>
 *   data={movie}
 *   variant="elevated"
 *   padding="lg"
 *   enableHoverEffect
 *   renderContent={(movie) => (
 *     <div>
 *       <h3>{movie.title}</h3>
 *       <p>{movie.year}</p>
 *     </div>
 *   )}
 *   renderActions={(movie) => (
 *     <button>View Details</button>
 *   )}
 *   onClick={(movie) => navigate(`/movie/${movie.id}`)}
 * />
 * ```
 */
export function Card<T>({
  data,
  renderContent,
  renderActions,
  onClick,
  className,
  layoutId,
  enableHoverEffect = false,
  enable3DEffect = false,
  variant,
  padding,
}: CardProps<T>) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Motion values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animation for smooth 3D effect
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  /**
   * Handle mouse move for 3D tilt effect
   */
  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enable3DEffect || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      const normalizedX = mouseX / (rect.width / 2);
      const normalizedY = mouseY / (rect.height / 2);

      x.set(normalizedX);
      y.set(normalizedY);
    },
    [enable3DEffect, x, y]
  );

  /**
   * Reset 3D effect on mouse leave
   */
  const handleMouseLeave = React.useCallback(() => {
    if (!enable3DEffect) return;
    x.set(0);
    y.set(0);
  }, [enable3DEffect, x, y]);

  /**
   * Handle card click
   */
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(data);
    }
  }, [onClick, data]);

  // Determine if card should be interactive
  const isInteractive = Boolean(onClick);

  // Base motion props
  const motionProps = {
    ref: cardRef,
    layoutId,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: enable3DEffect
      ? {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d" as const,
        }
      : undefined,
    whileHover:
      enableHoverEffect
        ? {
            scale: 1.03,
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
          }
        : undefined,
    whileTap: isInteractive ? { scale: 0.98 } : undefined,
    transition: { duration: 0.2 },
  };

  return (
    <motion.div
      {...motionProps}
      className={cn(
        cardVariants({ variant, padding }),
        isInteractive && "cursor-pointer",
        className
      )}
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      {/* Card Content */}
      <div className="relative z-10">{renderContent(data)}</div>

      {/* Card Actions */}
      {renderActions && (
        <div className="relative z-10 mt-4 flex items-center justify-end gap-2">
          {renderActions(data)}
        </div>
      )}
    </motion.div>
  );
}

Card.displayName = "Card";
