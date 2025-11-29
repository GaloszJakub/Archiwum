# Firebase Service Migration Guide

This guide shows how to migrate from direct Firebase imports to the new `FirebaseService` abstraction.

## Benefits of Migration

1. **Centralized Error Handling**: All Firebase errors are transformed to `APIError` instances
2. **Type Safety**: All methods have explicit TypeScript types
3. **Consistent API**: Uniform interface for all Firebase operations
4. **Easier Testing**: Service can be mocked for testing
5. **Better Maintainability**: Changes to Firebase logic only need to be made in one place

## Migration Examples

### Authentication

**Before:**
```typescript
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Sign in
const result = await signInWithPopup(auth, googleProvider);
const user = result.user;

// Sign out
await firebaseSignOut(auth);
```

**After:**
```typescript
import { firebaseService } from '@/services/api/FirebaseService';

// Sign in
const user = await firebaseService.signInWithGoogle();

// Sign out
await firebaseService.signOut();
```

### User Roles

**Before:**
```typescript
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get user role
const userDoc = await getDoc(doc(db, 'users', uid));
const role = userDoc.exists() ? userDoc.data().role : 'user';

// Update role
await setDoc(doc(db, 'users', uid), { role: 'admin' }, { merge: true });
```

**After:**
```typescript
import { firebaseService } from '@/services/api/FirebaseService';

// Get user role
const role = await firebaseService.getUserRole(uid);

// Update role
await firebaseService.updateUserRole(uid, 'admin');
```

### Collections

**Before:**
```typescript
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { collectionsService } from '@/lib/collections';

// Create collection
const collectionsRef = collection(db, 'users', userId, 'collections');
const docRef = await addDoc(collectionsRef, {
  name: 'My Favorites',
  description: 'Movies I love',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  itemCount: 0,
});

// Get collections
const collections = await collectionsService.getUserCollections(userId);
```

**After:**
```typescript
import { firebaseService } from '@/services/api/FirebaseService';

// Create collection
const collectionId = await firebaseService.createCollection(
  userId,
  'My Favorites',
  'Movies I love'
);

// Get collections
const collections = await firebaseService.getUserCollections(userId);
```

### Reviews

**Before:**
```typescript
import { doc, setDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reviewsService } from '@/lib/reviews';

// Add review
const reviewId = `${tmdbId}_${type}_${userId}`;
await setDoc(doc(db, 'reviews', reviewId), {
  tmdbId,
  type,
  userId,
  userName,
  rating,
  review,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
}, { merge: true });

// Get reviews
const reviews = await reviewsService.getReviews(tmdbId, type);
```

**After:**
```typescript
import { firebaseService } from '@/services/api/FirebaseService';

// Add review
await firebaseService.addReview(tmdbId, type, userId, userName, rating, review);

// Get reviews
const reviews = await firebaseService.getReviews(tmdbId, type);
```

### Episodes/Links

**Before:**
```typescript
import { doc, setDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { episodesService } from '@/lib/episodes';

// Add episode link
await episodesService.addEpisodeLink(
  tmdbId,
  seasonNumber,
  episodeNumber,
  link,
  userId,
  { title, quality, language }
);

// Get season episodes
const episodes = await episodesService.getSeasonEpisodes(tmdbId, seasonNumber);
```

**After:**
```typescript
import { firebaseService } from '@/services/api/FirebaseService';

// Add episode link
await firebaseService.addLink(tmdbId, 'tv', link, userId, {
  seasonNumber,
  episodeNumber,
  title,
  quality,
  language,
});

// Get season episodes
const episodes = await firebaseService.getSeasonEpisodes(tmdbId, seasonNumber);
```

## Error Handling

**Before:**
```typescript
try {
  await someFirebaseOperation();
} catch (error) {
  console.error('Firebase error:', error);
  // Error handling is inconsistent
}
```

**After:**
```typescript
import { APIError } from '@/utils/errors/APIError';

try {
  await firebaseService.someOperation();
} catch (error) {
  if (APIError.isAPIError(error)) {
    console.error('Error code:', error.code);
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    // Consistent error structure
  }
}
```

## Migration Checklist

- [ ] Replace direct Firebase auth imports with `firebaseService` methods
- [ ] Replace `collectionsService` calls with `firebaseService` methods
- [ ] Replace `reviewsService` calls with `firebaseService` methods
- [ ] Replace `episodesService` calls with `firebaseService` methods
- [ ] Replace `rolesService` calls with `firebaseService` methods
- [ ] Update error handling to use `APIError`
- [ ] Remove unused imports from `@/lib/firebase`, `@/lib/collections`, etc.
- [ ] Test all Firebase operations still work correctly

## Next Steps

After migrating to `FirebaseService`:

1. The old service files (`collections.ts`, `reviews.ts`, `episodes.ts`, `roles.ts`) can be deprecated
2. Update `AuthContext` to use `firebaseService`
3. Update all components that directly import Firebase functions
4. Add unit tests for components using the service (easier to mock)

## Notes

- The `FirebaseService` maintains backward compatibility with existing data structures
- All methods return the same types as before, just with better error handling
- The service is a singleton, so you always import the same instance
- TypeScript will help catch any migration issues at compile time
