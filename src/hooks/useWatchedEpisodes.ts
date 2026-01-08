import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchedEpisodesService } from '@/lib/watchedEpisodes';
import { useAuth } from '@/contexts/AuthContext';

export const useWatchedEpisodes = (tmdbId: number) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['watchedEpisodes', user?.uid, tmdbId],
        queryFn: () => watchedEpisodesService.getWatchedEpisodesForShow(user!.uid, tmdbId),
        enabled: !!user && !!tmdbId,
        staleTime: 30 * 1000
    });
};

export const useMarkEpisodeWatched = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            tmdbId,
            seasonNumber,
            episodeNumber
        }: {
            tmdbId: number;
            seasonNumber: number;
            episodeNumber: number
        }) => {
            if (!user) {
                return Promise.reject(new Error('User not logged in'));
            }
            return watchedEpisodesService.markAsWatched(user.uid, tmdbId, seasonNumber, episodeNumber);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['watchedEpisodes', user?.uid, variables.tmdbId]
            });
        },
        onError: (error) => {
            console.error('Error marking episode as watched:', error);
        }
    });
};

export const useMarkEpisodeUnwatched = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            tmdbId,
            seasonNumber,
            episodeNumber
        }: {
            tmdbId: number;
            seasonNumber: number;
            episodeNumber: number
        }) => watchedEpisodesService.markAsUnwatched(user!.uid, tmdbId, seasonNumber, episodeNumber),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['watchedEpisodes', user?.uid, variables.tmdbId]
            });
        }
    });
};
