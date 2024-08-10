<template>
  <TitledLinkButtons :title="title" :links="transcriptLinkButtons" />
</template>

<script setup lang="ts">
import type { BasicTranscriptListItem } from '~/model/transcript/BasicTranscript';
import type { TitledLinkButton } from '~/components/TitledLinkButtons.vue';

const fb = useFirebase();
const transcriptLinkButtons = ref<Array<TitledLinkButton>>([]);
const title = 'Transcripts';

useSeoMeta({
  title: 'Stargirlology',
  description: 'Stargirl Transcripts',
});


fb.inClient(async ({ modDb }) => {
  const ref = modDb.ref(modDb.getDatabase(), DbPath.transcriptList());

  modDb.onValue(ref, (snapshot) => {
    const list = snapshot.val() as Record<string, BasicTranscriptListItem>;
    transcriptLinkButtons.value = [];

    const transcriptList = Object.entries(list || {})
      .map(([, value]) => value )
      .sort((a, b) => a.episodeNumber - b.episodeNumber);

    transcriptList.forEach((transcript) => {
      const title = `${transcript.episodeNumber} - ${transcript.episodeTitle}`;
      const to = `/transcripts/${transcript.episodeNumber}-${transcript.episodeTitle}`;
      if (transcriptLinkButtons.value.find((button) => button.title === title)) return;
      transcriptLinkButtons.value.push({ to, title });
    });
  });
});
</script>
