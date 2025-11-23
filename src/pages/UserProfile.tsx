import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, FolderHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';

interface UserData {
  displayName: string;
  email: string;
  role: string;
}

interface UserCollection {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
}

interface CollectionItem {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const userDoc = await getDoc(doc(db, 'users', userId!));
      if (!userDoc.exists()) throw new Error('User not found');
      return userDoc.data() as UserData;
    },
    enabled: !!userId,
  });

  // Fetch user collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['user-collections', userId],
    queryFn: async () => {
      const collectionsRef = collection(db, 'users', userId!, 'collections');
      const snapshot = await getDocs(collectionsRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserCollection[];
    },
    enabled: !!userId,
  });

  // Fetch items from first collection for preview
  const { data: previewItems } = useQuery({
    queryKey: ['collection-preview', userId, collections?.[0]?.id],
    queryFn: async () => {
      if (!collections || collections.length === 0) return [];
      
      const itemsRef = collection(db, 'users', userId!, 'collections', collections[0].id, 'items');
      const snapshot = await getDocs(itemsRef);
      return snapshot.docs.map((doc) => doc.data()) as CollectionItem[];
    },
    enabled: !!userId && !!collections && collections.length > 0,
  });

  if (userLoading || collectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-foreground-secondary">Nie znaleziono użytkownika</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
      </div>

      {/* User Info */}
      <div className="bg-background-secondary rounded-xl p-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
          <UserIcon className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{userData.displayName}</h1>
          <p className="text-foreground-secondary">{userData.email}</p>
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FolderHeart className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">Kolekcje</h2>
          <span className="text-foreground-secondary">
            ({collections?.length || 0})
          </span>
        </div>

        {collections && collections.length > 0 ? (
          <div className="space-y-6">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-background-secondary rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-1">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-foreground-secondary">{collection.description}</p>
                  )}
                  <p className="text-sm text-foreground-secondary mt-2">
                    {collection.itemCount} {collection.itemCount === 1 ? 'element' : 'elementów'}
                  </p>
                </div>

                {/* Preview items from first collection */}
                {collection.id === collections[0].id && previewItems && previewItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previewItems.slice(0, 6).map((item) => (
                      <div
                        key={`${item.tmdbId}-${item.type}`}
                        onClick={() => navigate(item.type === 'movie' ? `/movie/${item.tmdbId}` : `/series/${item.tmdbId}`)}
                      >
                        <MovieCard
                          id={item.tmdbId.toString()}
                          title={item.title}
                          posterUrl={
                            item.posterPath
                              ? tmdbService.getImageUrl(item.posterPath, 'w500')
                              : 'https://via.placeholder.com/500x750?text=No+Image'
                          }
                          tmdbId={item.tmdbId}
                          type={item.type}
                          posterPath={item.posterPath}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-background-secondary rounded-xl">
            <FolderHeart className="w-16 h-16 text-foreground-secondary mx-auto mb-4" />
            <p className="text-foreground-secondary">Ten użytkownik nie ma jeszcze kolekcji</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
