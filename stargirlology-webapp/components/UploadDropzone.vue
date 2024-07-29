<template>
  <div class="flex w-full items-center justify-center">
    <label
      for="dropzone-file"
      class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800">
      <div class="flex flex-col items-center justify-center pb-6 pt-5">
        <CloudArrowUpIcon class="h-12 w-12 text-gray-700 dark:text-gray-300" />

        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="px-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {{ message }}
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onFileChange"
        />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { CloudArrowUpIcon } from '@heroicons/vue/24/outline';
defineProps({
  accept: {
    type: String,
    default: 'text/csv',
  },
  message: {
    type: String,
    default: 'text/csv',
  },
});

const emit = defineEmits(['on-file-change']);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    emit('on-file-change', target.files[0]);
  }
};
</script>
