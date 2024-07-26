<template>
  <div class="container w-full max-w-xs pt-8">
    <form class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" @submit.prevent="signup">
      <div class="mb-4">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="email"> Email </label>
        <input
          id="email"
          v-model="email"
          type="email"
          :class="{
            'focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('user'),
          }"
          placeholder="Username" />
      </div>

      <div class="mb-4">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="displayName">
          Display Name
        </label>
        <input
          id="displayName"
          v-model="displayName"
          type="displayName"
          :class="{
            'focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('user'),
          }"
          placeholder="Display name" />
      </div>

      <div class="mb-0">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="password"> Password </label>
        <input
          id="password"
          v-model="password"
          type="password"
          :class="{
            'focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('password'),
          }"
          placeholder="******************" />
      </div>

      <div class="mb-3 flex items-center justify-center">
        <p class="text-xs italic text-red-500">&nbsp; {{ errorInfo.errorMessage }}</p>
      </div>

      <div class="flex items-center justify-between">
        <ClientOnly>
          <button
            :disabled="!email || !displayName || !password"
            :class="{
              'focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none': true,
              'bg-blue-300 hover:bg-blue-300': !email || !displayName || !password,
            }"
            type="submit">
            Sign Up
          </button>
        </ClientOnly>
        <a
          v-if="false"
          class="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
          href="#">
          Forgot Password?
        </a>
      </div>
    </form>
    <p class="text-center text-xs text-gray-500">
      &copy; <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink> |
      <NuxtLink to="/legal/tos">Terms of Service</NuxtLink>
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

    // await auth.signOut();

    // client side validations
    if (
      displayNameVal.match(/[^a-zA-Z0-9]/) ||
      displayNameVal.length < 3 ||
      displayNameVal.length > 32
    ) {
      errorInfo.value = {
        errorCode: 'user/invalid-display-name',
        errorMessage:
          'Display name must be alphanumeric and greater than 3 characters and less than 32 characters.',
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
      const userCredential = await modAuth.createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      createdUser = userCredential.user;

      await modAuth.updateProfile(userCredential.user, {
        displayName: displayNameVal,
      });
      await userCredential.user.getIdToken(true);

      const db = modDb.getDatabase();

      const baseRef = modDb.ref(db);
      const update = {
        [DbPath.usersAclIsApproved(userCredential.user.uid)]: false,
        [DbPath.usersAclCreatedAt(userCredential.user.uid)]: modDb.serverTimestamp(),
        [DbPath.usersAclLastLogin(userCredential.user.uid)]: modDb.serverTimestamp(),
        [DbPath.usersAclDisplayName(userCredential.user.uid)]: displayNameVal,
        [DbPath.usersAclUserAgent(userCredential.user.uid)]:
          `${window.navigator ? window.navigator.userAgent : 'unknown'}`,
        [DbPath.displayName(displayNameVal)]: userCredential.user.uid,
      };

      console.log(update);
      await modDb.update(baseRef, update);

      await userCredential.user.getIdToken(true);

      setTimeout(() => {
        navigateTo('/transcripts');
      }, 100);
    } catch (error: CatchParam) {
      let innerErr = error;
      console.error({ innerErr });

      try {
        if (createdUser) {
          await modAuth.deleteUser(createdUser);
        }
      } catch (error2: CatchParam) {
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
