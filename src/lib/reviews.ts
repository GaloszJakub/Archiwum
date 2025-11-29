import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Review {
  id: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  userId: string;
  userName: string;
  rating: number; // 0-5
  review: string;
  mediaTitle?: string; // Optional: title of movie/series
  createdAt: Date;
  updatedAt: Date;
}

class ReviewsService {
  // Add or update review
  async addReview(
    tmdbId: number,
    type: 'movie' | 'tv',
    userId: string,
    userName: string,
    rating: number,
    review: string,
    mediaTitle?: string
  ): Promise<void> {
    const reviewId = `${tmdbId}_${type}_${userId}`;
    const reviewRef = doc(db, 'reviews', reviewId);

    await setDoc(
      reviewRef,
      {
        tmdbId,
        type,
        userId,
        userName,
        rating,
        review,
        mediaTitle: mediaTitle || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  }

  // Get user's review for a movie/series
  async getUserReview(
    tmdbId: number,
    type: 'movie' | 'tv',
    userId: string
  ): Promise<Review | null> {
    const reviewId = `${tmdbId}_${type}_${userId}`;
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      return null;
    }

    const data = reviewDoc.data();
    return {
      id: reviewDoc.id,
      tmdbId: data.tmdbId,
      type: data.type,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      review: data.review,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  // Get all reviews for a movie/series
  async getReviews(tmdbId: number, type: 'movie' | 'tv'): Promise<Review[]> {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('tmdbId', '==', tmdbId),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tmdbId: data.tmdbId,
        type: data.type,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        review: data.review,
        mediaTitle: data.mediaTitle,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  }

  // Delete review
  async deleteReview(tmdbId: number, type: 'movie' | 'tv', userId: string): Promise<void> {
    const reviewId = `${tmdbId}_${type}_${userId}`;
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  }

  // Get average rating
  async getAverageRating(tmdbId: number, type: 'movie' | 'tv'): Promise<{ average: number; count: number }> {
    const reviews = await this.getReviews(tmdbId, type);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: sum / reviews.length,
      count: reviews.length,
    };
  }

  // Get user's reviews
  async getUserReviews(userId: string): Promise<Review[]> {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId));
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tmdbId: data.tmdbId,
        type: data.type,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        review: data.review,
        mediaTitle: data.mediaTitle,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    // Sort in memory
    return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const reviewsService = new ReviewsService();
