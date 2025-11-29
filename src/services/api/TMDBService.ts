/**
 * TMDB Service
 * 
 * Service layer for interacting with The Movie Database (TMDB) API.
 * Handles all API communication, rate limiting, caching, and error handling.
 * Returns domain models instead of raw API responses.
 */

import { tmdbRateLimiter } from '@/lib/apiRateLimiter';
import { APIError, APIErrorCode } from '@/utils/errors/APIError';
import { TMDBTransformer } from '@/services/transformers/TMDBTransformer';
import type {
  TMDBMovieSearchResponse,
  TMDBTVShowSearchResponse,
  TMDBMultiSearchResponse,
  TMDBMovieDetailsResponse,
  TMDBTVShowDetailsResponse,
  TMDBSeasonDetailsResponse,
} from '@/types/api/tmdb';
import type { Movie, TVShow, MediaItem } from '@/types/domain/media';
import type { Season, Episode } from '@/types/domain/season';

/**
 * Image size options for TMDB images
 */
export type TMDBImageSize = 'w200' | 'w500' | 'original';

/**
 * Time window options for trending endpoints
 */
export type TMDBTimeWindow = 'day' | 'week';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * TMDB Service configuration
 */
interface TMDBServiceConfig {
  apiKey: string;
  baseUrl: string;
  imageBaseUrl: string;
  language: string;
  cacheTTL: number;
}

/**
 * Service class for TMDB API interactions
 */
export class TMDBService {
  private readonly config: TMDBServiceConfig;

  /**
   * Create a new TMDB service instance
   * 
   * @param apiKey - TMDB API key (defaults to environment variable)
   */
  constructor(apiKey?: string) {
    const envApiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    if (!apiKey && !envApiKey) {
      throw new Error('TMDB API key is required. Set VITE_TMDB_API_KEY environment variable.');
    }

    this.config = {
      apiKey: apiKey || envApiKey,
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
      language: 'pl-PL',
      cacheTTL: 60 * 60 * 1000, // 1 hour in milliseconds
    };
  }

  /**
   * Make a typed fetch request to the TMDB API
   * 
   * @template T - Expected response type
   * @param endpoint - API endpoint (e.g., '/movie/popular')
   * @param params - Query parameters
   * @returns Promise resolving to typed response
   * @throws {APIError} If request fails or rate limit is exceeded
   */
  private async fetch<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    // Check rate limit before making request
    if (!tmdbRateLimiter.canMakeRequest()) {
      const timeUntilReset = tmdbRateLimiter.getTimeUntilReset();
      throw APIError.rateLimitExceeded(timeUntilReset);
    }

    // Build URL with query parameters
    const url = new URL(`${this.config.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.config.apiKey);
    url.searchParams.append('language', this.config.language);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Record the request for rate limiting
    tmdbRateLimiter.recordRequest();

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw APIError.fromStatusCode(
          response.status,
          `TMDB API error: ${response.statusText}`
        );
      }

      const data = await response.json() as T;
      return data;
    } catch (error) {
      // Re-throw APIErrors as-is
      if (APIError.isAPIError(error)) {
        throw error;
      }

      // Wrap other errors as network errors
      if (error instanceof Error) {
        throw APIError.networkError(error);
      }

      // Unknown error type
      throw new APIError(
        'An unexpected error occurred',
        null,
        APIErrorCode.UNKNOWN_ERROR,
        { originalError: String(error) }
      );
    }
  }

  /**
   * Get full URL for a TMDB image
   * 
   * @param path - Relative image path from TMDB
   * @param size - Image size (default: 'w500')
   * @returns Full image URL or placeholder if path is null
   */
  getImageUrl(
    path: string | null,
    size: TMDBImageSize = 'w500'
  ): string {
    if (!path) {
      return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop';
    }
    return `${this.config.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Search for movies
   * 
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @returns Promise resolving to array of Movie domain models
   * @throws {APIError} If request fails
   */
  async searchMovies(query: string, page: number = 1): Promise<{
    results: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    if (!query.trim()) {
      throw new APIError(
        'Search query cannot be empty',
        400,
        APIErrorCode.BAD_REQUEST
      );
    }

    const response = await this.fetch<TMDBMovieSearchResponse>('/search/movie', {
      query: query.trim(),
      page: page.toString(),
    });

    return {
      results: TMDBTransformer.toMovies(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Search for TV shows
   * 
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @returns Promise resolving to array of TVShow domain models
   * @throws {APIError} If request fails
   */
  async searchTVShows(query: string, page: number = 1): Promise<{
    results: TVShow[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    if (!query.trim()) {
      throw new APIError(
        'Search query cannot be empty',
        400,
        APIErrorCode.BAD_REQUEST
      );
    }

    const response = await this.fetch<TMDBTVShowSearchResponse>('/search/tv', {
      query: query.trim(),
      page: page.toString(),
    });

    return {
      results: TMDBTransformer.toTVShows(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Search for movies and TV shows (multi-search)
   * 
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @returns Promise resolving to array of MediaItem domain models
   * @throws {APIError} If request fails
   */
  async searchMulti(query: string, page: number = 1): Promise<{
    results: MediaItem[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    if (!query.trim()) {
      throw new APIError(
        'Search query cannot be empty',
        400,
        APIErrorCode.BAD_REQUEST
      );
    }

    const response = await this.fetch<TMDBMultiSearchResponse>('/search/multi', {
      query: query.trim(),
      page: page.toString(),
    });

    // Filter out person results and transform to MediaItems
    const mediaResults: MediaItem[] = [];
    
    for (const result of response.results) {
      if (result.media_type === 'movie') {
        mediaResults.push(TMDBTransformer.toMediaItem(result, 'movie'));
      } else if (result.media_type === 'tv') {
        mediaResults.push(TMDBTransformer.toMediaItem(result, 'tv'));
      }
      // Skip person results
    }

    return {
      results: mediaResults,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Get detailed information about a movie
   * 
   * @param id - TMDB movie ID
   * @returns Promise resolving to Movie domain model with full details
   * @throws {APIError} If request fails
   */
  async getMovieDetails(id: number): Promise<Movie> {
    if (id <= 0) {
      throw new APIError(
        'Invalid movie ID',
        400,
        APIErrorCode.BAD_REQUEST,
        { id }
      );
    }

    const response = await this.fetch<TMDBMovieDetailsResponse>(`/movie/${id}`);
    return TMDBTransformer.toMovie(response);
  }

  /**
   * Get detailed information about a TV show
   * 
   * @param id - TMDB TV show ID
   * @returns Promise resolving to TVShow domain model with full details
   * @throws {APIError} If request fails
   */
  async getTVShowDetails(id: number): Promise<TVShow> {
    if (id <= 0) {
      throw new APIError(
        'Invalid TV show ID',
        400,
        APIErrorCode.BAD_REQUEST,
        { id }
      );
    }

    const response = await this.fetch<TMDBTVShowDetailsResponse>(`/tv/${id}`);
    return TMDBTransformer.toTVShow(response);
  }

  /**
   * Get detailed information about a TV show season
   * 
   * @param tvId - TMDB TV show ID
   * @param seasonNumber - Season number
   * @returns Promise resolving to Season with episodes
   * @throws {APIError} If request fails
   */
  async getSeasonDetails(tvId: number, seasonNumber: number): Promise<{
    season: Season;
    episodes: Episode[];
  }> {
    if (tvId <= 0 || seasonNumber < 0) {
      throw new APIError(
        'Invalid TV show ID or season number',
        400,
        APIErrorCode.BAD_REQUEST,
        { tvId, seasonNumber }
      );
    }

    const response = await this.fetch<TMDBSeasonDetailsResponse>(
      `/tv/${tvId}/season/${seasonNumber}`
    );

    return {
      season: TMDBTransformer.toSeason(response),
      episodes: TMDBTransformer.toEpisodes(response.episodes),
    };
  }

  /**
   * Get popular movies with caching
   * 
   * @param page - Page number (default: 1)
   * @returns Promise resolving to array of Movie domain models
   * @throws {APIError} If request fails
   */
  async getPopularMovies(page: number = 1): Promise<{
    results: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const cacheKey = `tmdb_popular_movies_${page}`;
    const cached = this.getFromCache<TMDBMovieSearchResponse>(cacheKey);
    
    if (cached) {
      return {
        results: TMDBTransformer.toMovies(cached.results),
        page: cached.page,
        totalPages: cached.total_pages,
        totalResults: cached.total_results,
      };
    }

    const response = await this.fetch<TMDBMovieSearchResponse>('/movie/popular', {
      page: page.toString(),
    });

    this.saveToCache(cacheKey, response);

    return {
      results: TMDBTransformer.toMovies(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Get popular TV shows with caching
   * 
   * @param page - Page number (default: 1)
   * @returns Promise resolving to array of TVShow domain models
   * @throws {APIError} If request fails
   */
  async getPopularTVShows(page: number = 1): Promise<{
    results: TVShow[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const cacheKey = `tmdb_popular_tv_${page}`;
    const cached = this.getFromCache<TMDBTVShowSearchResponse>(cacheKey);
    
    if (cached) {
      return {
        results: TMDBTransformer.toTVShows(cached.results),
        page: cached.page,
        totalPages: cached.total_pages,
        totalResults: cached.total_results,
      };
    }

    const response = await this.fetch<TMDBTVShowSearchResponse>('/tv/popular', {
      page: page.toString(),
    });

    this.saveToCache(cacheKey, response);

    return {
      results: TMDBTransformer.toTVShows(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Get trending movies with caching
   * 
   * @param timeWindow - Time window for trending ('day' or 'week')
   * @returns Promise resolving to array of Movie domain models
   * @throws {APIError} If request fails
   */
  async getTrendingMovies(timeWindow: TMDBTimeWindow = 'week'): Promise<{
    results: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const cacheKey = `tmdb_trending_movies_${timeWindow}`;
    const cached = this.getFromCache<TMDBMovieSearchResponse>(cacheKey);
    
    if (cached) {
      return {
        results: TMDBTransformer.toMovies(cached.results),
        page: cached.page,
        totalPages: cached.total_pages,
        totalResults: cached.total_results,
      };
    }

    const response = await this.fetch<TMDBMovieSearchResponse>(
      `/trending/movie/${timeWindow}`
    );

    this.saveToCache(cacheKey, response);

    return {
      results: TMDBTransformer.toMovies(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Get trending TV shows with caching
   * 
   * @param timeWindow - Time window for trending ('day' or 'week')
   * @returns Promise resolving to array of TVShow domain models
   * @throws {APIError} If request fails
   */
  async getTrendingTVShows(timeWindow: TMDBTimeWindow = 'week'): Promise<{
    results: TVShow[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const cacheKey = `tmdb_trending_tv_${timeWindow}`;
    const cached = this.getFromCache<TMDBTVShowSearchResponse>(cacheKey);
    
    if (cached) {
      return {
        results: TMDBTransformer.toTVShows(cached.results),
        page: cached.page,
        totalPages: cached.total_pages,
        totalResults: cached.total_results,
      };
    }

    const response = await this.fetch<TMDBTVShowSearchResponse>(
      `/trending/tv/${timeWindow}`
    );

    this.saveToCache(cacheKey, response);

    return {
      results: TMDBTransformer.toTVShows(response.results),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * Get data from localStorage cache
   * 
   * @template T - Type of cached data
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  private getFromCache<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - entry.timestamp < this.config.cacheTTL) {
        return entry.data;
      }

      // Cache expired, remove it
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      // If there's any error reading from cache, just return null
      console.warn('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Save data to localStorage cache
   * 
   * @template T - Type of data to cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private saveToCache<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      // If there's any error saving to cache, just log it and continue
      console.warn('Error saving to cache:', error);
    }
  }

  /**
   * Clear all TMDB cache entries from localStorage
   */
  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith('tmdb_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }
}

/**
 * Singleton instance of TMDBService
 * Use this for all TMDB API interactions
 */
export const tmdbService = new TMDBService();
