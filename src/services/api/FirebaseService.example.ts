/**
 * FirebaseService Usage Examples
 * 
 * This file demonstrates how to use the FirebaseService abstraction
 * instead of directly importing Firebase functions.
 */

import { firebaseService } from './FirebaseService';

// ============================================================================
// Authentication Examples
// ============================================================================

async function exampleSignIn() {
  try {
    const user = await firebaseService.signInWithGoogle();
    console.log('Signed in:', user.email);
  } catch (error) {
    console.error('Sign in failed:', error);
  }
}

async function exampleSignOut() {
  try {
    await firebaseService.signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

// ============================================================================
// User Profile Examples
// ============================================================================

async function exampleGetUserProfile(userId: string) {
  try {
    const profile = await firebaseService.getUserProfile(userId);
    if (profile) {
      console.log('User role:', profile.role);
      console.log('Last login:', profile.lastLogin);
    }
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
}

async function exampleCheckAdmin(userId: string) {
  const isAdmin = await firebaseService.isAdmin(userId);
  console.log('Is admin:', isAdmin);
}

// ============================================================================
// Collections Examples
// ============================================================================

async function exampleCreateCollection(userId: string) {
  try {
    const collectionId = await firebaseService.createCollection(
      userId,
      'My Favorites',
      'Movies and shows I love'
    );
    console.log('Created collection:', collectionId);
  } catch (error) {
    console.error('Failed to create collection:', error);
  }
}

async function exampleAddToCollection(userId: string, collectionId: string) {
  try {
    await firebaseService.addItemToCollection(userId, collectionId, {
      tmdbId: 550, // Fight Club
      type: 'movie',
      title: 'Fight Club',
      posterPath: '/path/to/poster.jpg',
    });
    console.log('Added item to collection');
  } catch (error) {
    console.error('Failed to add item:', error);
  }
}

async function exampleGetCollectionItems(userId: string, collectionId: string) {
  try {
    const items = await firebaseService.getCollectionItems(userId, collectionId);
    console.log('Collection has', items.length, 'items');
    items.forEach(item => {
      console.log('-', item.title, `(${item.type})`);
    });
  } catch (error) {
    console.error('Failed to get items:', error);
  }
}

// ============================================================================
// Reviews Examples
// ============================================================================

async function exampleAddReview(userId: string, userName: string) {
  try {
    await firebaseService.addReview(
      550, // Fight Club
      'movie',
      userId,
      userName,
      5, // 5 stars
      'Amazing movie! A masterpiece of cinema.'
    );
    console.log('Review added');
  } catch (error) {
    console.error('Failed to add review:', error);
  }
}

async function exampleGetReviews() {
  try {
    const reviews = await firebaseService.getReviews(550, 'movie');
    console.log('Found', reviews.length, 'reviews');
    
    const { average, count } = await firebaseService.getAverageRating(550, 'movie');
    console.log(`Average rating: ${average.toFixed(1)} (${count} reviews)`);
  } catch (error) {
    console.error('Failed to get reviews:', error);
  }
}

// ============================================================================
// Episodes/Links Examples
// ============================================================================

async function exampleAddEpisodeLink(userId: string) {
  try {
    await firebaseService.addLink(
      1396, // Breaking Bad
      'tv',
      'https://example.com/stream/bb-s01e01',
      userId,
      {
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Pilot',
        quality: '1080p',
        language: 'EN',
      }
    );
    console.log('Episode link added');
  } catch (error) {
    console.error('Failed to add link:', error);
  }
}

async function exampleGetSeasonEpisodes() {
  try {
    const episodes = await firebaseService.getSeasonEpisodes(1396, 1);
    console.log('Season 1 has', episodes.length, 'episodes with links');
    episodes.forEach(ep => {
      console.log(`- S${ep.seasonNumber}E${ep.episodeNumber}: ${ep.title}`);
    });
  } catch (error) {
    console.error('Failed to get episodes:', error);
  }
}

async function exampleAddMovieLink(userId: string) {
  try {
    await firebaseService.addLink(
      550, // Fight Club
      'movie',
      'https://example.com/stream/fight-club',
      userId,
      {
        quality: '1080p',
        language: 'EN',
      }
    );
    console.log('Movie link added');
  } catch (error) {
    console.error('Failed to add movie link:', error);
  }
}

// ============================================================================
// Error Handling Example
// ============================================================================

async function exampleErrorHandling(userId: string, collectionId: string) {
  try {
    // Try to add duplicate item
    await firebaseService.addItemToCollection(userId, collectionId, {
      tmdbId: 550,
      type: 'movie',
      title: 'Fight Club',
      posterPath: '/path/to/poster.jpg',
    });
  } catch (error) {
    // All errors are transformed to APIError
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      // You can check error.code, error.statusCode, etc.
    }
  }
}

// Export examples for documentation purposes
export {
  exampleSignIn,
  exampleSignOut,
  exampleGetUserProfile,
  exampleCheckAdmin,
  exampleCreateCollection,
  exampleAddToCollection,
  exampleGetCollectionItems,
  exampleAddReview,
  exampleGetReviews,
  exampleAddEpisodeLink,
  exampleGetSeasonEpisodes,
  exampleAddMovieLink,
  exampleErrorHandling,
};
