<template>
  <div
    :class="{
      'bg-p-200': true,
      'max-w-[80ch]': true,
    }">
    <h1>Paradigm {{ slug }} - Comming Soon...</h1>
    <section>
      <h2>Intro</h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor voluptatibus cupiditate eius
        laborum minus sequi praesentium suscipit aperiam vero explicabo earum, quod autem vitae
        tenetur consequuntur, temporibus non, consequatur doloribus.
      </p>
    </section>
    <section>
      <h2>Flavors</h2>
    </section>
    <section>
      <h2>Example STARGIRLS</h2>
    </section>
    <section>
      <h2>Moodboards</h2>
    </section>
    <section>
      <h2>Free associations</h2>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const slug = route.params.paradigm;
</script>
