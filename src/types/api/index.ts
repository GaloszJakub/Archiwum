/**
 * API types barrel export
 * Centralizes all API-related type exports for easier imports
 */

// Common API types
export type {
  PaginatedResponse,
  APIErrorResponse,
  APISuccessResponse,
  APIResponse,
} from './common';

// TMDB API types
export type {
  TMDBMovieResponse,
  TMDBTVShowResponse,
  TMDBMultiSearchResult,
  TMDBPersonResponse,
  TMDBGenre,
  TMDBProductionCompany,
  TMDBSpokenLanguage,
  TMDBProductionCountry,
  TMDBMovieDetailsResponse,
  TMDBCollection,
  TMDBCreatedBy,
  TMDBNetwork,
  TMDBSeason,
  TMDBEpisode,
  TMDBTVShowDetailsResponse,
  TMDBSeasonDetailsResponse,
  TMDBMovieSearchResponse,
  TMDBTVShowSearchResponse,
  TMDBMultiSearchResponse,
  TMDBConfigurationResponse,
} from './tmdb';
