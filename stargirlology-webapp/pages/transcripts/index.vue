<template>
  <div class="content flex flex-col items-center w-full">
    <div class="">
      <h1>Transcripts</h1>
      <p>Coming soon!</p>
      <p>Transcripts are AI Generated and are not going to be perfectly accurate.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';


useSeoMeta({
  title: 'Stargirlology',
  description: 'Stargirl Transcripts',
})


useFirebase().clientOnly(() => {
  const db = getDatabase();
  const tr = ref(db, '/transcripts/last-login');
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      set(tr, {
        '1': new Date().toLocaleString(),
        '2': user.email,
      });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
});

</script>

<style scoped>
.content {
  border: 1px solid #3de;
}
</style>
