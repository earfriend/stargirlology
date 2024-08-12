<template>
  <div class="flex flex-col h-screen">
    <TopNav />

    <div class="flex flex-grow md:items-center justify-center bg-n-200">
      <slot />
    </div>

    <BottomNav />
    <p v-if="isDev">RUNNING IN DEV</p>
  </div>
</template>

<script setup lang="ts">
const isDev = import.meta.dev;
// eslint-disable-next-line no-console
console.log('isDev', isDev);
</script>

<style lang="scss" scoped>
.el-main {
  min-height: 80vh;
}
</style>
