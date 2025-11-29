/**
 * TMDB API response type definitions
 * These types represent the raw API responses from The Movie Database API
 * and should be transformed into domain models before use in the application.
 */

import type { PaginatedResponse } from './common';

/**
 * Base TMDB media item (common fields for movies and TV shows)
 */
interface TMDBMediaBase {
  /** Unique identifier */
  id: number;
  /** Relative path to poster image */
  poster_path: string | null;
  /** Relative path to backdrop image */
  backdrop_path: string | null;
  /** Plot overview/description */
  overview: string;
  /** Average user rating (0-10) */
  vote_average: number;
  /** Number of votes received */
  vote_count: number;
  /** Popularity score */
  popularity: number;
  /** Array of genre IDs */
  genre_ids: number[];
  /** Original language code (ISO 639-1) */
  original_language: string;
  /** Whether the content is adult-rated */
  adult: boolean;
}

/**
 * TMDB Movie response (from search, popular, trending endpoints)
 */
export interface TMDBMovieResponse extends TMDBMediaBase {
  /** Movie title */
  title: string;
  /** Original title in original language */
  original_title: string;
  /** Release date in ISO format (YYYY-MM-DD) */
  release_date: string;
  /** Whether the movie has video content available */
  video: boolean;
}

/**
 * TMDB TV Show response (from search, popular, trending endpoints)
 */
export interface TMDBTVShowResponse extends TMDBMediaBase {
  /** TV show name */
  name: string;
  /** Original name in original language */
  original_name: string;
  /** First air date in ISO format (YYYY-MM-DD) */
  first_air_date: string;
  /** Array of origin country codes (ISO 3166-1) */
  origin_country: string[];
}

/**
 * TMDB Multi-search result (can be movie, TV show, or person)
 */
export type TMDBMultiSearchResult = 
  | (TMDBMovieResponse & { media_type: 'movie' })
  | (TMDBTVShowResponse & { media_type: 'tv' })
  | (TMDBPersonResponse & { media_type: 'person' });

/**
 * TMDB Person response (from multi-search)
 */
export interface TMDBPersonResponse {
  /** Unique identifier */
  id: number;
  /** Person's name */
  name: string;
  /** Media type discriminator */
  media_type: 'person';
  /** Relative path to profile image */
  profile_path: string | null;
  /** Whether the person is adult content related */
  adult: boolean;
  /** Popularity score */
  popularity: number;
  /** Known for department (e.g., "Acting", "Directing") */
  known_for_department: string;
  /** Array of known works */
  known_for: Array<TMDBMovieResponse | TMDBTVShowResponse>;
}

/**
 * Genre information
 */
export interface TMDBGenre {
  /** Genre ID */
  id: number;
  /** Genre name */
  name: string;
}

/**
 * Production company information
 */
export interface TMDBProductionCompany {
  /** Company ID */
  id: number;
  /** Company name */
  name: string;
  /** Relative path to company logo */
  logo_path: string | null;
  /** Origin country code (ISO 3166-1) */
  origin_country: string;
}

/**
 * Spoken language information
 */
export interface TMDBSpokenLanguage {
  /** Language code (ISO 639-1) */
  iso_639_1: string;
  /** English name of the language */
  english_name: string;
  /** Native name of the language */
  name: string;
}

/**
 * Production country information
 */
export interface TMDBProductionCountry {
  /** Country code (ISO 3166-1) */
  iso_3166_1: string;
  /** Country name */
  name: string;
}

/**
 * Detailed movie response (from movie details endpoint)
 */
export interface TMDBMovieDetailsResponse extends Omit<TMDBMovieResponse, 'genre_ids'> {
  /** Full genre objects instead of IDs */
  genres: TMDBGenre[];
  /** Runtime in minutes */
  runtime: number | null;
  /** Current status (e.g., "Released", "Post Production") */
  status: string;
  /** Movie tagline */
  tagline: string;
  /** Production budget in USD */
  budget: number;
  /** Box office revenue in USD */
  revenue: number;
  /** IMDB ID */
  imdb_id: string | null;
  /** Homepage URL */
  homepage: string | null;
  /** Production companies */
  production_companies: TMDBProductionCompany[];
  /** Production countries */
  production_countries: TMDBProductionCountry[];
  /** Spoken languages */
  spoken_languages: TMDBSpokenLanguage[];
  /** Belongs to collection information */
  belongs_to_collection: TMDBCollection | null;
}

/**
 * Movie collection information
 */
export interface TMDBCollection {
  /** Collection ID */
  id: number;
  /** Collection name */
  name: string;
  /** Relative path to poster image */
  poster_path: string | null;
  /** Relative path to backdrop image */
  backdrop_path: string | null;
}

/**
 * Created by information (for TV shows)
 */
export interface TMDBCreatedBy {
  /** Creator ID */
  id: number;
  /** Credit ID */
  credit_id: string;
  /** Creator name */
  name: string;
  /** Gender (0 = not specified, 1 = female, 2 = male, 3 = non-binary) */
  gender: number;
  /** Relative path to profile image */
  profile_path: string | null;
}

/**
 * Network information (for TV shows)
 */
export interface TMDBNetwork {
  /** Network ID */
  id: number;
  /** Network name */
  name: string;
  /** Relative path to network logo */
  logo_path: string | null;
  /** Origin country code (ISO 3166-1) */
  origin_country: string;
}

/**
 * Season information (basic)
 */
export interface TMDBSeason {
  /** Season ID */
  id: number;
  /** Season name */
  name: string;
  /** Season number (0 for specials) */
  season_number: number;
  /** Number of episodes in the season */
  episode_count: number;
  /** Air date in ISO format (YYYY-MM-DD) */
  air_date: string | null;
  /** Season overview */
  overview: string;
  /** Relative path to poster image */
  poster_path: string | null;
}

/**
 * Episode information (basic)
 */
export interface TMDBEpisode {
  /** Episode ID */
  id: number;
  /** Episode name */
  name: string;
  /** Episode number within the season */
  episode_number: number;
  /** Season number */
  season_number: number;
  /** Air date in ISO format (YYYY-MM-DD) */
  air_date: string | null;
  /** Episode overview */
  overview: string;
  /** Relative path to still image */
  still_path: string | null;
  /** Average user rating (0-10) */
  vote_average: number;
  /** Number of votes received */
  vote_count: number;
  /** Runtime in minutes */
  runtime: number | null;
}

/**
 * Detailed TV show response (from TV details endpoint)
 */
export interface TMDBTVShowDetailsResponse extends Omit<TMDBTVShowResponse, 'genre_ids'> {
  /** Full genre objects instead of IDs */
  genres: TMDBGenre[];
  /** Array of typical episode runtimes in minutes */
  episode_run_time: number[];
  /** Current status (e.g., "Returning Series", "Ended") */
  status: string;
  /** Tagline */
  tagline: string;
  /** Type (e.g., "Scripted", "Reality") */
  type: string;
  /** Total number of seasons */
  number_of_seasons: number;
  /** Total number of episodes */
  number_of_episodes: number;
  /** Array of season information */
  seasons: TMDBSeason[];
  /** Homepage URL */
  homepage: string | null;
  /** Whether the show is currently in production */
  in_production: boolean;
  /** Array of languages (ISO 639-1 codes) */
  languages: string[];
  /** Last air date in ISO format (YYYY-MM-DD) */
  last_air_date: string | null;
  /** Information about the last episode to air */
  last_episode_to_air: TMDBEpisode | null;
  /** Information about the next episode to air */
  next_episode_to_air: TMDBEpisode | null;
  /** Array of networks that air the show */
  networks: TMDBNetwork[];
  /** Production companies */
  production_companies: TMDBProductionCompany[];
  /** Production countries */
  production_countries: TMDBProductionCountry[];
  /** Spoken languages */
  spoken_languages: TMDBSpokenLanguage[];
  /** Array of creators */
  created_by: TMDBCreatedBy[];
}

/**
 * Detailed season response (from season details endpoint)
 */
export interface TMDBSeasonDetailsResponse extends TMDBSeason {
  /** Full array of episodes in the season */
  episodes: TMDBEpisode[];
  /** Season credits */
  _id: string;
}

/**
 * Paginated movie search response
 */
export type TMDBMovieSearchResponse = PaginatedResponse<TMDBMovieResponse>;

/**
 * Paginated TV show search response
 */
export type TMDBTVShowSearchResponse = PaginatedResponse<TMDBTVShowResponse>;

/**
 * Paginated multi-search response
 */
export type TMDBMultiSearchResponse = PaginatedResponse<TMDBMultiSearchResult>;

/**
 * Configuration response for TMDB API
 */
export interface TMDBConfigurationResponse {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}
