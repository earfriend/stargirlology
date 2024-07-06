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
        <button
          :disabled="!email || !password"
          :class="{
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline': true,
          }"
          type="submit">
          Sign Up
        </button>
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
  fb.inClient(async ({ modAuth }) => {
    const auth = modAuth.getAuth();
    try {
      const userCredential = await modAuth.createUserWithEmailAndPassword(auth, email.value, password.value)
      await modAuth.updateProfile(userCredential.user, {
        displayName: displayName.value,
      });
      await userCredential.user.getIdToken(true);

      navigateTo('/transcripts');
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log({ error });
      errorInfo.value = {
        errorCode: error.code,
        errorMessage: error.message,
      };
    }
  })
}

</script>