import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService, CollectionItem, UserCollection } from '@/lib/collections';
import { useAuth } from '@/contexts/AuthContext';

export const useUserCollections = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['collections', user?.uid],
    queryFn: () => collectionsService.getUserCollections(user!.uid),
    enabled: !!user,
    staleTime: 5 * 60 * 1000
  });
};

export const useCollectionItems = (collectionId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['collection-items', user?.uid, collectionId],
    queryFn: () => collectionsService.getCollectionItems(user!.uid, collectionId),
    enabled: !!user && !!collectionId,
    staleTime: 5 * 60 * 1000
  });
};

export const useCreateCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      collectionsService.createCollection(user!.uid, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.uid] });
    }
  });
};

export const useAddToCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      item
    }: {
      collectionId: string;
      item: Omit<CollectionItem, 'id' | 'addedAt'>
    }) => collectionsService.addItemToCollection(user!.uid, collectionId, item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.uid] });
      queryClient.invalidateQueries({
        queryKey: ['collection-items', user?.uid, variables.collectionId]
      });
      queryClient.invalidateQueries({
        queryKey: ['item-in-collections', user?.uid]
      });
    }
  });
};

export const useRemoveFromCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, itemId }: { collectionId: string; itemId: string }) =>
      collectionsService.removeItemFromCollection(user!.uid, collectionId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.uid] });
      queryClient.invalidateQueries({
        queryKey: ['collection-items', user?.uid, variables.collectionId]
      });
    }
  });
};

export const useDeleteCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) =>
      collectionsService.deleteCollection(user!.uid, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.uid] });
    }
  });
};

export const useUpdateCollection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      updates
    }: {
      collectionId: string;
      updates: { name?: string; description?: string }
    }) => collectionsService.updateCollection(user!.uid, collectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', user?.uid] });
    }
  });
};

export const useCheckItemInCollections = (tmdbId: number, type: 'movie' | 'tv') => {
  const { user } = useAuth();
  const { data: collections } = useUserCollections();

  return useQuery({
    queryKey: ['item-in-collections', user?.uid, tmdbId, type],
    queryFn: async () => {
      if (!collections || !user) return [];

      const checks = await Promise.all(
        collections.map(async (collection) => {
          const isInCollection = await collectionsService.isItemInCollection(
            user.uid,
            collection.id,
            tmdbId,
            type
          );
          return { collectionId: collection.id, isInCollection };
        })
      );

      return checks.filter(c => c.isInCollection).map(c => c.collectionId);
    },
    enabled: !!user && !!collections && collections.length > 0,
    staleTime: 30 * 1000 // 30 seconds
  });
};
