import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
}

class RolesService {
  // Get user role
  async getUserRole(uid: string): Promise<UserRole> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return userDoc.data().role || 'user';
      }
      
      return 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  }

  // Get full user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Create or update user profile on login
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
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        // Existing user - update last login
        await setDoc(
          userRef,
          {
            lastLogin: new Date(),
            displayName, // Update display name if changed
            photoURL: photoURL || '', // Update photo if changed
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
    }
  }

  // Update user role (admin only)
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role }, { merge: true });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Check if user is admin
  async isAdmin(uid: string): Promise<boolean> {
    const role = await this.getUserRole(uid);
    return role === 'admin';
  }
}

export const rolesService = new RolesService();
