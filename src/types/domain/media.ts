/**
 * Core media domain types for movies and TV shows
 */

/**
 * Base interface for all media items (movies and TV shows)
 */
export interface MediaItem {
  /** Unique identifier from TMDB */
  id: number;
  /** Title of the media item */
  title: string;
  /** Type discriminator for movies vs TV shows */
  type: 'movie' | 'tv';
  /** Relative path to poster image */
  posterPath: string | null;
  /** Relative path to backdrop image */
  backdropPath: string | null;
  /** Plot overview/description */
  overview: string;
  /** Release date in ISO format (YYYY-MM-DD) */
  releaseDate: string | null;
  /** Average user rating (0-10) */
  voteAverage: number;
  /** Number of votes received */
  voteCount: number;
  /** Popularity score */
  popularity: number;
}

/**
 * Movie-specific domain model
 */
export interface Movie extends MediaItem {
  type: 'movie';
  /** Runtime in minutes */
  runtime: number | null;
  /** Production budget in USD */
  budget: number | null;
  /** Box office revenue in USD */
  revenue: number | null;
  /** Tagline */
  tagline?: string;
  /** Current status (e.g., "Released", "Post Production") */
  status?: string;
  /** Array of genres */
  genres?: Array<{ id: number; name: string }>;
  /** Spoken languages */
  spokenLanguages?: Array<{ iso_639_1: string; name: string }>;
  /** Production companies */
  productionCompanies?: Array<{ id: number; name: string; logo_path: string | null }>;
}

/**
 * TV Show-specific domain model
 */
export interface TVShow extends MediaItem {
  type: 'tv';
  /** Total number of seasons */
  numberOfSeasons: number;
  /** Total number of episodes across all seasons */
  numberOfEpisodes: number;
  /** Array of season information */
  seasons: Array<{
    id: number;
    seasonNumber: number;
    name: string;
    episodeCount: number;
    airDate: string | null;
    overview: string;
    posterPath: string | null;
  }>;
  /** Typical episode runtime in minutes (can vary) */
  episodeRunTime: number[];
  /** Tagline */
  tagline?: string;
  /** Current status (e.g., "Returning Series", "Ended") */
  status?: string;
  /** Array of genres */
  genres?: Array<{ id: number; name: string }>;
  /** Spoken languages */
  spokenLanguages?: Array<{ iso_639_1: string; name: string }>;
  /** Production companies */
  productionCompanies?: Array<{ id: number; name: string; logo_path: string | null }>;
}
