import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useUserCollections,
  useCreateCollection,
  useDeleteCollection,
  useUpdateCollection,
} from '@/hooks/useCollections';

const Collections = () => {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useUserCollections();
  const createCollection = useCreateCollection();
  const deleteCollection = useDeleteCollection();
  const updateCollection = useUpdateCollection();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [editingCollection, setEditingCollection] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await createCollection.mutateAsync({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || undefined,
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingCollection || !editingCollection.name.trim()) return;

    try {
      await updateCollection.mutateAsync({
        collectionId: editingCollection.id,
        updates: {
          name: editingCollection.name.trim(),
          description: editingCollection.description?.trim() || undefined,
        },
      });
      setEditingCollection(null);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę kolekcję? Wszystkie elementy zostaną usunięte.')) {
      return;
    }

    try {
      await deleteCollection.mutateAsync(collectionId);
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Moje kolekcje</h1>
          <p className="text-foreground-secondary">
            Moje kolekcje
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nowa kolekcja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Utwórz kolekcję</DialogTitle>
              <DialogDescription>
                Nadaj nazwę swojej nowej kolekcji
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nazwa</Label>
                <Input
                  id="name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Nazwa"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div>
                <Label htmlFor="description">Opis</Label>
                <Input
                  id="description"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Opis kolekcji"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!newCollectionName.trim() || createCollection.isPending}
                className="w-full"
              >
                Zapisz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!collections || collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-20 h-20 text-foreground-secondary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Brak kolekcji</h2>
          <p className="text-foreground-secondary mb-6">
            Utwórz swoją pierwszą kolekcję, aby zacząć organizować filmy i seriale
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Utwórz pierwszą kolekcję
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background-secondary rounded-xl p-6 hover:bg-background-secondary/80 transition-colors cursor-pointer group"
              onClick={() => navigate(`/collections/${collection.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-foreground-secondary line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">
                  {collection.itemCount} {collection.itemCount === 1 ? 'element' : 'elementów'}
                </span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCollection({
                        id: collection.id,
                        name: collection.name,
                        description: collection.description,
                      });
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(collection.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj kolekcję</DialogTitle>
            <DialogDescription>
              Zmień nazwę lub opis kolekcji
            </DialogDescription>
          </DialogHeader>
          {editingCollection && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nazwa</Label>
                <Input
                  id="edit-name"
                  value={editingCollection.name}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, name: e.target.value })
                  }
                  placeholder="Nazwa"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Opis (opcjonalnie)</Label>
                <Input
                  id="edit-description"
                  value={editingCollection.description || ''}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, description: e.target.value })
                  }
                  placeholder="Opis kolekcji"
                />
              </div>
              <Button
                onClick={handleUpdate}
                disabled={!editingCollection.name.trim() || updateCollection.isPending}
                className="w-full"
              >
                Zapisz zmiany
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Collections;
