/**
 * Season and Episode domain types for TV shows
 */

/**
 * Season information for a TV show
 */
export interface Season {
  /** Unique identifier from TMDB */
  id: number;
  /** Season number (1-indexed) */
  seasonNumber: number;
  /** Season name/title */
  name: string;
  /** Number of episodes in this season */
  episodeCount: number;
  /** First air date in ISO format (YYYY-MM-DD) */
  airDate: string | null;
  /** Season overview/description */
  overview: string;
  /** Relative path to season poster image */
  posterPath: string | null;
}

/**
 * Episode information for a TV show season
 */
export interface Episode {
  /** Unique identifier from TMDB */
  id: number;
  /** Episode number within the season (1-indexed) */
  episodeNumber: number;
  /** Season number this episode belongs to */
  seasonNumber: number;
  /** Episode name/title */
  name: string;
  /** Episode overview/description */
  overview: string;
  /** Air date in ISO format (YYYY-MM-DD) */
  airDate: string | null;
  /** Relative path to episode still/screenshot image */
  stillPath: string | null;
  /** Average user rating for this episode (0-10) */
  voteAverage: number;
}
