import { tmdbRateLimiter } from './apiRateLimiter';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
  id: number;
  title?: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string; // For TV shows
  vote_average: number;
  overview: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  overview: string;
  still_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  overview: string;
  poster_path: string | null;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface DetailedMovie extends Movie {
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[]; // For TV shows
  status: string;
  tagline: string;
  budget?: number;
  revenue?: number;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  vote_count: number;
  popularity: number;
  // TV Show specific fields
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

class TMDBService {
  private apiKey: string;
  private baseUrl: string;
  private imageBaseUrl: string;

  constructor() {
    this.apiKey = TMDB_API_KEY || '';
    this.baseUrl = TMDB_BASE_URL;
    this.imageBaseUrl = TMDB_IMAGE_BASE_URL;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // Check rate limit before making request
    if (!tmdbRateLimiter.canMakeRequest()) {
      const timeUntilReset = Math.ceil(tmdbRateLimiter.getTimeUntilReset() / 1000);
      throw new Error(`Rate limit exceeded. Please wait ${timeUntilReset} seconds.`);
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', 'pl-PL');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Record the request
    tmdbRateLimiter.recordRequest();

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  getImageUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetch<SearchResponse>('/search/movie', {
      query,
      page: page.toString(),
    });
  }

  async searchTVShows(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetch<SearchResponse>('/search/tv', {
      query,
      page: page.toString(),
    });
  }

  async searchMulti(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetch<SearchResponse>('/search/multi', {
      query,
      page: page.toString(),
    });
  }

  async getMovieDetails(id: number): Promise<DetailedMovie> {
    return this.fetch<DetailedMovie>(`/movie/${id}`);
  }

  async getTVShowDetails(id: number): Promise<DetailedMovie> {
    return this.fetch<DetailedMovie>(`/tv/${id}`);
  }

  async getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
    return this.fetch<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
  }

  async getPopularMovies(page: number = 1): Promise<SearchResponse> {
    const cacheKey = `tmdb_popular_movies_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetch<SearchResponse>('/movie/popular', {
      page: page.toString(),
    });

    this.saveToCache(cacheKey, data, 60 * 60 * 1000); // 1 hour
    return data;
  }

  async getPopularTVShows(page: number = 1): Promise<SearchResponse> {
    const cacheKey = `tmdb_popular_tv_${page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetch<SearchResponse>('/tv/popular', {
      page: page.toString(),
    });

    this.saveToCache(cacheKey, data, 60 * 60 * 1000); // 1 hour
    return data;
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<SearchResponse> {
    const cacheKey = `tmdb_trending_movies_${timeWindow}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetch<SearchResponse>(`/trending/movie/${timeWindow}`);
    this.saveToCache(cacheKey, data, 60 * 60 * 1000);
    return data;
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<SearchResponse> {
    const cacheKey = `tmdb_trending_tv_${timeWindow}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetch<SearchResponse>(`/trending/tv/${timeWindow}`);
    this.saveToCache(cacheKey, data, 60 * 60 * 1000);
    return data;
  }

  async discoverMovies(params: {
    page?: number;
    with_genres?: string;
    sort_by?: string;
    year?: number;
  }): Promise<SearchResponse> {
    const queryParams: Record<string, string> = {
      page: (params.page || 1).toString(),
    };

    if (params.with_genres) queryParams.with_genres = params.with_genres;
    if (params.sort_by) queryParams.sort_by = params.sort_by;
    if (params.year) queryParams.primary_release_year = params.year.toString();

    return this.fetch<SearchResponse>('/discover/movie', queryParams);
  }

  async discoverTVShows(params: {
    page?: number;
    with_genres?: string;
    sort_by?: string;
  }): Promise<SearchResponse> {
    const queryParams: Record<string, string> = {
      page: (params.page || 1).toString(),
    };

    if (params.with_genres) queryParams.with_genres = params.with_genres;
    if (params.sort_by) queryParams.sort_by = params.sort_by;

    return this.fetch<SearchResponse>('/discover/tv', queryParams);
  }

  async getMovieGenres(): Promise<{ genres: Array<{ id: number; name: string }> }> {
    return this.fetch('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Array<{ id: number; name: string }> }> {
    return this.fetch('/genre/tv/list');
  }

  // Cache helpers using localStorage
  private getFromCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < 60 * 60 * 1000) { // 1 hour
        return data;
      }
      
      // Cache expired
      localStorage.removeItem(key);
      return null;
    } catch {
      return null;
    }
  }

  private saveToCache(key: string, data: any, ttl: number): void {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
}

export const tmdbService = new TMDBService();
