/**
 * TMDBTransformer Service
 * 
 * Transforms TMDB API responses into application domain models.
 * This service ensures a clean separation between external API data structures
 * and internal domain models, making the application resilient to API changes.
 */

import type {
  TMDBMovieResponse,
  TMDBMovieDetailsResponse,
  TMDBTVShowResponse,
  TMDBTVShowDetailsResponse,
  TMDBSeason,
  TMDBEpisode,
  TMDBGenre,
} from '@/types/api/tmdb';
import type { Movie, TVShow, MediaItem } from '@/types/domain/media';
import type { Season, Episode } from '@/types/domain/season';
import type { Genre } from '@/types/domain/genre';

/**
 * Transformer class for converting TMDB API responses to domain models
 */
export class TMDBTransformer {
  /**
   * Transform TMDB movie response to Movie domain model
   * 
   * @param response - TMDB movie response (basic or detailed)
   * @returns Movie domain model
   */
  static toMovie(
    response: TMDBMovieResponse | TMDBMovieDetailsResponse
  ): Movie {
    // Check if this is a detailed response with runtime, budget, revenue
    const isDetailed = 'runtime' in response;
    const detailedResponse = response as TMDBMovieDetailsResponse;

    return {
      id: response.id,
      title: response.title,
      type: 'movie',
      posterPath: response.poster_path,
      backdropPath: response.backdrop_path,
      overview: response.overview,
      releaseDate: response.release_date || null,
      voteAverage: response.vote_average,
      voteCount: response.vote_count,
      popularity: response.popularity,
      runtime: isDetailed ? response.runtime : null,
      budget: isDetailed ? detailedResponse.budget : null,
      revenue: isDetailed ? detailedResponse.revenue : null,
      tagline: isDetailed ? detailedResponse.tagline : undefined,
      status: isDetailed ? detailedResponse.status : undefined,
      genres: isDetailed ? detailedResponse.genres : undefined,
      spokenLanguages: isDetailed ? detailedResponse.spoken_languages : undefined,
      productionCompanies: isDetailed ? detailedResponse.production_companies : undefined,
    };
  }

  /**
   * Transform TMDB TV show response to TVShow domain model
   * 
   * @param response - TMDB TV show response (basic or detailed)
   * @returns TVShow domain model
   */
  static toTVShow(
    response: TMDBTVShowResponse | TMDBTVShowDetailsResponse
  ): TVShow {
    // Check if this is a detailed response with seasons and episode info
    const isDetailed = 'seasons' in response;
    const detailedResponse = response as TMDBTVShowDetailsResponse;

    return {
      id: response.id,
      title: response.name,
      type: 'tv',
      posterPath: response.poster_path,
      backdropPath: response.backdrop_path,
      overview: response.overview,
      releaseDate: response.first_air_date || null,
      voteAverage: response.vote_average,
      voteCount: response.vote_count,
      popularity: response.popularity,
      numberOfSeasons: isDetailed ? detailedResponse.number_of_seasons : 0,
      numberOfEpisodes: isDetailed ? detailedResponse.number_of_episodes : 0,
      seasons: isDetailed
        ? detailedResponse.seasons.map((season) => ({
            id: season.id,
            seasonNumber: season.season_number,
            name: season.name,
            episodeCount: season.episode_count,
            airDate: season.air_date,
            overview: season.overview,
            posterPath: season.poster_path,
          }))
        : [],
      episodeRunTime: isDetailed ? detailedResponse.episode_run_time : [],
      tagline: isDetailed ? detailedResponse.tagline : undefined,
      status: isDetailed ? detailedResponse.status : undefined,
      genres: isDetailed ? detailedResponse.genres : undefined,
      spokenLanguages: isDetailed ? detailedResponse.spoken_languages : undefined,
      productionCompanies: isDetailed ? detailedResponse.production_companies : undefined,
    };
  }

  /**
   * Transform TMDB response to generic MediaItem
   * Useful for search results and lists where we don't need full details
   * 
   * @param response - TMDB movie or TV show response
   * @param type - Media type discriminator
   * @returns MediaItem domain model
   */
  static toMediaItem(
    response: TMDBMovieResponse | TMDBTVShowResponse,
    type: 'movie' | 'tv'
  ): MediaItem {
    if (type === 'movie') {
      const movieResponse = response as TMDBMovieResponse;
      return {
        id: movieResponse.id,
        title: movieResponse.title,
        type: 'movie',
        posterPath: movieResponse.poster_path,
        backdropPath: movieResponse.backdrop_path,
        overview: movieResponse.overview,
        releaseDate: movieResponse.release_date || null,
        voteAverage: movieResponse.vote_average,
        voteCount: movieResponse.vote_count,
        popularity: movieResponse.popularity,
      };
    } else {
      const tvResponse = response as TMDBTVShowResponse;
      return {
        id: tvResponse.id,
        title: tvResponse.name,
        type: 'tv',
        posterPath: tvResponse.poster_path,
        backdropPath: tvResponse.backdrop_path,
        overview: tvResponse.overview,
        releaseDate: tvResponse.first_air_date || null,
        voteAverage: tvResponse.vote_average,
        voteCount: tvResponse.vote_count,
        popularity: tvResponse.popularity,
      };
    }
  }

  /**
   * Transform TMDB season response to Season domain model
   * 
   * @param response - TMDB season response
   * @returns Season domain model
   */
  static toSeason(response: TMDBSeason): Season {
    return {
      id: response.id,
      seasonNumber: response.season_number,
      name: response.name,
      episodeCount: response.episode_count,
      airDate: response.air_date,
      overview: response.overview,
      posterPath: response.poster_path,
    };
  }

  /**
   * Transform TMDB episode response to Episode domain model
   * 
   * @param response - TMDB episode response
   * @returns Episode domain model
   */
  static toEpisode(response: TMDBEpisode): Episode {
    return {
      id: response.id,
      episodeNumber: response.episode_number,
      seasonNumber: response.season_number,
      name: response.name,
      overview: response.overview,
      airDate: response.air_date,
      stillPath: response.still_path,
      voteAverage: response.vote_average,
    };
  }

  /**
   * Transform TMDB genre response to Genre domain model
   * 
   * @param response - TMDB genre response
   * @returns Genre domain model
   */
  static toGenre(response: TMDBGenre): Genre {
    return {
      id: response.id,
      name: response.name,
    };
  }

  /**
   * Transform array of TMDB genres to array of Genre domain models
   * 
   * @param responses - Array of TMDB genre responses
   * @returns Array of Genre domain models
   */
  static toGenres(responses: TMDBGenre[]): Genre[] {
    return responses.map((genre) => this.toGenre(genre));
  }

  /**
   * Transform array of TMDB movies to array of Movie domain models
   * 
   * @param responses - Array of TMDB movie responses
   * @returns Array of Movie domain models
   */
  static toMovies(
    responses: Array<TMDBMovieResponse | TMDBMovieDetailsResponse>
  ): Movie[] {
    return responses.map((movie) => this.toMovie(movie));
  }

  /**
   * Transform array of TMDB TV shows to array of TVShow domain models
   * 
   * @param responses - Array of TMDB TV show responses
   * @returns Array of TVShow domain models
   */
  static toTVShows(
    responses: Array<TMDBTVShowResponse | TMDBTVShowDetailsResponse>
  ): TVShow[] {
    return responses.map((show) => this.toTVShow(show));
  }

  /**
   * Transform array of TMDB seasons to array of Season domain models
   * 
   * @param responses - Array of TMDB season responses
   * @returns Array of Season domain models
   */
  static toSeasons(responses: TMDBSeason[]): Season[] {
    return responses.map((season) => this.toSeason(season));
  }

  /**
   * Transform array of TMDB episodes to array of Episode domain models
   * 
   * @param responses - Array of TMDB episode responses
   * @returns Array of Episode domain models
   */
  static toEpisodes(responses: TMDBEpisode[]): Episode[] {
    return responses.map((episode) => this.toEpisode(episode));
  }
}
