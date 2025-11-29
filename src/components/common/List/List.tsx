import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ListProps } from './List.types';

/**
 * Generic List component that renders a list of items with infinite scroll support
 * @template T - The type of items in the list
 */
export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyState,
  loadingState,
  isLoading = false,
  onEndReached,
  onEndReachedThreshold = 200,
  virtualized = false, // Reserved for future implementation
  className,
}: ListProps<T>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasCalledOnEndReached = useRef(false);

  // Note: virtualized prop is reserved for future implementation with @tanstack/react-virtual
  // Currently, all lists use standard rendering
  void virtualized;

  // Handle infinite scroll with Intersection Observer
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && onEndReached && !isLoading && !hasCalledOnEndReached.current) {
        hasCalledOnEndReached.current = true;
        onEndReached();
        
        // Reset flag after a delay to allow for new data to load
        setTimeout(() => {
          hasCalledOnEndReached.current = false;
        }, 1000);
      }
    },
    [onEndReached, isLoading]
  );

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!onEndReached || !sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${onEndReachedThreshold}px`,
      threshold: 0.1,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, onEndReached, onEndReachedThreshold]);

  // Show loading state
  if (isLoading && items.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {loadingState || (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  // Show empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {emptyState || (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">No items to display</div>
          </div>
        )}
      </div>
    );
  }

  // Render list items
  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      {onEndReached && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      )}

      {/* Loading indicator for pagination */}
      {isLoading && items.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-muted-foreground">Loading more...</div>
        </div>
      )}
    </div>
  );
}
