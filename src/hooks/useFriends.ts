import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendsService } from '@/lib/friends';
import { useAuth } from '@/contexts/AuthContext';

export const useFriends = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friends', user?.uid],
    queryFn: () => friendsService.getFriends(user!.uid),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePendingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pending-requests', user?.uid],
    queryFn: () => friendsService.getPendingRequests(user!.uid),
    enabled: !!user,
    staleTime: 30 * 1000,
  });
};

export const useSentRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sent-requests', user?.uid],
    queryFn: () => friendsService.getSentRequests(user!.uid),
    enabled: !!user,
    staleTime: 30 * 1000,
  });
};

export const useSearchUsers = (searchTerm: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['search-users', searchTerm, user?.uid],
    queryFn: () => friendsService.searchUsers(searchTerm, user!.uid),
    enabled: !!user && searchTerm.length >= 2,
    staleTime: 60 * 1000,
  });
};

export const useSendFriendRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ toUserId, toUserName }: { toUserId: string; toUserName: string }) =>
      friendsService.sendFriendRequest(
        user!.uid,
        user!.displayName || 'Anonim',
        toUserId,
        toUserName
      ),
    onSuccess: () => {
      // Refresh both sent requests and search results
      queryClient.invalidateQueries({ queryKey: ['sent-requests'] });
      queryClient.invalidateQueries({ queryKey: ['search-users'] });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => friendsService.acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => friendsService.rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    },
  });
};

export const useRemoveFriend = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => friendsService.removeFriend(user!.uid, friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
};

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => friendsService.cancelFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-requests'] });
    },
  });
};
