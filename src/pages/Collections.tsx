import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Heart } from 'lucide-react';
import { tmdbService } from '@/lib/tmdb';
import { Star } from 'lucide-react';
import {
  useUserCollections,
  useCollectionItems,
  useRemoveFromCollection,
  useCreateCollection,
} from '@/hooks/useCollections';

const A = {
  bg: '#0a0a0c',
  surface: '#14141a',
  border: 'rgba(255,248,230,0.06)',
  border2: 'rgba(255,248,230,0.10)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  muted: '#847d6f',
  subtle: '#58524a',
  amber: '#d4a056',
};

const MY_LIST_NAME = 'Moja lista';

const Collections = () => {
  const navigate = useNavigate();
  const { data: collections, isLoading: collectionsLoading } = useUserCollections();
  const createCollection = useCreateCollection();

  // Find "Moja lista" or use first collection
  const myList = collections?.find(c => c.name === MY_LIST_NAME) || collections?.[0];
  const { data: items, isLoading: itemsLoading } = useCollectionItems(myList?.id || '');
  const removeFromCollection = useRemoveFromCollection();

  const isLoading = collectionsLoading || itemsLoading;

  const handleRemove = async (itemId: string) => {
    if (!myList) return;
    try {
      await removeFromCollection.mutateAsync({ collectionId: myList.id, itemId });
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: A.amber }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: '32px 24px 100px',
        fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            fontSize: 36,
            fontWeight: 400,
            color: A.text,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          Moja lista
        </h1>
        <p style={{ fontSize: 14, color: A.muted }}>
          {items?.length || 0} {(items?.length || 0) === 1 ? 'pozycja' : 'pozycji'} zapisanych
        </p>
      </div>

      {/* Empty state */}
      {(!items || items.length === 0) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center',
          }}
        >
          <Heart size={48} color={A.subtle} style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, fontWeight: 600, color: A.text, marginBottom: 8 }}>
            Twoja lista jest pusta
          </h2>
          <p style={{ fontSize: 14, color: A.muted, maxWidth: 320 }}>
            Dodawaj filmy i seriale do swojej listy, klikając przycisk "Moja lista" na stronie szczegółów
          </p>
        </div>
      )}

      {/* Items grid */}
      {items && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group" style={{ cursor: 'pointer' }}>
              <div
                style={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={
                    item.posterPath
                      ? tmdbService.getImageUrl(item.posterPath, 'w500')
                      : '/placeholder.svg'
                  }
                  alt={item.title}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />

                {/* Remove button on hover */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(10,10,12,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Usuń z listy"
                >
                  <Trash2 size={14} color="#ff6b6b" />
                </button>

                {/* Type badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    color: A.text2,
                    padding: '2px 6px',
                    borderRadius: 3,
                    background: 'rgba(10,10,12,0.7)',
                    backdropFilter: 'blur(6px)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.type === 'movie' ? 'FILM' : 'SERIAL'}
                </div>
              </div>

              <div style={{ marginTop: 10 }} onClick={() => handleItemClick(item)}>
                <div
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: A.text,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: A.muted, marginTop: 4 }}>
                  {item.type === 'movie' ? 'Film' : 'Serial'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Collections;
