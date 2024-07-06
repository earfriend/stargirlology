<template>
  <div class="content flex flex-col items-center w-full">
    <div class="">
      <h1>Transcripts</h1>
      <p>Coming soon!</p>
      <p>Transcripts are AI Generated and are not going to be perfectly accurate.</p>
    </div>
    {{ user }}
  </div>
</template>

<script setup lang="ts">
const fb = useFirebase();

const user = fb.fbUser;

useSeoMeta({
  title: 'Stargirlology',
  description: 'Stargirl Transcripts',
})

watch(user, (user) => {
  console.log({ user });

  if (user.isGuest()) {
    navigateTo('/auth/login');
  }
});

/*
fb.inClient(({ modAuth, modDb }) => {
  const auth = modAuth.getAuth();
  modAuth.onAuthStateChanged(auth, (user) => {
    if (user) {
      const db = modDb.getDatabase();
      const tr = modDb.ref(db, '/transcripts/last-login');
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      modDb.set(tr, {
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
*/

</script>

<style scoped>
.content {
  border: 1px solid #3de;
}
</style>
