<template>
  <div>
    {{  user.isNotGuest()  }} {{  user.displayName }}
    <NuxtLink to="/admin/upload-transcript">Upload Transcript</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const fb = useFirebase();
const user = fb.fbUser;

watch(user, (newUser) => {
  console.log({ newUser });
  if (newUser.isGuest()) {
    navigateTo('/auth/login');
  }
});
</script>