// Import the functions you need from the SDKs you need
import { initializeApp  } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import * as modAuth from 'firebase/auth';
import * as modDb from 'firebase/database';
import SGUSer from '~/model/user/SGUser';
import SGUserAcl from '~/model/user/SGUserAcl';

type ClientOnlyFunc = (args: {
  modAuth: typeof modAuth;
  modDb: typeof modDb;
}) => void;

let isInitialized = false;
const fbUser = ref<SGUSer>(SGUSer.newUnInitializedUser());

const setupFirebase = async () => {
  // eslint-disable-next-line no-console
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
  const db = getDatabase();
  const auth = getAuth(app);
  if (location && location.hostname === 'localhost') {
    // eslint-disable-next-line no-console
    console.log('Running db on localhost');
    // Point to the RTDB emulator running on localhost.
    try {
      // modAuth.initializeAuth(app);
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
      connectDatabaseEmulator(db, '127.0.0.1', 9000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('=========== Error connecting to emulator ==================', e);
    }
  }

  isSupported().then((supported) => {
    if (!supported) return;
    getAnalytics(app);
  });
};

const setupUser = (fbUser: Ref<SGUSer>) => {
  const auth = modAuth.getAuth();
  const onChange = async (user: modAuth.User | null) => {
    if (user) {
      const aclRef = modDb.ref(modDb.getDatabase(), DbPath.user(user.uid));
      const snap = await modDb.get(aclRef);
      const acl = new SGUserAcl(snap.val() || {});

      fbUser.value = new SGUSer({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        acl,
      });
      // ...
    } else {
      fbUser.value = SGUSer.newGuestUser();
    }
  };
  modAuth.onAuthStateChanged(auth, onChange);
  modAuth.onIdTokenChanged(auth, onChange);
};

/** Run when this code is run in the browser */
const inClient = (func: ClientOnlyFunc) => {
  if (!window) return;
  func({ modAuth, modDb });
};

/** Run when this code is run during generation */
const outOfClient = (func: VoidFunction) => {
  if (window) return;
  func();
};

export default function () {
  inClient(() => {
    if (isInitialized) return;
    console.log('initializing firebase');
    isInitialized = true;

    setupFirebase();
    setupUser(fbUser);
  });

  return {
    inClient,
    outOfClient,
    fbUser,
  };
}
