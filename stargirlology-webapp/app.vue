<template>
  <div class="content flex flex-col items-center w-full">
    <div class="">
      Future home of STARGIRLology
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCIooYtFaWQ_li4P0WvhNwxb5BXpy5g9W0',
  authDomain: 'stargirlology.firebaseapp.com',
  databaseURL: 'https://stargirlology-default-rtdb.firebaseio.com',
  projectId: 'stargirlology',
  storageBucket: 'stargirlology.appspot.com',
  messagingSenderId: '818392779284',
  appId: '1:818392779284:web:415eb3b793337a25f1b501',
  measurementId: 'G-L9Y6EJ7D44',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

useSeoMeta({
  title: 'Stargirlology',
  description: 'The future home of Stargirlology',
})
</script>

<style scoped>
.content {
  border: 1px solid #000;
}
</style>
