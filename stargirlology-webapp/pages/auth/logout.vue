<template>
  <div>
    <p>Logging out...</p>
    <pre>
      {{ user.displayName }}
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
    // eslint-disable-next-line no-console
    console.error('Error signing out:', error);
  }
});
</script>