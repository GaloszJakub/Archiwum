import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollectionItems, useRemoveFromCollection, useUserCollections } from '@/hooks/useCollections';
import { tmdbService } from '@/lib/tmdb';
import { useTranslation } from 'react-i18next';

const CollectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: collections } = useUserCollections();
  const { data: items, isLoading } = useCollectionItems(id || '');
  const removeFromCollection = useRemoveFromCollection();

  const collection = collections?.find((c) => c.id === id);

  const handleRemove = async (itemId: string) => {
    if (!id) return;
    
    try {
      await removeFromCollection.mutateAsync({ collectionId: id, itemId });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.type === 'movie') {
      navigate(`/movie/${item.tmdbId}`);
    } else {
      navigate(`/series/${item.tmdbId}`);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/collections')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-2">{collection?.name || t('collections.title')}</h1>
        {collection?.description && (
          <p className="text-foreground-secondary">{collection.description}</p>
        )}
        <p className="text-sm text-foreground-secondary mt-2">
          {items?.length || 0} {t('collections.items')}
        </p>
      </div>

      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-foreground-secondary mb-4">
            {t('collections.noCollections')}
          </p>
          <p className="text-sm text-foreground-secondary">
            {t('collections.createFirst')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative"
            >
              <div
                className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={
                    item.posterPath
                      ? tmdbService.getImageUrl(item.posterPath, 'w500')
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-foreground-secondary">
                  {item.type === 'movie' ? t('movies.title') : t('series.title')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CollectionDetails;
