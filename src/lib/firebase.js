import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const db = apiKey
  ? getDatabase(
      getApps().length
        ? getApps()[0]
        : initializeApp({
            apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
          })
    )
  : null;
