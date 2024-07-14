<template>
  <div class="w-full container pb-8 pl-2 pr-2 pt-2">
    <header
      :class="{
        'grid grid-cols-3': true,
      }">
      <h1 class="flex justify-start">Stargirlology</h1>

      <nav class="grid grid-cols-1">
        <span><NuxtLink to="/">Home</NuxtLink></span>
        <span><NuxtLink to="/transcripts">Transcripts</NuxtLink></span>
        <span><NuxtLink v-if="user.isGuest()" to="/auth/signup">Login / Signup</NuxtLink> </span>
        <span><NuxtLink v-if="user.isNotGuest()" to="/admin" >Admin</NuxtLink></span>
      </nav>

      <div class="flex justify-end">
        <nav class="grid grid-cols-1">
          <span>{{ user.isNotGuest() ? user.displayName : 'Guest' }}</span>
          <span><NuxtLink v-if="user.isNotGuest()" to="/auth/logout">Logout</NuxtLink></span>
        </nav>
      </div>
    </header>
    <slot />
    <footer>
      <a href="/legal/tos">Terms of service</a> |
      <a href="/legal/privacy">Privacy Policy</a>
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
