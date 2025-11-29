/**
 * Grid Component Type Definitions
 * 
 * Defines TypeScript interfaces for the generic Grid component.
 */

import { ReactNode } from 'react';

/**
 * Column configuration for responsive grid layouts
 */
export interface GridColumns {
  /** Default number of columns (mobile-first) */
  default: number;
  /** Columns for small screens (640px+) */
  sm?: number;
  /** Columns for medium screens (768px+) */
  md?: number;
  /** Columns for large screens (1024px+) */
  lg?: number;
  /** Columns for extra large screens (1280px+) */
  xl?: number;
  /** Columns for 2xl screens (1536px+) */
  '2xl'?: number;
}

/**
 * Props for the generic Grid component
 * 
 * @template T - The type of items in the grid
 */
export interface GridProps<T> {
  /** Array of items to render in the grid */
  items: T[];
  
  /**
   * Function to render each item
   * @param item - The item to render
   * @param index - The index of the item in the array
   * @returns React node to render
   */
  renderItem: (item: T, index: number) => ReactNode;
  
  /**
   * Function to extract a unique key for each item
   * @param item - The item to extract key from
   * @param index - The index of the item in the array
   * @returns Unique key for the item
   */
  keyExtractor: (item: T, index: number) => string | number;
  
  /**
   * Responsive column configuration
   * @default { default: 1 }
   */
  columns?: GridColumns;
  
  /**
   * Gap between grid items (in Tailwind spacing units)
   * @default 4
   */
  gap?: number;
  
  /**
   * Content to display when items array is empty
   */
  emptyState?: ReactNode;
  
  /**
   * Content to display while loading
   */
  loadingState?: ReactNode;
  
  /**
   * Whether the grid is currently loading
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Additional CSS classes to apply to the grid container
   */
  className?: string;
}
