import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodesService, Episode } from '@/lib/episodes';
import { useAuth } from '@/contexts/AuthContext';

export const useSeriesEpisodes = (tmdbId: number) => {
  return useQuery({
    queryKey: ['episodes', tmdbId],
    queryFn: () => episodesService.getSeriesEpisodes(tmdbId),
    enabled: !!tmdbId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSeasonEpisodes = (tmdbId: number, seasonNumber: number) => {
  return useQuery({
    queryKey: ['episodes', tmdbId, seasonNumber],
    queryFn: () => episodesService.getSeasonEpisodes(tmdbId, seasonNumber),
    enabled: !!tmdbId && !!seasonNumber,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEpisodeLink = (tmdbId: number, seasonNumber: number, episodeNumber: number) => {
  return useQuery({
    queryKey: ['episode', tmdbId, seasonNumber, episodeNumber],
    queryFn: () => episodesService.getEpisodeLink(tmdbId, seasonNumber, episodeNumber),
    enabled: !!tmdbId && !!seasonNumber && !!episodeNumber,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddEpisodeLink = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tmdbId,
      seasonNumber,
      episodeNumber,
      link,
      options,
    }: {
      tmdbId: number;
      seasonNumber: number;
      episodeNumber: number;
      link: string;
      options?: {
        title?: string;
        quality?: string;
        language?: string;
      };
    }) =>
      episodesService.addEpisodeLink(
        tmdbId,
        seasonNumber,
        episodeNumber,
        link,
        user!.uid,
        options
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes', variables.tmdbId] });
      queryClient.invalidateQueries({
        queryKey: ['episodes', variables.tmdbId, variables.seasonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ['episode', variables.tmdbId, variables.seasonNumber, variables.episodeNumber],
      });
    },
  });
};

export const useDeleteEpisodeLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tmdbId,
      seasonNumber,
      episodeNumber,
    }: {
      tmdbId: number;
      seasonNumber: number;
      episodeNumber: number;
    }) => episodesService.deleteEpisodeLink(tmdbId, seasonNumber, episodeNumber),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes', variables.tmdbId] });
      queryClient.invalidateQueries({
        queryKey: ['episodes', variables.tmdbId, variables.seasonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ['episode', variables.tmdbId, variables.seasonNumber, variables.episodeNumber],
      });
    },
  });
};

export const useMovieLinks = (tmdbId: number) => {
  return useQuery({
    queryKey: ['movie-links', tmdbId],
    queryFn: () => episodesService.getMovieLinks(tmdbId),
    enabled: !!tmdbId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddMovieLink = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tmdbId,
      link,
      options,
    }: {
      tmdbId: number;
      link: string;
      options?: {
        title?: string;
        quality?: string;
        language?: string;
      };
    }) => episodesService.addLink(tmdbId, 'movie', link, user!.uid, options),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movie-links', variables.tmdbId] });
    },
  });
};

export const useDeleteMovieLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tmdbId, linkId }: { tmdbId: number; linkId: string }) =>
      episodesService.deleteMovieLink(tmdbId, linkId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movie-links', variables.tmdbId] });
    },
  });
};
