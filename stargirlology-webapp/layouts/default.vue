<template>
  <div class="flex flex-col h-screen">
    <TopNav />

    <div class="flex flex-grow items-center justify-center bg-green-400">
      <slot />
    </div>

    <!--
    <div class="mx-auto bg-stone-400">
      <NuxtLink class="p-2 drop-shadow" to="/">Stargirlology</NuxtLink>
      <NuxtLink to="/auth/signup">Signup</NuxtLink>
      <NuxtLink to="/auth/login">Login</NuxtLink>
      <NuxtLink to="/admin">Admin</NuxtLink>
      <NuxtLink to="/auth/logout">Logout</NuxtLink>

      <div class="pt-6">
        <span>{{ (user.isNotGuest()) ? user.displayName : 'Guest' }}</span>&nbsp;
        <span v-if="user.isNotGuest()">(<NuxtLink to="/auth/logout">Logout</NuxtLink>)</span>
      </div>
    </div>

    <footer>
      <a href="https://www.patreon.com/STARGIRLpod/posts" target="_blank">Patreon (Official)</a>
      <a href="https://www.instagram.com/emmaglennbaker/" target="_blank">Emma's Instagram (Official)</a>
      <a href="https://www.reddit.com/r/STARGIRLpod/" target="_blank">STARGIRL Reddit (Fan page)</a>
      <a href="/legal/tos" target="_blank">Terms of service</a>
      <a href="/legal/privacy" target="_blank">Privacy Policy</a>
    </footer>
    -->

    <TopNav />
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
