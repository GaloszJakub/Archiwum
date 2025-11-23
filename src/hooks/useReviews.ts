import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '@/lib/reviews';
import { useAuth } from '@/contexts/AuthContext';

export const useReviews = (tmdbId: number, type: 'movie' | 'tv') => {
  return useQuery({
    queryKey: ['reviews', tmdbId, type],
    queryFn: () => reviewsService.getReviews(tmdbId, type),
    enabled: !!tmdbId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserReview = (tmdbId: number, type: 'movie' | 'tv') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-review', tmdbId, type, user?.uid],
    queryFn: () => reviewsService.getUserReview(tmdbId, type, user!.uid),
    enabled: !!user && !!tmdbId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAverageRating = (tmdbId: number, type: 'movie' | 'tv') => {
  return useQuery({
    queryKey: ['average-rating', tmdbId, type],
    queryFn: () => reviewsService.getAverageRating(tmdbId, type),
    enabled: !!tmdbId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAddReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tmdbId,
      type,
      rating,
      review,
    }: {
      tmdbId: number;
      type: 'movie' | 'tv';
      rating: number;
      review: string;
    }) =>
      reviewsService.addReview(
        tmdbId,
        type,
        user!.uid,
        user!.displayName || 'Anonim',
        rating,
        review
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.tmdbId, variables.type] });
      queryClient.invalidateQueries({ queryKey: ['user-review', variables.tmdbId, variables.type] });
      queryClient.invalidateQueries({ queryKey: ['average-rating', variables.tmdbId, variables.type] });
    },
  });
};

export const useDeleteReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tmdbId, type }: { tmdbId: number; type: 'movie' | 'tv' }) =>
      reviewsService.deleteReview(tmdbId, type, user!.uid),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.tmdbId, variables.type] });
      queryClient.invalidateQueries({ queryKey: ['user-review', variables.tmdbId, variables.type] });
      queryClient.invalidateQueries({ queryKey: ['average-rating', variables.tmdbId, variables.type] });
    },
  });
};
