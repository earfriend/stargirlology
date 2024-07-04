<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Email:</label>
      <input id="email"  v-model="email" type="email" required>
      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" required>
      <button type="submit">Login</button>
    </form>
    <pre>
      User: {{ JSON.stringify(user) }}
      Error: {{ JSON.stringify(errorInfo) }}
    </pre>
  </div>
</template>

<script setup type="ts">
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const email = ref('');
const password = ref('');
const user = ref(null);
const errorInfo = ref({
  errorCode: '',
  errorMessage: '',
});


const login = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      user.value = userCredential.user;
      // ...
    })
    .catch((error) => {
      console.log({ error });
      errorInfo.value = {
        errorCode: error.code,
        errorMessage: error.message,
      };
    });
};
</script>

<style scoped>
/* Add your custom styles here */
</style>