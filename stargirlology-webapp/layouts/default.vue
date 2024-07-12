<template>
  <div>
    <header>
      <h1>Stargirlology</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/transcripts">Transcripts</NuxtLink> |
        <NuxtLink to="/auth/login">Login</NuxtLink> |
        <NuxtLink to="/auth/signup">Signup</NuxtLink> <span v-if="user.isNotGuest()"> | </span>
        <NuxtLink v-if="user.isNotGuest()" to="/admin" >Admin</NuxtLink>

      </nav>
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

watch(user, (newUser) => {
  console.log({ newUser });
  if (newUser.isGuest()) {
    navigateTo('/auth/login');
  }
});

</script>