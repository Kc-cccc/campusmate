import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import type { UserProfile } from '../types/models';
import { demoUserId } from '../data/seed';
import { getFirebaseServices } from './firebase';

export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  const { auth, isConfigured } = getFirebaseServices();
  if (isConfigured && auth) {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return {
      id: credential.user.uid,
      name: credential.user.displayName || 'Student',
      email: credential.user.email || email.trim(),
      isGuest: false
    };
  }

  return {
    id: demoUserId,
    name: 'Demo Student',
    email: email.trim(),
    isGuest: false
  };
}

export async function signUpWithEmail(email: string, password: string): Promise<UserProfile> {
  const { auth, isConfigured } = getFirebaseServices();
  if (isConfigured && auth) {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    return {
      id: credential.user.uid,
      name: 'Student',
      email: credential.user.email || email.trim(),
      isGuest: false
    };
  }

  return {
    id: demoUserId,
    name: 'Demo Student',
    email: email.trim(),
    isGuest: false
  };
}

export async function signOutUser(): Promise<void> {
  const { auth, isConfigured } = getFirebaseServices();
  if (isConfigured && auth) {
    await firebaseSignOut(auth);
  }
}

export function createGuestProfile(): UserProfile {
  return {
    id: demoUserId,
    name: 'Guest Student',
    email: 'guest@campusmate.local',
    isGuest: true
  };
}
