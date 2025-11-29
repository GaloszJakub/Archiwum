import { useState } from 'react';
import { Star, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews, useUserReview, useAverageRating, useAddReview, useDeleteReview } from '@/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ReviewsSectionProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  mediaTitle?: string;
}

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

  // Debug
  console.log('Reviews data:', reviews);
  console.log('User ID:', user?.uid);
  console.log('Reviews loading:', reviewsLoading);

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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (readonly ? value : (hoverRating || value))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-background-secondary rounded-xl p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recenzje</h2>
          {averageData && averageData.count > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageData.average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageData.average.toFixed(1)}</span>
              <span className="text-sm text-foreground-secondary">
                ({averageData.count} {averageData.count === 1 ? 'recenzja' : 'recenzji'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User's Review Form */}
      {user && (
        <div className="border border-border rounded-lg p-4 space-y-4">
          {userReview && !isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Twoja recenzja</p>
                  <StarRating value={userReview.rating} readonly />
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleEdit}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {userReview.review && (
                <p className="text-foreground-secondary">{userReview.review}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Twoja ocena</p>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Recenzja (opcjonalnie)</p>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Podziel się swoją opinią..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-foreground-secondary mt-1">
                  {reviewText.length}/500 znaków
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || addReview.isPending}
                >
                  {userReview ? 'Zaktualizuj' : 'Dodaj recenzję'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setRating(0);
                      setReviewText('');
                    }}
                  >
                    Anuluj
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Wszystkie recenzje</h3>
        {reviewsLoading ? (
          <p className="text-center text-foreground-secondary py-8">Ładowanie recenzji...</p>
        ) : (() => {
          const otherReviews = reviews?.filter((review) => review.userId !== user?.uid) || [];
          console.log('Other reviews after filter:', otherReviews);
          
          return otherReviews.length > 0 ? (
            otherReviews.map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.rating} readonly />
                      <span className="text-xs text-foreground-secondary">
                        {formatDistanceToNow(review.createdAt, { addSuffix: true, locale: pl })}
                      </span>
                    </div>
                  </div>
                </div>
                {review.review && (
                  <p className="text-foreground-secondary">{review.review}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-foreground-secondary py-8">
              {user ? 'Brak innych recenzji. Bądź pierwszy!' : 'Brak recenzji'}
            </p>
          );
        })()}
      </div>
    </div>
  );
};
