import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews, useUserReview, useAverageRating, useAddReview, useDeleteReview } from '@/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ReviewsSectionProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  mediaTitle?: string;
}

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
  red: '#ef4444',
  bg: '#0a0a0c',
};

export const ReviewsSection = ({ tmdbId, type, mediaTitle }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { data: reviews, isLoading: reviewsLoading } = useReviews(tmdbId, type);
  const { data: userReview } = useUserReview(tmdbId, type);
  const { data: averageData } = useAverageRating(tmdbId, type);
  const addReview = useAddReview();
  const deleteReview = useDeleteReview();

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Wybierz ocenę');
      return;
    }

    try {
      await addReview.mutateAsync({
        tmdbId,
        type,
        rating,
        review: reviewText.trim(),
        mediaTitle,
      });

      setIsEditing(false);
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Błąd podczas dodawania recenzji');
    }
  };

  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setReviewText(userReview.review);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć swoją recenzję?')) return;

    try {
      await deleteReview.mutateAsync({ tmdbId, type });
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Błąd podczas usuwania recenzji');
    }
  };

  const StarRating = ({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) => {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: readonly ? 'default' : 'pointer',
              color: star <= (readonly ? value : (hoverRating || value)) ? A.amber : A.text2,
              opacity: star <= (readonly ? value : (hoverRating || value)) ? 1 : 0.3,
              fontSize: 20,
              padding: 0,
              margin: 0,
              transition: 'all 0.2s ease',
              transform: !readonly && hoverRating === star ? 'scale(1.2)' : 'scale(1)'
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={{ borderTop: `1px solid ${A.border}`, paddingTop: 40, marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Recenzje
        </h2>
        {averageData && averageData.count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: star <= Math.round(averageData.average) ? A.amber : A.text2, opacity: star <= Math.round(averageData.average) ? 1 : 0.3, fontSize: 14 }}>
                  ★
                </span>
              ))}
            </div>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: A.text }}>{averageData.average.toFixed(1)}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
              ({averageData.count})
            </span>
          </div>
        )}
      </div>

      {/* User's Review Form */}
      {user && (
        <div style={{ border: `1px solid ${A.border}`, padding: '24px', marginBottom: 32 }}>
          {userReview && !isEditing ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Twoja recenzja</p>
                  <StarRating value={userReview.rating} readonly />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={handleEdit} style={{ background: 'transparent', border: 'none', color: A.text2, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, cursor: 'pointer', padding: 0 }} className="hover:text-white">
                    [EDYCJA]
                  </button>
                  <button onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: A.red, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                    [USUŃ]
                  </button>
                </div>
              </div>
              {userReview.review && (
                <p style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 16, lineHeight: 1.6, color: A.text, margin: 0 }}>{userReview.review}</p>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Twoja ocena</p>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Treść recenzji (opcjonalnie)</p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Podziel się swoją opinią..."
                  rows={4}
                  maxLength={500}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: `1px solid ${A.border}`,
                    color: A.text,
                    padding: 16,
                    fontFamily: '"Inter Tight", sans-serif',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  className="focus:border-white transition-colors"
                />
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, marginTop: 8, textAlign: 'right' }}>
                  {reviewText.length}/500
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || addReview.isPending}
                  style={{
                    background: rating === 0 ? 'transparent' : A.amber,
                    border: `1px solid ${A.amber}`,
                    color: rating === 0 ? A.amber : A.bg,
                    padding: '12px 24px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  }}
                  className="transition-colors hover:opacity-90"
                >
                  {userReview ? 'ZAKTUALIZUJ' : 'DODAJ RECENZJĘ'}
                </button>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setRating(0);
                      setReviewText('');
                    }}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${A.border}`,
                      color: A.text,
                      padding: '12px 24px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                    }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    ANULUJ
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Reviews */}
      <div>
        {reviewsLoading ? (
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }} className="animate-pulse py-8 text-center">
            ŁADOWANIE RECENZJI...
          </div>
        ) : (() => {
          const otherReviews = reviews?.filter((review) => review.userId !== user?.uid) || [];

          return otherReviews.length > 0 ? (
            <div style={{ borderTop: `1px solid ${A.border}` }}>
              {otherReviews.map((review) => (
                <div
                  key={review.id}
                  style={{ borderBottom: `1px solid ${A.border}`, padding: '32px 0' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: A.text, fontWeight: 500 }}>{review.userName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StarRating value={review.rating} readonly />
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, textTransform: 'uppercase' }}>
                        {formatDistanceToNow(review.createdAt, { addSuffix: true, locale: pl })}
                      </span>
                    </div>
                  </div>
                  {review.review && (
                    <p style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 16, lineHeight: 1.6, color: A.text2, margin: 0 }}>{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, textAlign: 'center', padding: '40px 0', textTransform: 'uppercase', borderTop: `1px solid ${A.border}`, borderBottom: `1px solid ${A.border}` }}>
              {user ? 'BRAK INNYCH RECENZJI. BĄDŹ PIERWSZY.' : 'BRAK RECENZJI.'}
            </p>
          );
        })()}
      </div>
    </div>
  );
};
