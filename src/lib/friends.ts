import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  userId: string;
  userName: string;
  email: string;
  addedAt: Date;
}

class FriendsService {
  // Send friend request
  async sendFriendRequest(
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    toUserName: string
  ): Promise<void> {
    const requestId = `${fromUserId}_${toUserId}`;
    const requestRef = doc(db, 'friendRequests', requestId);

    // Check if pending request already exists
    const existing = await getDoc(requestRef);
    if (existing.exists() && existing.data().status === 'pending') {
      throw new Error('Zaproszenie już zostało wysłane');
    }

    // If request exists but was rejected/accepted, overwrite it
    // This allows re-sending invitations after unfriending
    await setDoc(requestRef, {
      fromUserId,
      fromUserName,
      toUserId,
      toUserName,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  // Accept friend request
  async acceptFriendRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      const requestDoc = await getDoc(requestRef);

      if (!requestDoc.exists()) {
        throw new Error('Zaproszenie nie istnieje');
      }

      const data = requestDoc.data();

      // Get user emails from users collection
      const fromUserDoc = await getDoc(doc(db, 'users', data.fromUserId));
      const toUserDoc = await getDoc(doc(db, 'users', data.toUserId));

      const fromUserEmail = fromUserDoc.exists() ? fromUserDoc.data().email || '' : '';
      const toUserEmail = toUserDoc.exists() ? toUserDoc.data().email || '' : '';

      // Add to both users' friends lists
      const friend1Ref = doc(db, 'users', data.fromUserId, 'friends', data.toUserId);
      const friend2Ref = doc(db, 'users', data.toUserId, 'friends', data.fromUserId);

      await Promise.all([
        setDoc(friend1Ref, {
          userId: data.toUserId,
          userName: data.toUserName,
          email: toUserEmail,
          addedAt: Timestamp.now(),
        }),
        setDoc(friend2Ref, {
          userId: data.fromUserId,
          userName: data.fromUserName,
          email: fromUserEmail,
          addedAt: Timestamp.now(),
        }),
      ]);

      // Update request status (do this last so if it fails, friends aren't added)
      await setDoc(
        requestRef,
        {
          status: 'accepted',
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  }

  // Reject friend request
  async rejectFriendRequest(requestId: string): Promise<void> {
    const requestRef = doc(db, 'friendRequests', requestId);
    await setDoc(
      requestRef,
      {
        status: 'rejected',
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  }

  // Cancel friend request (delete it)
  async cancelFriendRequest(requestId: string): Promise<void> {
    const requestRef = doc(db, 'friendRequests', requestId);
    await deleteDoc(requestRef);
  }

  // Remove friend
  async removeFriend(userId: string, friendId: string): Promise<void> {
    try {
      const friend1Ref = doc(db, 'users', userId, 'friends', friendId);
      const friend2Ref = doc(db, 'users', friendId, 'friends', userId);

      // Delete from both users' friends lists
      await Promise.all([
        deleteDoc(friend1Ref),
        deleteDoc(friend2Ref)
      ]);

      // Also delete any friend requests
      const request1Id = `${userId}_${friendId}`;
      const request2Id = `${friendId}_${userId}`;

      // Try to delete requests, but don't fail if they don't exist
      try {
        await deleteDoc(doc(db, 'friendRequests', request1Id));
      } catch (e) {
        // Request already deleted
      }

      try {
        await deleteDoc(doc(db, 'friendRequests', request2Id));
      } catch (e) {
        // Request already deleted
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }

  // Get user's friends
  async getFriends(userId: string): Promise<Friend[]> {
    const friendsRef = collection(db, 'users', userId, 'friends');
    const snapshot = await getDocs(friendsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userId: data.userId,
        userName: data.userName,
        email: data.email || '',
        addedAt: data.addedAt?.toDate() || new Date(),
      };
    });
  }

  // Get pending friend requests (received)
  async getPendingRequests(userId: string): Promise<FriendRequest[]> {
    try {
      const requestsRef = collection(db, 'friendRequests');
      const q = query(
        requestsRef,
        where('toUserId', '==', userId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          toUserId: data.toUserId,
          toUserName: data.toUserName,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      
      // Sort in memory instead of in query
      return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error getting pending requests:', error);
      throw error;
    }
  }

  // Get sent friend requests
  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    try {
      const requestsRef = collection(db, 'friendRequests');
      const q = query(
        requestsRef,
        where('fromUserId', '==', userId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          toUserId: data.toUserId,
          toUserName: data.toUserName,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      
      // Sort in memory instead of in query
      return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error getting sent requests:', error);
      throw error;
    }
  }

  // Search users by name
  async searchUsers(searchTerm: string, currentUserId: string): Promise<Array<{ uid: string; displayName: string; email: string; photoURL?: string; isFriend?: boolean; hasPendingRequest?: boolean }>> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      // Get current friends
      const friendsRef = collection(db, 'users', currentUserId, 'friends');
      const friendsSnapshot = await getDocs(friendsRef);
      const friendIds = new Set(friendsSnapshot.docs.map(doc => doc.id));

      // Get pending requests (both sent and received)
      const requestsRef = collection(db, 'friendRequests');
      const sentQuery = query(
        requestsRef,
        where('fromUserId', '==', currentUserId),
        where('status', '==', 'pending')
      );
      const receivedQuery = query(
        requestsRef,
        where('toUserId', '==', currentUserId),
        where('status', '==', 'pending')
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);

      const pendingUserIds = new Set([
        ...sentSnapshot.docs.map(doc => doc.data().toUserId),
        ...receivedSnapshot.docs.map(doc => doc.data().fromUserId)
      ]);

      const searchLower = searchTerm.toLowerCase();
      
      return snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          const name = (data.displayName || '').toLowerCase();
          const email = (data.email || '').toLowerCase();
          
          return (
            doc.id !== currentUserId &&
            (name.includes(searchLower) || email.includes(searchLower))
          );
        })
        .map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || 'Brak nazwy',
            email: data.email || '',
            photoURL: data.photoURL || '',
            isFriend: friendIds.has(doc.id),
            hasPendingRequest: pendingUserIds.has(doc.id),
          };
        })
        .slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Check if users are friends
  async areFriends(userId: string, friendId: string): Promise<boolean> {
    const friendRef = doc(db, 'users', userId, 'friends', friendId);
    const friendDoc = await getDoc(friendRef);
    return friendDoc.exists();
  }

  // Check if friend request exists
  async hasPendingRequest(fromUserId: string, toUserId: string): Promise<boolean> {
    const requestId = `${fromUserId}_${toUserId}`;
    const requestRef = doc(db, 'friendRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) return false;
    
    return requestDoc.data().status === 'pending';
  }
}

export const friendsService = new FriendsService();
