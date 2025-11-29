/**
 * Collection domain types for user-created media collections
 */

/**
 * User-created collection of movies and TV shows
 */
export interface Collection {
  /** Unique identifier for the collection */
  id: string;
  /** Collection name */
  name: string;
  /** Collection description */
  description: string;
  /** User ID who owns this collection */
  userId: string;
  /** Array of media items in this collection */
  items: CollectionItem[];
  /** Timestamp when collection was created */
  createdAt: Date;
  /** Timestamp when collection was last updated */
  updatedAt: Date;
}

/**
 * Individual item within a collection
 */
export interface CollectionItem {
  /** TMDB ID of the media item */
  tmdbId: number;
  /** Type of media (movie or TV show) */
  type: 'movie' | 'tv';
  /** Timestamp when item was added to collection */
  addedAt: Date;
}
