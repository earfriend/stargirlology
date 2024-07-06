<template>
  <div>
    <p>Logging out...</p>
    <pre>
      {{ user }}
    </pre>
  </div>
</template>

<script setup lang="ts">
const fb = useFirebase();
const user = fb.fbUser;

fb.inClient(async ({ modAuth }) => {
  try {
    await modAuth.signOut(modAuth.getAuth());

    if (fb.fbUser.value.isGuest()) {
      navigateTo('/auth/login');
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
});
</script>