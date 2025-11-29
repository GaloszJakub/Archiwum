/**
 * Genre domain types for media categorization
 */

/**
 * Genre/category for movies and TV shows
 */
export interface Genre {
  /** Unique identifier from TMDB */
  id: number;
  /** Genre name (e.g., "Action", "Comedy", "Drama") */
  name: string;
}
