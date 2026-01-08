import { useQuery } from '@tanstack/react-query';
import { watchedEpisodesService } from '@/lib/watchedEpisodes';
import { tmdbService } from '@/lib/tmdb';
import { useAuth } from '@/contexts/AuthContext';

export interface RecentlyWatchedSeries {
    tmdbId: number;
    name: string;
    posterPath: string | null;
    lastWatchedAt: Date;
    lastEpisode: {
        seasonNumber: number;
        episodeNumber: number;
    } | null;
}

export const useRecentlyWatched = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['recentlyWatched', user?.uid],
        queryFn: async () => {
            if (!user) return [];

            // 1. Fetch raw watched episodes (limit 50 to ensure we find enough unique series)
            const recentEpisodes = await watchedEpisodesService.getMostRecentWatchedEpisodes(user.uid, 50);

            // 2. Filter for unique series (map tmdbId -> latest episode)
            const uniqueSeriesMap = new Map<number, {
                lastWatchedAt: Date;
                seasonNumber: number;
                episodeNumber: number;
            }>();

            for (const ep of recentEpisodes) {
                if (!uniqueSeriesMap.has(ep.tmdbId)) {
                    uniqueSeriesMap.set(ep.tmdbId, {
                        lastWatchedAt: ep.watchedAt,
                        seasonNumber: ep.seasonNumber,
                        episodeNumber: ep.episodeNumber
                    });
                }
            }

            // 3. Take top 6 unique series IDs
            const topSeriesIds = Array.from(uniqueSeriesMap.keys()).slice(0, 6);

            // 4. Fetch details for each series from TMDB
            const seriesWithDetails = await Promise.all(
                topSeriesIds.map(async (tmdbId) => {
                    try {
                        const details = await tmdbService.getTVShowDetails(tmdbId);
                        const episodeData = uniqueSeriesMap.get(tmdbId);

                        return {
                            tmdbId,
                            name: details.name,
                            posterPath: details.poster_path,
                            lastWatchedAt: episodeData!.lastWatchedAt,
                            lastEpisode: {
                                seasonNumber: episodeData!.seasonNumber,
                                episodeNumber: episodeData!.episodeNumber
                            }
                        } as RecentlyWatchedSeries;
                    } catch (error) {
                        console.error(`Failed to fetch details for series ${tmdbId}`, error);
                        return null;
                    }
                })
            );

            // Filter out any failed fetches and return
            return seriesWithDetails.filter((s): s is RecentlyWatchedSeries => s !== null);
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};


