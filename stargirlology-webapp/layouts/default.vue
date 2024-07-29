<template>
  <div class="flex flex-col h-screen">
    <TopNav />

    <div class="flex flex-grow md:items-center justify-center bg-slate-300">
      <slot />
    </div>

    <BottomNav />
    <p v-if="isDev">RUNNING IN DEV</p>
  </div>
</template>

<script setup lang="ts">
const fb = useFirebase();
const user = fb.fbUser;
const route = useRouter();
const isDev = import.meta.dev;

watch(user, (newUser) => {
  if (
    route.currentRoute.value.path === '/auth/login' ||
    route.currentRoute.value.path === '/auth/signup'
  ) {
    return;
  }
  if (newUser.isGuest()) {
    navigateTo('/auth/login');
  }
});
</script>

<style lang="scss" scoped>
.el-main {
  min-height: 80vh;
}
</style>
