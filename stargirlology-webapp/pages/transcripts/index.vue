<template>
  <div class="content flex flex-col items-center w-full">
    <div class="">
      <h1>Transcripts</h1>
      <p>Coming soon!</p>
      <p>Transcripts are AI Generated and are not going to be perfectly accurate.</p>
    </div>
    <ClientOnly>
      <pre>{{ JSON.stringify(user, null, 2) }}</pre>
    </ClientOnly>
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
</script>

<style scoped>
.content {
  border: 1px solid #3de;
}
</style>
