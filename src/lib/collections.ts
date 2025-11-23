import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  Timestamp,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface CollectionItem {
  id: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  addedAt: Date;
}

export interface UserCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
}

class CollectionsService {
  // Create new collection
  async createCollection(userId: string, name: string, description?: string): Promise<string> {
    const collectionsRef = collection(db, 'users', userId, 'collections');
    const docRef = await addDoc(collectionsRef, {
      name,
      description: description || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      itemCount: 0
    });
    return docRef.id;
  }

  // Get all user collections
  async getUserCollections(userId: string): Promise<UserCollection[]> {
    const collectionsRef = collection(db, 'users', userId, 'collections');
    const snapshot = await getDocs(collectionsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      itemCount: doc.data().itemCount || 0
    }));
  }

  // Add item to collection
  async addItemToCollection(
    userId: string, 
    collectionId: string, 
    item: Omit<CollectionItem, 'id' | 'addedAt'>
  ): Promise<void> {
    const itemsRef = collection(db, 'users', userId, 'collections', collectionId, 'items');
    
    // Check if item already exists
    const q = query(itemsRef, where('tmdbId', '==', item.tmdbId), where('type', '==', item.type));
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      throw new Error('Item already in collection');
    }

    await addDoc(itemsRef, {
      ...item,
      addedAt: Timestamp.now()
    });

    // Update item count
    const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
    const collectionDoc = await getDoc(collectionRef);
    const currentCount = collectionDoc.data()?.itemCount || 0;
    
    await updateDoc(collectionRef, {
      itemCount: currentCount + 1,
      updatedAt: Timestamp.now()
    });
  }

  // Remove item from collection
  async removeItemFromCollection(
    userId: string, 
    collectionId: string, 
    itemId: string
  ): Promise<void> {
    const itemRef = doc(db, 'users', userId, 'collections', collectionId, 'items', itemId);
    await deleteDoc(itemRef);

    // Update item count
    const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
    const collectionDoc = await getDoc(collectionRef);
    const currentCount = collectionDoc.data()?.itemCount || 0;
    
    await updateDoc(collectionRef, {
      itemCount: Math.max(0, currentCount - 1),
      updatedAt: Timestamp.now()
    });
  }

  // Get items in collection
  async getCollectionItems(userId: string, collectionId: string): Promise<CollectionItem[]> {
    const itemsRef = collection(db, 'users', userId, 'collections', collectionId, 'items');
    const snapshot = await getDocs(itemsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      tmdbId: doc.data().tmdbId,
      type: doc.data().type,
      title: doc.data().title,
      posterPath: doc.data().posterPath,
      addedAt: doc.data().addedAt.toDate()
    }));
  }

  // Check if item is in collection
  async isItemInCollection(
    userId: string, 
    collectionId: string, 
    tmdbId: number, 
    type: 'movie' | 'tv'
  ): Promise<boolean> {
    const itemsRef = collection(db, 'users', userId, 'collections', collectionId, 'items');
    const q = query(itemsRef, where('tmdbId', '==', tmdbId), where('type', '==', type));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty;
  }

  // Delete collection
  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    // Delete all items first
    const itemsRef = collection(db, 'users', userId, 'collections', collectionId, 'items');
    const itemsSnapshot = await getDocs(itemsRef);
    
    const deletePromises = itemsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete collection
    const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
    await deleteDoc(collectionRef);
  }

  // Update collection
  async updateCollection(
    userId: string, 
    collectionId: string, 
    updates: { name?: string; description?: string }
  ): Promise<void> {
    const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
    await updateDoc(collectionRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }
}

export const collectionsService = new CollectionsService();
