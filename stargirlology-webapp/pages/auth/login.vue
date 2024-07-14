<template>
  <div class="w-full max-w-xs container pt-8">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
      @submit.prevent="login">

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          :class="{
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline': true,
            'border-red-500': errorInfo.errorCode.includes('user'),
          }"
          placeholder="Username"
          @key.enter="login"
          >
      </div>
      <div class="mb-0">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          :class="{
            'shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline': true,
            'border-red-500': errorInfo.errorCode.includes('password'),
          }"
          placeholder="******************">
      </div>

      <div class="flex items-center justify-center mb-3">
        <p class="text-red-500 text-xs italic">&nbsp; {{ errorInfo.errorMessage }}</p>
      </div>

      <div class="flex items-center justify-between">
        <button
          :disabled="!email || !password"
          :class="{
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline': true,
          }"
          type="submit">
          Sign In
        </button>
        <a v-if="false" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Forgot Password?
        </a>
      </div>

    </form>

    <div class="mb-4 mt-8 container">
      <p>Don't have an account? <NuxtLink to="/auth/signup">Signup Here.</NuxtLink></p>
    </div>
    <p class="text-center text-gray-500 text-xs">
      &copy; <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink> | <NuxtLink to="/legal/tos">Terms of Service</NuxtLink>
    </p>
  </div>
</template>


<script setup type="ts">
const fb = useFirebase();

const email = ref('');
const password = ref('');
const user = fb.fbUser;
const errorInfo = ref({
  errorCode: '',
  errorMessage: '',
});


fb.inClient(({ modAuth }) => {
  const auth = modAuth.getAuth();
  modAuth.onAuthStateChanged(auth, (user) => {
    console.log({ user });
  });
});

const login = () => {
  errorInfo.value = {
    errorCode: '',
    errorMessage: '',
  };

  fb.outOfClient(() => {
    throw new Error('This function is not available in the client');
  });

  fb.inClient(({ modAuth, modDb }) => {
    const auth = modAuth.getAuth();
    modAuth.signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        user.value = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        };

        const baseRef =  modDb.ref(db);
        const update = {
          [dbPath.usersAclLastLogin(userCredential.user.uid)]: modDb.serverTimestamp(),
          [dbPath.usersAclUserAgent(userCredential.user.uid)]: `${(window.navigator) ? window.navigator.userAgent : 'unknown'}`,
        };

        console.log(update);
        await modDb.update(baseRef, update);

        navigateTo('/transcripts');
      })
      .catch((error) => {
        console.log({ error });
        errorInfo.value = {
          errorCode: error.code,
          errorMessage: error.message,
        };
      });
  });
};

</script>

<style scoped>
/* Add your custom styles here */
</style>