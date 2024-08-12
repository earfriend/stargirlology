<template>
  <div class="content flex w-full flex-col items-center">
    <div
      :class="{
        'mt-8 rounded-lg border p-4': true,
        'border-p-700 bg-p-400': true,
      }">
      <p>This is an unofficial fan page of the STARGIRL Podcast hosted by Emma Baker.</p>
      <p>
        It is currently under construction, but we do have
        <NuxtLink
          to="/transcripts"
          class="rounded-md border border-p-500 bg-p-200 px-1 hover:bg-p-300"
          >transcripts!</NuxtLink>
      </p>
      <p>
        Please use the
        <NuxtLink to="/contact" class="rounded-md border border-p-500 bg-p-200 px-1 hover:bg-p-300"
          >contact form</NuxtLink
        >
        to get in touch with us.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Stargirlology',
  description: 'The future home of Stargirlology',
});
</script>

<style scoped></style>
