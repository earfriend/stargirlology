<template>
  <div>
    <TitledLinkButtons :title="title" :links="paradigms" />
  </div>
</template>


<script setup lang="ts">
import type { TitledLinkButton } from '~/components/TitledLinkButtons.vue';

useSeoMeta({
  title: 'STARGIRL Paradigms',
  description: 'Paradigms of the STARGIRL Podcast',
});

const title = 'The StarGirlology Paradigms';
const paradigms = ref<Array<TitledLinkButton>>([]);

Promise.resolve().then(() => {
  paradigms.value.push({ to: '/paradigm/ripe-dead', title: 'Ripe Dead' });
  paradigms.value.push({ to: '/paradigm/spider-bunny-hen', title: 'Spider Bunny Hen' });
});

</script>
