<template>
  <div class="content flex flex-col items-center bg-n-800">
    <NuxtLink to="/transcripts" class="h-6 text-gray-200"> Back to Transcripts </NuxtLink>

    <div v-if="transcript === null">
      <h1>Loading...</h1>
    </div>

    <div v-if="transcript !== null" class="flex w-full flex-col items-center bg-p-200">
      <h2 class="p-4 text-3xl font-bold">
        {{ transcript.episodeNumber }} - {{ transcript.episodeTitle }}
      </h2>
    </div>

    <div v-if="transcript !== null" class="transcript-box bg-p-200">
      <template v-for="row in transcript.rows" :key="row.uuid">
        <div
          class="grid grid-cols-12 hover:cursor-pointer hover:bg-violet-50"
          @click="onEditRow(row)">
          <p class="col-span-2 mb-1 bg-p-100 p-1">{{ row.startTime }}-{{ row.endTime }}s</p>
          <p class="col-span-10 mb-1 bg-p-100 p-1 text-p-800">{{ row.transcript }}</p>
        </div>
      </template>
    </div>
    <NuxtLink v-if="transcript !== null" class="text-gray-200" to="/transcripts">
      Back to Transcripts
    </NuxtLink>

    <BasicModal v-model:is-open="isOpen">
      <template #title> Suggest an edit </template>
      <template #description>
        <p>
          Thank you for suggesting an edit. We will review your suggestion and make the necessary
          changes.
        </p>
      </template>
      <template #content>
        <h3 class="font-semibold">Original text:</h3>
        <p
          :class="{
            'col-span-10 mb-2 p-2 pb-7': true,
            'rounded-lg border border-p-800 bg-p-400': true,
          }">
          {{ activeRow?.transcript }}

          <span class="float-end pl-3 pr-2">
            <DocumentDuplicateIcon
              v-if="suggestion.length < 3"
              class="h-6 w-6 text-p-800 hover:cursor-pointer hover:text-p-300"
              @click="copyText" />
          </span>
        </p>

        <div class="flex flex-col">
          <label for="suggestion" class="mb-2 font-semibold">Suggestion:</label>
          <textarea id="suggestion" v-model="suggestion" class="mb-2 bg-p-100 p-2" rows="4" />
        </div>
      </template>
      <!-- content -->

      <template #actions>
        <ActionButton class="ml-2" @click="handleSuggestion">Suggest!</ActionButton>
      </template>
    </BasicModal>

    <BasicModal v-model:is-open="isOpenThanks">
      <template #title> Thanks for the Suggestion </template>
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { BasicTranscript, BasicTranscriptRow } from '~/model/transcript/BasicTranscript';
import { ref } from 'vue';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const fb = useFirebase();

const transcript = ref<BasicTranscript | null>(null);
const suggestion = ref('');
const activeRow = ref<BasicTranscriptRow | null>(null);
const isOpen = ref(false);
const isOpenThanks = ref(false);

const routeSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});
const routeParams = routeSchema.parse(route.params);

fb.inClient(async ({ modDb }) => {
  const db = modDb.getDatabase();
  const ref = modDb.ref(db, DbPath.transcriptBasic(routeParams.id));
  const snap = await modDb.get(ref);
  const val = snap.val() as BasicTranscript | null;
  if (val === null) return;
  transcript.value = val;
});

const setIsOpen = (value: boolean) => {
  isOpen.value = value;
};

const onEditRow = (row: BasicTranscriptRow) => {
  if (row === null) return;
  activeRow.value = row;
  setIsOpen(true);
};

const handleSuggestion = () => {
  fb.inClient(async ({ modDb }) => {
    if (activeRow.value === null || transcript.value == null) return;
    if (suggestion.value.length < 3) return;
    if (suggestion.value.trim() === activeRow.value.transcript.trim()) return;

    const db = modDb.getDatabase();
    const ref = modDb.ref(db, DbPath.newContactTranscriptSuggestion());

    await modDb.push(ref, {
      episodeNumber: transcript.value.episodeNumber,
      episodeTitle: transcript.value.episodeTitle,
      row: activeRow.value,
      suggestion: suggestion.value,
    });

    setIsOpen(false);
    isOpenThanks.value = true;
    setTimeout(() => {
      isOpenThanks.value = false;
    }, 3000);
  });
};

const copyText = () => {
  if (activeRow.value === null) return;
  navigator.clipboard.writeText(activeRow.value.transcript);
  suggestion.value = activeRow.value.transcript.trim();
};
</script>

<style lang="scss" scoped>
.transcript-box {
  max-width: 80ch;
}
</style>
