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
}) => void | Promise<void>;

type OutOfClientFunc = () => void | Promise<void>;

let isInitialized = false;
const fbUser = ref<SGUSer>(SGUSer.newUnInitializedUser());
const userIsLoggedIn = computed(() => fbUser.value.uid !== '');
const userIsInitialized = computed(() => !fbUser.value.isUninitialized());

watch(userIsInitialized, (isInitialized) => {
  // eslint-disable-next-line no-console
  console.log('User is initalized', isInitialized);
});

watch(userIsLoggedIn, (isLoggedIn) => {
  // eslint-disable-next-line no-console
  console.log('User is logged in', isLoggedIn);
});

const setupUser = () => {
  // listen for changes to the user
  const onChange = async (user: modAuth.User | null) => {
    if (user !== null) {
      // eslint-disable-next-line no-console
      console.log('User changed', user.email);
    } else {
      // eslint-disable-next-line no-console
      console.log('User changed', user);
    }

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

  // eslint-disable-next-line no-console
  console.log('Setting up user');
  const auth = modAuth.getAuth();
  modAuth.onAuthStateChanged(auth, onChange);
  modAuth.onIdTokenChanged(auth, onChange);
};

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

  // Setup the user so its ready for authorization
  setupUser();

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


/** Wait for the user to be initialized (useful to avoid flicker) */
const waitForInitailization = new Promise<void>((resolve) => {
  watch(userIsInitialized, () => {
    resolve();
  }, { once: true });
});

/** Run when this code is run in the browser */
const inClient = async (func: ClientOnlyFunc): Promise<void> => {
  if (!window) return Promise.resolve();
  await waitForInitailization;
  return await func({ modAuth, modDb });
};

/** Run when this code is run during generation */
const outOfClient = async (func: OutOfClientFunc): Promise<void> => {
  if (window) return Promise.resolve();
  return await func();
};

export default function () {

  // Setup the firebase if we are in the client and it has not been setup
  if (!isInitialized && window) {
    isInitialized = true;
    setupFirebase();
  }

  return {
    inClient,
    outOfClient,
    fbUser,
  };
}

