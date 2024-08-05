<template>
  <button
    :class="{
      'bg-p-700 text-p-200 hover:cursor-pointer hover:bg-p-200 hover:text-p-700': true,
      'focus:shadow-outline rounded px-4 py-2 font-bold focus:outline-none': true,
    }">
    <slot></slot>
  </button>
</template>
