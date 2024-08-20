<template>
  <div class="w-full">
    <div class="h-6 w-full bg-n-800"></div>
    <div class="content flex min-h-[80vh] w-full max-w-[80ch] flex-col items-center px-1 md:px-0">
      <div class="flex w-full flex-col items-center">
        <h2 class="m-w-20 m-2 w-full rounded-md border bg-p-200 px-10 py-4 text-3xl font-bold">
          {{ title }}
        </h2>
      </div>

      <template v-for="(link, key) in links" :key="key">
        <NuxtLink
          :class="{
            'm-2 w-full rounded-md border p-4': true,
            'bg-p-400 text-p-800 hover:bg-p-500': true,
          }"
          :to="link.to">
          {{ link.title }}
        </NuxtLink>
      </template>
    </div>
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
