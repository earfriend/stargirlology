<template>
  <div class="w-full max-w-xs container pt-8">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
      @submit.prevent="signup">
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
          placeholder="Username">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="displayName">
          Display Name
        </label>
        <input
          id="displayName"
          v-model="displayName"
          type="displayName"
          :class="{
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline': true,
            'border-red-500': errorInfo.errorCode.includes('user'),
          }"
          placeholder="Display name">
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
        <ClientOnly>
          <button
            :disabled="!email || !displayName || !password"
            :class="{
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline': true,
              'bg-blue-300 hover:bg-blue-300': !email || !displayName || !password,
            }"
            type="submit">
            Sign Up
          </button>
        </ClientOnly>
        <a v-if="false" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Forgot Password?
        </a>
      </div>

    </form>
    <p class="text-center text-gray-500 text-xs">
      &copy; <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink> | <NuxtLink to="/legal/tos">Terms of Service</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const fb = useFirebase();

const email = ref('');
const displayName = ref('');
const password = ref('');
const errorInfo = ref({
  errorCode: '',
  errorMessage: '',
});

const signup = () => {
  // you can only signup in the client

  fb.inClient(async ({ modAuth, modDb }) => {
    errorInfo.value = {
      errorCode: '',
      errorMessage: '',
    };

    const auth = modAuth.getAuth();
    const displayNameVal = displayName.value;

    await auth.signOut();

    // client side validations
    if (displayNameVal.match(/[^a-zA-Z0-9]/) || displayNameVal.length < 3 || displayNameVal.length > 32) {
      errorInfo.value = {
        errorCode: 'user/invalid-display-name',
        errorMessage: 'Display name must be alphanumeric and greater than 3 characters and less than 32 characters.',
      };
      return;
    }

    // pre write request validations (must also be checked server side, via database rules)
    const db = modDb.getDatabase();
    const displayNamesRef = modDb.ref(db, DbPath.displayName(displayNameVal));

    if ((await modDb.get(displayNamesRef)).exists()) {
      console.log('display name exists', (await modDb.get(displayNamesRef)).val());
      errorInfo.value = {
        errorCode: 'user/display-name-exists',
        errorMessage: 'Display name already exists.',
      };
      return;
    }

    let createdUser = null;
    try {
      const userCredential = await modAuth.createUserWithEmailAndPassword(auth, email.value, password.value);
      createdUser = userCredential.user;


      await modAuth.updateProfile(userCredential.user, {
        displayName: displayNameVal,
      });
      await userCredential.user.getIdToken(true);

      const db = modDb.getDatabase();

      const baseRef =  modDb.ref(db);
      const update = {
        [DbPath.usersAclIsApproved(userCredential.user.uid)]: false,
        [DbPath.usersAclCreatedAt(userCredential.user.uid)]: modDb.serverTimestamp(),
        [DbPath.usersAclLastLogin(userCredential.user.uid)]: modDb.serverTimestamp(),
        [DbPath.usersAclDisplayName(userCredential.user.uid)]: displayNameVal,
        [DbPath.usersAclUserAgent(userCredential.user.uid)]: `${(window.navigator) ? window.navigator.userAgent : 'unknown'}`,
        [DbPath.displayName(displayNameVal)]: userCredential.user.uid,
      };

      console.log(update);
      await modDb.update(baseRef, update);

      await userCredential.user.getIdToken(true);

      setTimeout(() => {
        navigateTo('/transcripts');
      }, 100);

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      let innerErr = error;
      console.error({ innerErr });

      try {
        if (createdUser) {
          await modAuth.deleteUser(createdUser);
        }
      } catch (error2: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        innerErr = error2;
        console.error({ innerErr });
      }

      errorInfo.value = {
        errorCode: innerErr.code || 'unknown',
        errorMessage: innerErr.message || 'unknown',
      };
    }
  });

};

</script>