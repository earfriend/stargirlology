<template>
  <div class="content min-h-[80vh] max-w-[80ch] flex flex-col items-center w-full">
    <div class="h-6 bg-n-800 w-full"></div>
    <div class="flex w-full flex-col items-center ">
      <h2 class="m-w-20 m-2 w-full rounded-md border px-10 py-4 text-3xl font-bold bg-p-200">Transcripts</h2>
    </div>
    <template v-for="transcript in transcriptList" :key="transcript.episodeNumber">
      <NuxtLink
        :class="{
          'm-w-[40ch] m-2 w-full rounded-md border p-4': true,
          'bg-p-400 text-p-800 hover:bg-p-500': true,
        }"
        :to="`/transcripts/${transcript.episodeNumber}-${transcript.episodeTitle}`">
        {{ transcript.episodeNumber }} - {{ transcript.episodeTitle }}
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BasicTranscriptListItem } from '~/model/transcript/BasicTranscript';

const fb = useFirebase();
const user = fb.fbUser;

useSeoMeta({
  title: 'Stargirlology',
  description: 'Stargirl Transcripts',
});

watch(user, (user) => {
  if (user.isGuest()) {
    return;
  }

  if (user.isGuest()) {
    navigateTo('/auth/login');
  }
});

const transcriptList = ref<Array<BasicTranscriptListItem>>([]);

fb.inClient(async ({ modDb }) => {
  const ref = modDb.ref(modDb.getDatabase(), DbPath.transcriptList());
  const list = (await modDb.get(ref)).val() as Record<number, BasicTranscriptListItem>;

  Object.entries(list).forEach(([, value]) => {
    transcriptList.value.push(value);
  });
});
</script>

<style lang="scss" scoped>
.transcript-box {
  max-width: 80ch;
  border: 1px solid black;
}
</style>
