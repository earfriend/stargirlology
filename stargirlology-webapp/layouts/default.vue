<template>
  <div class="common-layout" >
    <NuxtLink to="/">Stargirlology</NuxtLink>
    <NuxtLink  to="/auth/signup">Signup</NuxtLink>
    <NuxtLink  to="/auth/login">Login</NuxtLink>
    <NuxtLink to="/admin" >Admin</NuxtLink>
    <NuxtLink to="/auth/logout">Logout</NuxtLink>

    <div class="pt-6">
      <span>{{ user.isNotGuest() ? user.displayName : 'Guest' }}</span>&nbsp;
      <span v-if="user.isNotGuest()">(<NuxtLink  to="/auth/logout">Logout</NuxtLink>)</span>
    </div>

    <footer>
      <a href="https://www.patreon.com/STARGIRLpod/posts" target="_blank">Patreon (Official)</a>
      <a href="https://www.instagram.com/emmaglennbaker/" target="_blank">Emma's Instagram (Official)</a>
      <a href="https://www.reddit.com/r/STARGIRLpod/" target="_blank">STARGIRL Reddit (Fan page)</a>
      <a href="/legal/tos" target="_blank">Terms of service</a>
      <a href="/legal/privacy" target="_blank">Privacy Policy</a>
    </footer>
  </div>
</template>

<script setup lang="ts">

const fb = useFirebase();
const user = fb.fbUser;
const route = useRouter();

watch(user, (newUser) => {
  if (route.currentRoute.value.path === '/auth/login' || route.currentRoute.value.path === '/auth/signup') {
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
