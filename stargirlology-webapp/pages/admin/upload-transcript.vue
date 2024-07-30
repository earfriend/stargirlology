<template>

  <div class="w-full max-w-xs container pt-8">
    <ClientOnly>
      <div v-if="!user.acl.isApproved || user.isGuest()">You are note approved to upload Transcripts</div>
    </ClientOnly>
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

      <UploadDropzone
        :message="`CSV file from Google Cloud Speech-to-Text`"
        class="mb-4"
        accept="text/csv"
        @on-file-change="onFileChange"
        />

      <p v-if="fileName" class="text-xs text-center text-stone-500 pb-4">{{ fileName }}</p>

      <button
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
import papa from 'papaparse'; // todo lazy load this
import type { TimeInfo } from '~/model/TimeInfo';
import type { BasicTranscript, BasicTranscriptListItem, EditorInfo } from '~/model/transcript/BasicTranscript';

const fb = useFirebase();
const user = fb.fbUser;

const csvFile = ref<File | null>(null);
const fileName = ref<string>('');
const episodeNumber = ref<string>('');
const speaker1 = ref<string>('Emma');
const speaker2 = ref<string>('');
const episodeTitle = ref<string>('');

const onFileChange = (file: File) => {
  csvFile.value = file;
  fileName.value = file.name;
};

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
  if (!csvFile.value) {
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
    displayName: user.value.displayName,
    dateCreated: when.dateCreated,
    prettyDateCreated: when.prettyDateCreated,
  };

  papa.parse(csvFile.value, {
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
        //console.log(newRow);
        index += indexStep;
        uuid += 1;
        originalUuid = uuid;
        transcript.rows.push(newRow);
      });

      fb.inClient(async ({ modDb }) => {
        const db = modDb.getDatabase();

        const transcriptListItem: BasicTranscriptListItem = {
          episodeNumber: epNumber,
          episodeTitle: episodeTitle.value,
          editors: [editor],
        };

        const update = {
          [DbPath.transcriptBasic(transcript.episodeNumber)]: transcript,
          [DbPath.transcriptListItem(transcriptListItem.episodeNumber)]: transcriptListItem,
        };
        modDb.update(modDb.ref(db), update);

      });

      console.log(transcript);
    },
  });
};

</script>