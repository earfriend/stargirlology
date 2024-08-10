<template>
  <div class="content min-h-[80vh] max-w-[80ch] flex flex-col items-center w-full">
    <div class="h-6 bg-n-800 w-full"></div>
    <div class="flex w-full flex-col items-center ">
      <h2 class="m-w-20 m-2 w-full rounded-md border px-10 py-4 text-3xl font-bold bg-p-200">{{ title }}</h2>
    </div>

    <template v-for="(link, key) in links" :key="key">
      <NuxtLink
        :class="{
          'm-w-[40ch] m-2 w-full rounded-md border p-4': true,
          'bg-p-400 text-p-800 hover:bg-p-500': true,
        }"
        :to="link.to">
        {{ link.title }}
      </NuxtLink>
    <!--
    <template v-for="transcript in transcriptList" :key="transcript.episodeNumber">
      <NuxtLink
        :class="{
          'm-w-[40ch] m-2 w-full rounded-md border p-4': true,
          'bg-p-400 text-p-800 hover:bg-p-500': true,
        }"
        :to="`/transcripts/${transcript.episodeNumber}-${transcript.episodeTitle}`">
        {{ transcript.episodeNumber }} - {{ transcript.episodeTitle }}
      </NuxtLink>
    -->
    </template>
  </div>
</template>

<script setup lang="ts">
type TitledLinkButton = { to: string; title: string };

defineProps({
  title: {
    type: String,
    required: true,
  },
  links: {
    type: Array as PropType<Array<TitledLinkButton>>,
    required: true,
  },
});

export type { TitledLinkButton };
</script>