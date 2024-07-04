// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { connectAuthEmulator, getAuth } from 'firebase/auth';


const setupFirebase = async () => {
  console.log('Setting up Firebase');


  const firebaseConfig = {
    apiKey: 'AIzaSyCIooYtFaWQ_li4P0WvhNwxb5BXpy5g9W0',
    authDomain: 'stargirlology.firebaseapp.com',
    databaseURL: 'https://stargirlology-default-rtdb.firebaseio.com',
    projectId: 'stargirlology',
    storageBucket: 'stargirlology.appspot.com',
    messagingSenderId: '818392779284',
    appId: '1:818392779284:web:415eb3b793337a25f1b501',
    measurementId: 'G-L9Y6EJ7D44',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  isSupported().then((supported) => {
    if (!supported) return;
    getAnalytics(app);
  });

  const db = getDatabase();
  const auth = getAuth();
  if (location && location.hostname === 'localhost') {
    console.log('Running db on localhost');
    // Point to the RTDB emulator running on localhost.
    connectDatabaseEmulator(db, '127.0.0.1', 9000);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  }
}

export default function() {
  if (window) {
    console.log('have window');
    if (window.navigator) {
      console.log('have navigator');
      if (window.navigator.userAgent) {
        console.log('have userAgent');
      } else {
        console.log('no userAgent');
      }
    } else {
      console.log('no navigator');
    }
  } else {
    console.log('no window');
  }

  const clientOnly = (func: VoidFunction) => {
    if (!window) return;
    func();
  };

  clientOnly(() => {
    setupFirebase();
  });

  return {
    clientOnly,
  };
}