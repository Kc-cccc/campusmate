import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  isConfigured: boolean;
}

function readConfig() {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  };
}

function hasConfig(config: ReturnType<typeof readConfig>): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function getFirebaseServices(): FirebaseServices {
  const config = readConfig();
  if (!hasConfig(config)) {
    return { app: null, auth: null, db: null, isConfigured: false };
  }

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  if (!app) {
    return { app: null, auth: null, db: null, isConfigured: false };
  }
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    isConfigured: true
  };
}
