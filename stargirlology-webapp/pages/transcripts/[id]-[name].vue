<template>
  <div class="content flex flex-col items-center bg-n-800">
    <NuxtLink to="/transcripts" class="text-gray-200 h-6">
      Back to Transcripts
    </NuxtLink>

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
        <p class="col-span-10 mb-2 bg-sky-300 p-2">
          {{ activeRow?.transcript }}

          <span class="float-end pl-3 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6">
              <path
                fill-rule="evenodd"
                d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                clip-rule="evenodd" />
              <path
                fill-rule="evenodd"
                d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
                clip-rule="evenodd" />
            </svg>
          </span>
        </p>

        <div class="flex flex-col">
          <label for="suggestion" class="mb-2 font-semibold">Suggestion:</label>
          <textarea id="suggestion" class="mb-2 bg-slate-100" rows="4" />
        </div> </template
      ><!-- content -->

      <template #actions>
        <ActionButton class="ml-2" @click="handleSuggestion">Suggest! (coming soon)</ActionButton>
      </template>
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { BasicTranscript, BasicTranscriptRow } from '~/model/transcript/BasicTranscript';
import { ref } from 'vue';

const route = useRoute();
const fb = useFirebase();
const transcript = ref<BasicTranscript | null>(null);

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

const isOpen = ref(false);
const setIsOpen = (value: boolean) => {
  isOpen.value = value;
};

const activeRow = ref<BasicTranscriptRow | null>(null);

const onEditRow = (row: BasicTranscriptRow) => {
  if (row === null) return;
  activeRow.value = row;
  setIsOpen(true);
};

const handleSuggestion = (evt: MouseEvent) => {
  console.log('suggestion', 'clicked', evt);
  alert('Suggestions not implemented!');
};
</script>

<style lang="scss" scoped>
.transcript-box {
  max-width: 80ch;
}
</style>
