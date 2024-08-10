<template>
  <TitledLinkButtons :title="title" :links="adminLinkButtons" />
</template>

<script setup lang="ts">
import type { TitledLinkButton } from '~/components/TitledLinkButtons.vue';

const fb = useFirebase();
const user = fb.fbUser;

const title = 'Admin';

const adminLinkButtons: Array<TitledLinkButton> = [
  { title: 'Upload Transcript', to: '/admin/upload-transcript' },
];

onMounted(() => {
  //user.value.waitToInitialize().then(() => {
  if (user.value.isGuest()) {
    navigateTo('/auth/login');
    return;
  }
  watch(user, (newUser) => {
    if (newUser.isGuest()) {
      navigateTo('/auth/login');
    }
  });
  //});
});
</script>