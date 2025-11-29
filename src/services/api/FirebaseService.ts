/**
 * Firebase Service Abstraction
 * 
 * Provides a centralized service layer for all Firebase operations including:
 * - Authentication (Google Sign-in, Sign-out)
 * - Firestore operations (Collections, Reviews, Episodes, User Roles)
 * - Consistent error handling
 * - Proper TypeScript typing
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { APIError, APIErrorCode } from '@/utils/errors/APIError';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User role types
 */
export type UserRole = 'user' | 'admin';

/**
 * Media type for collections and episodes
 */
export type MediaType = 'movie' | 'tv';

/**
 * User profile stored in Firestore
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
}

/**
 * Collection item in a user's collection
 */
export interface CollectionItem {
  id: string;
  tmdbId: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: Date;
}

/**
 * User collection metadata
 */
export interface UserCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
}

/**
 * Review for a movie or TV show
 */
export interface Review {
  id: string;
  tmdbId: number;
  type: MediaType;
  userId: string;
  userName: string;
  rating: number; // 0-5
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Streaming link for an episode or movie
 */
export interface StreamingLink {
  provider: string;
  url: string;
  quality?: string;
  version?: string;
  dateAdded?: string;
}

/**
 * Episode or movie link data
 */
export interface Episode {
  id: string;
  tmdbId: number;
  type: MediaType;
  seasonNumber?: number;
  episodeNumber?: number;
  title?: string;
  link: string; // Legacy single link
  links?: StreamingLink[]; // Multiple streaming links
  quality?: string;
  language?: string;
  addedBy: string;
  addedAt: Date;
  updatedAt: Date;
}

/**
 * Options for adding a link
 */
export interface AddLinkOptions {
  seasonNumber?: number;
  episodeNumber?: number;
  title?: string;
  quality?: string;
  language?: string;
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Transform Firebase errors into APIError instances
 */
function transformFirebaseError(error: unknown, operation: string): APIError {
  if (APIError.isAPIError(error)) {
    return error;
  }

  const err = error as { code?: string; message?: string };
  const errorCode = err.code || 'unknown';
  const errorMessage = err.message || 'An unknown error occurred';

  // Map Firebase error codes to APIError codes
  let apiErrorCode: APIErrorCode;
  let statusCode: number | null = null;

  switch (errorCode) {
    case 'permission-denied':
      apiErrorCode = APIErrorCode.FORBIDDEN;
      statusCode = 403;
      break;
    case 'unauthenticated':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      apiErrorCode = APIErrorCode.UNAUTHORIZED;
      statusCode = 401;
      break;
    case 'not-found':
      apiErrorCode = APIErrorCode.NOT_FOUND;
      statusCode = 404;
      break;
    case 'invalid-argument':
    case 'failed-precondition':
      apiErrorCode = APIErrorCode.BAD_REQUEST;
      statusCode = 400;
      break;
    case 'unavailable':
    case 'deadline-exceeded':
      apiErrorCode = APIErrorCode.NETWORK_ERROR;
      break;
    default:
      apiErrorCode = APIErrorCode.UNKNOWN_ERROR;
  }

  return new APIError(
    `Firebase ${operation} failed: ${errorMessage}`,
    statusCode,
    apiErrorCode,
    { originalError: errorCode, operation }
  );
}

// ============================================================================
// Firebase Service Class
// ============================================================================

/**
 * Centralized Firebase service for all Firebase operations
 * Provides consistent error handling and TypeScript typing
 */
export class FirebaseService {
  // ==========================================================================
  // Authentication Methods
  // ==========================================================================

  /**
   * Sign in with Google
   * @throws {APIError} If sign-in fails
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw transformFirebaseError(error, 'sign-in');
    }
  }

  /**
   * Sign out the current user
   * @throws {APIError} If sign-out fails
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw transformFirebaseError(error, 'sign-out');
    }
  }

  /**
   * Subscribe to authentication state changes
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get the current authenticated user
   * @returns Current user or null
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // ==========================================================================
  // User Profile & Roles Methods
  // ==========================================================================

  /**
   * Get user role from Firestore
   * @param uid - User ID
   * @returns User role (defaults to 'user' if not found)
   */
  async getUserRole(uid: string): Promise<UserRole> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return (userDoc.data().role as UserRole) || 'user';
      }
      
      return 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  }

  /**
   * Get full user profile from Firestore
   * @param uid - User ID
   * @returns User profile or null if not found
   * @throws {APIError} If retrieval fails
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: (data.role as UserRole) || 'user',
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date(),
      };
    } catch (error) {
      throw transformFirebaseError(error, 'get user profile');
    }
  }

  /**
   * Initialize or update user profile on login
   * @param uid - User ID
   * @param email - User email
   * @param displayName - User display name
   * @param photoURL - User photo URL
   * @throws {APIError} If initialization fails
   */
  async initializeUserProfile(
    uid: string,
    email: string,
    displayName: string | null,
    photoURL?: string | null
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // New user - create profile with default role
        await setDoc(userRef, {
          uid,
          email,
          displayName,
          photoURL: photoURL || '',
          role: 'user',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
      } else {
        // Existing user - update last login
        await setDoc(
          userRef,
          {
            lastLogin: Timestamp.now(),
            displayName,
            photoURL: photoURL || '',
          },
          { merge: true }
        );
      }
    } catch (error) {
      throw transformFirebaseError(error, 'initialize user profile');
    }
  }

  /**
   * Update user role (admin only)
   * @param uid - User ID
   * @param role - New role
   * @throws {APIError} If update fails
   */
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role }, { merge: true });
    } catch (error) {
      throw transformFirebaseError(error, 'update user role');
    }
  }

  /**
   * Check if user is admin
   * @param uid - User ID
   * @returns True if user is admin
   */
  async isAdmin(uid: string): Promise<boolean> {
    const role = await this.getUserRole(uid);
    return role === 'admin';
  }

  // ==========================================================================
  // Collections Methods
  // ==========================================================================

  /**
   * Create a new collection
   * @param userId - User ID
   * @param name - Collection name
   * @param description - Optional description
   * @returns Collection ID
   * @throws {APIError} If creation fails
   */
  async createCollection(
    userId: string,
    name: string,
    description?: string
  ): Promise<string> {
    try {
      const collectionsRef = collection(db, 'users', userId, 'collections');
      const docRef = await addDoc(collectionsRef, {
        name,
        description: description || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        itemCount: 0,
      });
      return docRef.id;
    } catch (error) {
      throw transformFirebaseError(error, 'create collection');
    }
  }

  /**
   * Get all collections for a user
   * @param userId - User ID
   * @returns Array of user collections
   * @throws {APIError} If retrieval fails
   */
  async getUserCollections(userId: string): Promise<UserCollection[]> {
    try {
      const collectionsRef = collection(db, 'users', userId, 'collections');
      const snapshot = await getDocs(collectionsRef);
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        itemCount: doc.data().itemCount || 0,
      }));
    } catch (error) {
      throw transformFirebaseError(error, 'get user collections');
    }
  }

  /**
   * Add item to collection
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @param item - Item to add (without id and addedAt)
   * @throws {APIError} If addition fails or item already exists
   */
  async addItemToCollection(
    userId: string,
    collectionId: string,
    item: Omit<CollectionItem, 'id' | 'addedAt'>
  ): Promise<void> {
    try {
      const itemsRef = collection(
        db,
        'users',
        userId,
        'collections',
        collectionId,
        'items'
      );
      
      // Check if item already exists
      const q = query(
        itemsRef,
        where('tmdbId', '==', item.tmdbId),
        where('type', '==', item.type)
      );
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        throw new APIError(
          'Item already in collection',
          400,
          APIErrorCode.BAD_REQUEST,
          { tmdbId: item.tmdbId, type: item.type }
        );
      }

      await addDoc(itemsRef, {
        ...item,
        addedAt: Timestamp.now(),
      });

      // Update item count
      const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
      const collectionDoc = await getDoc(collectionRef);
      const currentCount = collectionDoc.data()?.itemCount || 0;
      
      await updateDoc(collectionRef, {
        itemCount: currentCount + 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (APIError.isAPIError(error)) {
        throw error;
      }
      throw transformFirebaseError(error, 'add item to collection');
    }
  }

  /**
   * Remove item from collection
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @param itemId - Item ID
   * @throws {APIError} If removal fails
   */
  async removeItemFromCollection(
    userId: string,
    collectionId: string,
    itemId: string
  ): Promise<void> {
    try {
      const itemRef = doc(
        db,
        'users',
        userId,
        'collections',
        collectionId,
        'items',
        itemId
      );
      await deleteDoc(itemRef);

      // Update item count
      const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
      const collectionDoc = await getDoc(collectionRef);
      const currentCount = collectionDoc.data()?.itemCount || 0;
      
      await updateDoc(collectionRef, {
        itemCount: Math.max(0, currentCount - 1),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw transformFirebaseError(error, 'remove item from collection');
    }
  }

  /**
   * Get items in a collection
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @returns Array of collection items
   * @throws {APIError} If retrieval fails
   */
  async getCollectionItems(
    userId: string,
    collectionId: string
  ): Promise<CollectionItem[]> {
    try {
      const itemsRef = collection(
        db,
        'users',
        userId,
        'collections',
        collectionId,
        'items'
      );
      const snapshot = await getDocs(itemsRef);
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        tmdbId: doc.data().tmdbId,
        type: doc.data().type,
        title: doc.data().title,
        posterPath: doc.data().posterPath,
        addedAt: doc.data().addedAt.toDate(),
      }));
    } catch (error) {
      throw transformFirebaseError(error, 'get collection items');
    }
  }

  /**
   * Check if item is in collection
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @returns True if item is in collection
   * @throws {APIError} If check fails
   */
  async isItemInCollection(
    userId: string,
    collectionId: string,
    tmdbId: number,
    type: MediaType
  ): Promise<boolean> {
    try {
      const itemsRef = collection(
        db,
        'users',
        userId,
        'collections',
        collectionId,
        'items'
      );
      const q = query(
        itemsRef,
        where('tmdbId', '==', tmdbId),
        where('type', '==', type)
      );
      const snapshot = await getDocs(q);
      
      return !snapshot.empty;
    } catch (error) {
      throw transformFirebaseError(error, 'check item in collection');
    }
  }

  /**
   * Delete a collection
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @throws {APIError} If deletion fails
   */
  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    try {
      // Delete all items first
      const itemsRef = collection(
        db,
        'users',
        userId,
        'collections',
        collectionId,
        'items'
      );
      const itemsSnapshot = await getDocs(itemsRef);
      
      const deletePromises = itemsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete collection
      const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
      await deleteDoc(collectionRef);
    } catch (error) {
      throw transformFirebaseError(error, 'delete collection');
    }
  }

  /**
   * Update collection metadata
   * @param userId - User ID
   * @param collectionId - Collection ID
   * @param updates - Fields to update
   * @throws {APIError} If update fails
   */
  async updateCollection(
    userId: string,
    collectionId: string,
    updates: { name?: string; description?: string }
  ): Promise<void> {
    try {
      const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
      await updateDoc(collectionRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw transformFirebaseError(error, 'update collection');
    }
  }

  // ==========================================================================
  // Reviews Methods
  // ==========================================================================

  /**
   * Add or update a review
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @param userId - User ID
   * @param userName - User display name
   * @param rating - Rating (0-5)
   * @param review - Review text
   * @throws {APIError} If operation fails
   */
  async addReview(
    tmdbId: number,
    type: MediaType,
    userId: string,
    userName: string,
    rating: number,
    review: string
  ): Promise<void> {
    try {
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
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      throw transformFirebaseError(error, 'add review');
    }
  }

  /**
   * Get user's review for a movie/series
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @param userId - User ID
   * @returns Review or null if not found
   * @throws {APIError} If retrieval fails
   */
  async getUserReview(
    tmdbId: number,
    type: MediaType,
    userId: string
  ): Promise<Review | null> {
    try {
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
    } catch (error) {
      throw transformFirebaseError(error, 'get user review');
    }
  }

  /**
   * Get all reviews for a movie/series
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @returns Array of reviews
   * @throws {APIError} If retrieval fails
   */
  async getReviews(tmdbId: number, type: MediaType): Promise<Review[]> {
    try {
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
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw transformFirebaseError(error, 'get reviews');
    }
  }

  /**
   * Delete a review
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @param userId - User ID
   * @throws {APIError} If deletion fails
   */
  async deleteReview(
    tmdbId: number,
    type: MediaType,
    userId: string
  ): Promise<void> {
    try {
      const reviewId = `${tmdbId}_${type}_${userId}`;
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);
    } catch (error) {
      throw transformFirebaseError(error, 'delete review');
    }
  }

  /**
   * Get average rating for a movie/series
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @returns Average rating and count
   * @throws {APIError} If calculation fails
   */
  async getAverageRating(
    tmdbId: number,
    type: MediaType
  ): Promise<{ average: number; count: number }> {
    try {
      const reviews = await this.getReviews(tmdbId, type);
      
      if (reviews.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return {
        average: sum / reviews.length,
        count: reviews.length,
      };
    } catch (error) {
      throw transformFirebaseError(error, 'get average rating');
    }
  }

  // ==========================================================================
  // Episodes/Links Methods
  // ==========================================================================

  /**
   * Add or update a link for a movie or episode
   * @param tmdbId - TMDB ID
   * @param type - Media type
   * @param link - Streaming link URL
   * @param userId - User ID who added the link
   * @param options - Additional options
   * @throws {APIError} If operation fails
   */
  async addLink(
    tmdbId: number,
    type: MediaType,
    link: string,
    userId: string,
    options?: AddLinkOptions
  ): Promise<void> {
    try {
      let episodeId: string;
      
      if (type === 'movie') {
        episodeId = `${tmdbId}_movie`;
      } else {
        episodeId = `${tmdbId}_s${options?.seasonNumber}_e${options?.episodeNumber}`;
      }
      
      const episodeRef = doc(db, 'episodes', episodeId);

      await setDoc(
        episodeRef,
        {
          tmdbId,
          type,
          seasonNumber: options?.seasonNumber || null,
          episodeNumber: options?.episodeNumber || null,
          title: options?.title || '',
          link,
          quality: options?.quality || '',
          language: options?.language || 'PL',
          addedBy: userId,
          addedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      throw transformFirebaseError(error, 'add link');
    }
  }

  /**
   * Get episode link
   * @param tmdbId - TMDB ID
   * @param seasonNumber - Season number
   * @param episodeNumber - Episode number
   * @returns Episode data or null if not found
   * @throws {APIError} If retrieval fails
   */
  async getEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<Episode | null> {
    try {
      const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
      const episodeRef = doc(db, 'episodes', episodeId);
      const episodeDoc = await getDoc(episodeRef);

      if (!episodeDoc.exists()) {
        return null;
      }

      const data = episodeDoc.data();
      return {
        id: episodeDoc.id,
        tmdbId: data.tmdbId,
        type: data.type || 'tv',
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
        title: data.title,
        link: data.link,
        links: data.links || [],
        quality: data.quality,
        language: data.language,
        addedBy: data.addedBy,
        addedAt: data.addedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      throw transformFirebaseError(error, 'get episode link');
    }
  }

  /**
   * Get all episodes for a season
   * @param tmdbId - TMDB ID
   * @param seasonNumber - Season number
   * @returns Array of episodes
   * @throws {APIError} If retrieval fails
   */
  async getSeasonEpisodes(tmdbId: number, seasonNumber: number): Promise<Episode[]> {
    try {
      const episodesRef = collection(db, 'episodes');
      const q = query(
        episodesRef,
        where('tmdbId', '==', tmdbId),
        where('seasonNumber', '==', seasonNumber),
        orderBy('episodeNumber', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tmdbId: data.tmdbId,
          type: data.type || 'tv',
          seasonNumber: data.seasonNumber,
          episodeNumber: data.episodeNumber,
          title: data.title,
          link: data.link,
          links: data.links || [],
          quality: data.quality,
          language: data.language,
          addedBy: data.addedBy,
          addedAt: data.addedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw transformFirebaseError(error, 'get season episodes');
    }
  }

  /**
   * Get all episodes for a series
   * @param tmdbId - TMDB ID
   * @returns Array of episodes
   * @throws {APIError} If retrieval fails
   */
  async getSeriesEpisodes(tmdbId: number): Promise<Episode[]> {
    try {
      const episodesRef = collection(db, 'episodes');
      const q = query(
        episodesRef,
        where('tmdbId', '==', tmdbId),
        orderBy('seasonNumber', 'asc'),
        orderBy('episodeNumber', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tmdbId: data.tmdbId,
          type: data.type || 'tv',
          seasonNumber: data.seasonNumber,
          episodeNumber: data.episodeNumber,
          title: data.title,
          link: data.link,
          links: data.links || [],
          quality: data.quality,
          language: data.language,
          addedBy: data.addedBy,
          addedAt: data.addedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw transformFirebaseError(error, 'get series episodes');
    }
  }

  /**
   * Delete episode link
   * @param tmdbId - TMDB ID
   * @param seasonNumber - Season number
   * @param episodeNumber - Episode number
   * @throws {APIError} If deletion fails
   */
  async deleteEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<void> {
    try {
      const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
      const episodeRef = doc(db, 'episodes', episodeId);
      await deleteDoc(episodeRef);
    } catch (error) {
      throw transformFirebaseError(error, 'delete episode link');
    }
  }

  /**
   * Check if episode has a link
   * @param tmdbId - TMDB ID
   * @param seasonNumber - Season number
   * @param episodeNumber - Episode number
   * @returns True if episode has a link
   */
  async hasEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<boolean> {
    try {
      const episode = await this.getEpisodeLink(tmdbId, seasonNumber, episodeNumber);
      return episode !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get movie links
   * @param tmdbId - TMDB ID
   * @returns Array of movie links
   * @throws {APIError} If retrieval fails
   */
  async getMovieLinks(tmdbId: number): Promise<Episode[]> {
    try {
      const episodesRef = collection(db, 'episodes');
      const q = query(
        episodesRef,
        where('tmdbId', '==', tmdbId),
        where('type', '==', 'movie')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tmdbId: data.tmdbId,
          type: data.type,
          seasonNumber: data.seasonNumber,
          episodeNumber: data.episodeNumber,
          title: data.title,
          link: data.link,
          links: data.links || [],
          quality: data.quality,
          language: data.language,
          addedBy: data.addedBy,
          addedAt: data.addedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      throw transformFirebaseError(error, 'get movie links');
    }
  }

  /**
   * Delete movie link
   * @param linkId - Link document ID
   * @throws {APIError} If deletion fails
   */
  async deleteMovieLink(linkId: string): Promise<void> {
    try {
      const episodeRef = doc(db, 'episodes', linkId);
      await deleteDoc(episodeRef);
    } catch (error) {
      throw transformFirebaseError(error, 'delete movie link');
    }
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

/**
 * Singleton instance of FirebaseService
 * Use this instance throughout the application for all Firebase operations
 */
export const firebaseService = new FirebaseService();
