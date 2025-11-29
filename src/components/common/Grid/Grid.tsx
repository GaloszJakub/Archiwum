/**
 * Generic Grid Component
 * 
 * A reusable grid layout component that works with any data type using TypeScript generics.
 * Supports responsive column configuration, loading states, and empty states.
 * 
 * @example
 * ```tsx
 * <Grid
 *   items={movies}
 *   renderItem={(movie) => <MovieCard movie={movie} />}
 *   keyExtractor={(movie) => movie.id}
 *   columns={{ default: 2, md: 4, lg: 6 }}
 *   gap={4}
 * />
 * ```
 */

import { cn } from '@/lib/utils';
import type { GridProps } from './Grid.types';

/**
 * Generates Tailwind CSS grid column classes based on column configuration
 */
function getGridColumnsClass(columns: GridProps<unknown>['columns']): string {
  if (!columns) {
    return 'grid-cols-1';
  }

  const classes: string[] = [];
  
  // Default (mobile-first)
  classes.push(`grid-cols-${columns.default}`);
  
  // Responsive breakpoints
  if (columns.sm !== undefined) {
    classes.push(`sm:grid-cols-${columns.sm}`);
  }
  if (columns.md !== undefined) {
    classes.push(`md:grid-cols-${columns.md}`);
  }
  if (columns.lg !== undefined) {
    classes.push(`lg:grid-cols-${columns.lg}`);
  }
  if (columns.xl !== undefined) {
    classes.push(`xl:grid-cols-${columns.xl}`);
  }
  if (columns['2xl'] !== undefined) {
    classes.push(`2xl:grid-cols-${columns['2xl']}`);
  }
  
  return classes.join(' ');
}

/**
 * Generic Grid component for displaying items in a responsive grid layout
 * 
 * @template T - The type of items in the grid
 */
export function Grid<T>({
  items,
  renderItem,
  keyExtractor,
  columns = { default: 1 },
  gap = 4,
  emptyState,
  loadingState,
  isLoading = false,
  className,
}: GridProps<T>) {
  // Show loading state
  if (isLoading && loadingState) {
    return <>{loadingState}</>;
  }

  // Show empty state
  if (!isLoading && items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  // Generate grid classes
  const gridColumnsClass = getGridColumnsClass(columns);
  const gapClass = `gap-${gap}`;

  return (
    <div
      className={cn(
        'grid',
        gridColumnsClass,
        gapClass,
        className
      )}
    >
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
