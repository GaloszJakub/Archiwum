import { useState } from 'react';
import { Plus, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserCollections, useCreateCollection, useAddToCollection, useCheckItemInCollections } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';

interface AddToCollectionButtonProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

export const AddToCollectionButton = ({ tmdbId, type, title, posterPath }: AddToCollectionButtonProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);

  const { data: collections, isLoading } = useUserCollections();
  const { data: collectionsWithItem } = useCheckItemInCollections(tmdbId, type);
  const createCollection = useCreateCollection();
  const addToCollection = useAddToCollection();

  const handleCreateAndAdd = async () => {
    if (!newCollectionName.trim()) return;

    try {
      const collectionId = await createCollection.mutateAsync({
        name: newCollectionName.trim()
      });

      await addToCollection.mutateAsync({
        collectionId,
        item: { tmdbId, type, title, posterPath }
      });

      setNewCollectionName('');
      setShowNewCollection(false);
      setOpen(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleAddToExisting = async (collectionId: string) => {
    try {
      await addToCollection.mutateAsync({
        collectionId,
        item: { tmdbId, type, title, posterPath }
      });
    } catch (error: any) {
      if (error.message === 'Item already in collection') {
        // Already handled by UI
      } else {
        console.error('Error adding to collection:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj do kolekcji</DialogTitle>
          <DialogDescription>
            Wybierz kolekcję lub utwórz nową
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Ładowanie...</div>
          ) : (
            <>
              {collections && collections.length > 0 && (
                <div className="space-y-2">
                  <Label>Twoje kolekcje</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {collections.map((collection) => {
                      const isInCollection = collectionsWithItem?.includes(collection.id);

                      return (
                        <button
                          key={collection.id}
                          onClick={() => !isInCollection && handleAddToExisting(collection.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${isInCollection
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'hover:bg-accent'
                            } ${addToCollection.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={addToCollection.isPending}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {collection.name}
                                {isInCollection && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {collection.itemCount} {collection.itemCount === 1 ? 'element' : 'elementów'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!showNewCollection ? (
                <Button
                  variant="outline"
                  onClick={() => setShowNewCollection(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Utwórz nową kolekcję
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="collection-name">Nazwa nowej kolekcji</Label>
                  <Input
                    id="collection-name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Moja kolekcja"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateAndAdd}
                      disabled={!newCollectionName.trim() || createCollection.isPending}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Utwórz i dodaj
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewCollection(false);
                        setNewCollectionName('');
                      }}
                    >
                      Anuluj
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
