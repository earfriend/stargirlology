<template>
  <div class="content flex flex-col items-center w-full">
    <div>
      <h1>Transcripts</h1>
      <p>Coming soon!</p>
      <p>Transcripts are AI Generated and are not going to be perfectly accurate.</p>

      <ul>
        <li v-for="transcript in transcriptList" :key="transcript.episodeNumber">
          <NuxtLink :to="`/transcripts/${transcript.episodeNumber}-${transcript.episodeTitle}`">View
            {{ transcript.episodeNumber }} - {{ transcript.episodeTitle }}
          </NuxtLink>
        </li>
      </ul>
    </div>
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

<style scoped>
.content {
  border: 1px solid #3de;
}
</style>
