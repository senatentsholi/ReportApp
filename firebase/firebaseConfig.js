import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCVsnfeia6yWXjSx9zCso5bf9HQuPPcmlw',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'luct-faculty-reporting-system.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'luct-faculty-reporting-system',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'luct-faculty-reporting-system.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '532901096118',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:532901096118:web:dce58ed1b9d93a02ee5417',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

function buildAuth() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export { firebaseConfig, app };
export const firebaseAuth = buildAuth();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
