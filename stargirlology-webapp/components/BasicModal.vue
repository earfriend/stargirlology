<template>
  <TransitionRoot
    :show="isOpen"
    as="template"
    enter="duration-300 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0">
    <Dialog :open="isOpen" @close="setIsOpen">
      <!-- Wrap your backdrop in a `TransitionChild`. -->
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      </TransitionChild>

      <!-- Full-screen scrollable container -->
      <div class="fixed inset-0 w-screen overflow-y-auto">
        <!-- Container to center the panel -->

        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Wrap your panel in a `TransitionChild`. -->
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="modal-box rounded-xl border-2 border-blue-600 bg-blue-400 bg-opacity-95 p-4 hover:bg-opacity-100">
              <DialogTitle class="mb-0 text-2xl font-semibold">
                <slot name="title" />
              </DialogTitle>

              <DialogDescription class="mb-2 text-sm">
                <slot name="description" />
              </DialogDescription>

              <div class="mb-4 pr-2">
                <slot name="content" />
              </div>

              <div class="flex flex-row justify-between">
                <button
                  class="rounded border border-solid border-slate-200 p-2 text-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  @click="setIsOpen(false)">
                  Cancel
                </button>
                <div>
                  <slot name="actions" />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isOpen']);
const setIsOpen = (value: boolean) => {
  emit('update:isOpen', value);
};
</script>

<style lang="scss" scoped>
.modal-box {
  max-width: 80ch;
  margin-bottom: 30px;
}

</style>
