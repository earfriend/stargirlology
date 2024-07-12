<template>

  <div class="w-full max-w-xs container pt-8">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
      enctype="multipart/form-data"
      @submit.prevent="uploadCsv">

      <input
        v-model="episodeNumber"
        type="number"
        min="1"
        max="500"
        placeholder="Episode Number"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">

      <input
        v-model="episodeTitle"
        type="text"
        placeholder="Episode Title"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">

      <input
        v-model="speaker1"
        type="text"
        placeholder="Tag 1 Speaker Name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">

      <input
        v-model="speaker2"
        type="text"
        placeholder="Tag 2 Speaker Name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
      <input
        id="input"
        ref="inputFile"
        :class="{
          'pb-2': true,
        }"
        type="file" >

      <button
        :disabled="!inputFile || !inputFile.files"
        :class="{
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline': true,
        }"
        type="submit">
        Upload
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import papa from 'papaparse';
import type { TimeInfo } from '~/model/TimeInfo';
import type { BasicTranscript, EditorInfo } from '~/model/transcript/BasicTranscript';

const fb = useFirebase();
const user = fb.fbUser;

const inputFile = ref<HTMLInputElement | null>(null);
const episodeNumber = ref<string>('');
const speaker1 = ref<string>('Emma');
const speaker2 = ref<string>('');
const episodeTitle = ref<string>('');

type PapaResult = {
  data: Record<string, string>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    fields: string[];
    truncated: boolean;
  };
};

const uploadCsv = () => {
  if (!inputFile.value || !inputFile.value.files) {
    console.error('No file input');
    return;
  }

  const epNumber = parseInt(episodeNumber.value, 10);
  if (Number.isNaN(epNumber)) {
    console.error('Invalid episode number');
    return;
  }

  const now = new Date();
  const when: TimeInfo = {
    dateCreated: now.getTime(),
    prettyDateCreated: now.toISOString(),
    lastModified: now.getTime(),
    prettyLastModified: now.toISOString(),
  };

  const editor: EditorInfo = {
    userId: user.value.uid,
    dateCreated: when.dateCreated,
    prettyDateCreated: when.prettyDateCreated,
  };

  papa.parse(inputFile.value.files[0], {
    header: true, // First row is header
    complete: async (results) => {
      const r = results as PapaResult;
      r.meta.fields.forEach((field) => {
        console.log(field);
      });

      const transcript: BasicTranscript = {
        ...when,
        episodeNumber: epNumber,
        episodeTitle: episodeTitle.value,
        speaker1: speaker1.value,
        speaker2: speaker2.value,
        rows: [],
        editors: [editor],
      };

      const indexStep = 1000;
      let index = indexStep;
      let originalUuid = 0;
      let uuid = originalUuid;
      r.data.slice(0, 10).forEach((row) => {
        const prettyRow = {
          confidence: parseFloat(row['Confidence']),
          startTime: parseFloat(row['Start time']),
          endTime: parseFloat(row['End time']),
          transcript: row['Transcript'],
          speakerTag: row['Speaker tag'],
        };

        const newRow = {
          ...prettyRow,
          ...when,
          originalUuid,
          uuid,
          index,
          editors: [editor],
        };
        console.log(newRow);
        index += indexStep;
        uuid += 1;
        originalUuid = uuid;
        transcript.rows.push(newRow);
      });

      fb.inClient(async ({ modDb }) => {
        const db = modDb.getDatabase();
        const tr = modDb.ref(db, '/transcripts/' + epNumber + '/basic');
        await modDb.set(tr, transcript);
      });

      console.log(transcript)
    },
  });
}

</script>