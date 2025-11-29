/**
 * Props for the generic List component
 * @template T - The type of items in the list
 */
export interface ListProps<T> {
  /**
   * Array of items to render in the list
   */
  items: T[];

  /**
   * Function to render each item in the list
   * @param item - The item to render
   * @param index - The index of the item in the array
   * @returns React node to render
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Function to extract a unique key for each item
   * @param item - The item to extract key from
   * @param index - The index of the item in the array
   * @returns Unique key for the item
   */
  keyExtractor: (item: T, index: number) => string | number;

  /**
   * Content to display when the list is empty
   */
  emptyState?: React.ReactNode;

  /**
   * Content to display when the list is loading
   */
  loadingState?: React.ReactNode;

  /**
   * Whether the list is currently loading
   * @default false
   */
  isLoading?: boolean;

  /**
   * Callback fired when the user scrolls near the end of the list
   * Used for implementing infinite scroll/pagination
   */
  onEndReached?: () => void;

  /**
   * Threshold (in pixels) from the bottom to trigger onEndReached
   * @default 200
   */
  onEndReachedThreshold?: number;

  /**
   * Whether to use virtualization for large lists
   * @default false
   */
  virtualized?: boolean;

  /**
   * Additional CSS classes to apply to the list container
   */
  className?: string;
}
