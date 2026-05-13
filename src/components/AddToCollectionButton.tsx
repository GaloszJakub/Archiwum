import { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { useUserCollections, useCreateCollection, useAddToCollection, useCheckItemInCollections, useRemoveFromCollection, useCollectionItems } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';

const A = {
  amber: '#d4a056',
  text: '#f3efe6',
  surface: '#14141a',
  border: 'rgba(255,248,230,0.10)',
};

interface AddToCollectionButtonProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

const MY_LIST_NAME = 'Moja lista';

export const AddToCollectionButton = ({ tmdbId, type, title, posterPath }: AddToCollectionButtonProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: collections } = useUserCollections();
  const { data: collectionsWithItem } = useCheckItemInCollections(tmdbId, type);
  const createCollection = useCreateCollection();
  const addToCollection = useAddToCollection();
  const removeFromCollection = useRemoveFromCollection();

  // Find or identify "Moja lista"
  const myList = collections?.find(c => c.name === MY_LIST_NAME) || collections?.[0];
  const isInList = myList ? collectionsWithItem?.includes(myList.id) : false;

  const handleToggle = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);

    try {
      let listId = myList?.id;

      // Auto-create "Moja lista" if it doesn't exist
      if (!listId) {
        listId = await createCollection.mutateAsync({ name: MY_LIST_NAME });
      }

      if (isInList && listId) {
        // Find the item to remove
        // We need to get items to find the item ID
        const items = await import('@/lib/collections').then(m =>
          m.collectionsService.getCollectionItems(user.uid, listId!)
        );
        const item = items.find(i => i.tmdbId === tmdbId && i.type === type);
        if (item) {
          await removeFromCollection.mutateAsync({ collectionId: listId, itemId: item.id });
        }
      } else if (listId) {
        await addToCollection.mutateAsync({
          collectionId: listId,
          item: { tmdbId, type, title, posterPath },
        });
      }
    } catch (error: any) {
      if (error.message !== 'Item already in collection') {
        console.error('Error toggling list item:', error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleToggle(); }}
      disabled={isProcessing}
      aria-label={isInList ? 'Usuń z mojej listy' : 'Dodaj do mojej listy'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 36,
        padding: '0 14px',
        borderRadius: 8,
        background: isInList ? A.amber : A.surface,
        color: isInList ? '#0a0a0c' : A.text,
        border: `1px solid ${isInList ? A.amber : A.border}`,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: '"Inter Tight", sans-serif',
        cursor: isProcessing ? 'wait' : 'pointer',
        opacity: isProcessing ? 0.6 : 1,
        transition: 'all 150ms ease',
      }}
    >
      {isProcessing ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isInList ? (
        <Check size={14} />
      ) : (
        <Plus size={14} />
      )}
      {isInList ? 'Na liście' : 'Moja lista'}
    </button>
  );
};
