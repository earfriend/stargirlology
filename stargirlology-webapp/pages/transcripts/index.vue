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
const fb = useFirebase();
const user = fb.fbUser;

useSeoMeta({
  title: 'Stargirlology',
  description: 'Stargirl Transcripts',
})

watch(user, (user) => {
  console.log({ user });
  if (user.isGuest()) {
    return;
  }

  if (user.isGuest()) {
    navigateTo('/auth/login');
  }
});

fb.inClient(async ({ modDb }) => {
  const ref = modDb.ref(modDb.getDatabase(), DbPath.transcriptList());
  const list = (await modDb.get(ref)).val();
  console.log({ list });
});
</script>

<style scoped>
.content {
  border: 1px solid #3de;
}
</style>
