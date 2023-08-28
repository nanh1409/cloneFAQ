import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore'

// const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
// const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : {};

// const firebaseConfig = {
//   apiKey,
//   ...config,
// };

// export const app = initializeApp(firebaseConfig);
// export const firestore = getFirestore(app);

export default class FirebaseClient {
  private static app: FirebaseApp;
  private static getApp() {
    if (!this.app) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) return null;
      const firebaseOptions: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: `${projectId}.firebaseapp.com`,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        projectId,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      }
      const databaseName = process.env.NEXT_PUBLIC_FIREBASE_DB_NAME;
      if (databaseName) firebaseOptions.databaseURL = `https://${databaseName}.firebaseio.com`;
      try {
        this.app = initializeApp(firebaseOptions);
      } catch (error) { 
        console.error("Cannot init Firebase App");
      }
    }
    return this.app || null;
  }
  public static getFirestore() {
    const app = this.getApp();
    return app ? getFirestore(app) : null;
  }
}