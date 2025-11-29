import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { tmdbService } from '@/lib/tmdb';

export const useSearchMovies = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'search', 'movies', query],
    queryFn: ({ pageParam = 1 }) => tmdbService.searchMovies(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchTVShows = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'search', 'tv', query],
    queryFn: ({ pageParam = 1 }) => tmdbService.searchTVShows(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchMulti = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'search', 'multi', query],
    queryFn: ({ pageParam = 1 }) => tmdbService.searchMulti(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'popular', 'movies'],
    queryFn: ({ pageParam = 1 }) => tmdbService.getPopularMovies(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < Math.min(lastPage.total_pages, 5) ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const usePopularTVShows = () => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'popular', 'tv'],
    queryFn: ({ pageParam = 1 }) => tmdbService.getPopularTVShows(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < Math.min(lastPage.total_pages, 5) ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useMovieDetails = (id: number) => {
  return useQuery({
    queryKey: ['tmdb', 'movie', id],
    queryFn: () => tmdbService.getMovieDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTVShowDetails = (id: number) => {
  return useQuery({
    queryKey: ['tmdb', 'tv', id],
    queryFn: () => tmdbService.getTVShowDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['tmdb', 'trending', 'movies'],
    queryFn: () => tmdbService.getTrendingMovies('week'),
    staleTime: 60 * 60 * 1000,
  });
};

export const useTrendingTVShows = () => {
  return useQuery({
    queryKey: ['tmdb', 'trending', 'tv'],
    queryFn: () => tmdbService.getTrendingTVShows('week'),
    staleTime: 60 * 60 * 1000,
  });
};

export const useSeasonDetails = (tvId: number, seasonNumber: number) => {
  return useQuery({
    queryKey: ['tmdb', 'season', tvId, seasonNumber],
    queryFn: () => tmdbService.getSeasonDetails(tvId, seasonNumber),
    enabled: !!tvId && !!seasonNumber,
    staleTime: 10 * 60 * 1000,
  });
};

export const useDiscoverMovies = (params: {
  with_genres?: string;
  sort_by?: string;
  year?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'movies', params],
    queryFn: ({ pageParam = 1 }) => tmdbService.discoverMovies({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < Math.min(lastPage.total_pages, 5) ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 60 * 1000,
  });
};

export const useDiscoverTVShows = (params: {
  with_genres?: string;
  sort_by?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'tv', params],
    queryFn: ({ pageParam = 1 }) => tmdbService.discoverTVShows({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < Math.min(lastPage.total_pages, 5) ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 60 * 1000,
  });
};

export const useMovieGenres = () => {
  return useQuery({
    queryKey: ['tmdb', 'genres', 'movies'],
    queryFn: () => tmdbService.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useTVGenres = () => {
  return useQuery({
    queryKey: ['tmdb', 'genres', 'tv'],
    queryFn: () => tmdbService.getTVGenres(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
