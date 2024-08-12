<template>
  <div class="container w-full max-w-[80ch] pt-8">
    <div
      v-if="isCommentSent"
      ref="thankYou"
      class="h-60 mx-2 mb-4 flex items-center justify-center rounded bg-white px-8 pb-8 pt-6 shadow-md">
      <p>Thank you for your comment, {{ yourName }}! We will get back to you at {{ email }}.</p>
    </div>

    <form
      v-if="!isCommentSent"
      class="mx-2 mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
      @submit.prevent="contact">
      <h3 class="pb-2 text-center font-bold">Contact us</h3>

      <div class="mb-0">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="yourname"> Your name </label>
        <input
          id="yourname"
          v-model="yourName"
          type="text"
          :class="{
            'focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('yourname'),
          }"
          placeholder="Full name" />
      </div>

      <div class="mb-4">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="email"> Email </label>
        <input
          id="email"
          v-model="email"
          type="email"
          :class="{
            'focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('email'),
          }"
          placeholder="Email" />
      </div>

      <div class="mb-4">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="email"> Anti spam - whats the host's FIRST name? (required)</label>
        <input
          id="anti-spam"
          v-model="antiSpam"
          type="text"
          :class="{
            'focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none': true,
            'border-red-500': errorInfo.errorCode.includes('anti-spam'),
          }"
          placeholder="Who's the host of SG? FIRST name only!" />
      </div>

      <div class="mb-0">
        <label class="text-md mb-2 block font-bold text-gray-700" for="comment"> Comment </label>
        <textarea
          id="comment"
          v-model="comment"
          type="text"
          rows="6"
          :class="{
            'text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500': true,
            'border-red-500': errorInfo.errorCode.includes('comment'),
          }"
          placeholder="What do you want to say?"></textarea>
      </div>

      <div class="mb-1 flex items-center justify-center">
        <p class="text-md italic text-red-500">&nbsp; {{ errorInfo.errorMessage }}</p>
      </div>

      <div class="flex items-center justify-between">
        <button
          :class="{
            'focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none': true,
          }"
          type="submit">
          Send
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import GeneralContact from '~/model/message/GeneralContact';

const fb = useFirebase();
const isCommentSent = ref(false);
const email = ref('');
const yourName = ref('');
const antiSpam = ref('');
const comment = ref('');
const errorInfo = ref({ errorCode: '', errorMessage: '' });
const thankYou = ref<HTMLDivElement | null>(null);

let tic = 0;
onMounted(() => {
  tic = Date.now();
});

let isSending = false;

const contact = () => {
  const toc = Date.now();
  if (isSending) return;

  fb.inClient(async ({ modDb }) => {
    isSending = true;
    const now = new Date();
    const when = {
      dateCreated: now.getTime(),
      prettyDateCreated: now.toISOString(),
      prettyLocalDateCreated: now.toLocaleString(),
      timestamp: modDb.serverTimestamp(),
    };

    const emailValue = email.value;
    const yourNameValue = yourName.value;
    const errorInfoValue = errorInfo.value;
    const commentValue = comment.value;
    const currentPage = document.location.href;
    const ua = window.navigator ? window.navigator.userAgent : 'Unknown';

    if (toc - tic < 5 * 1000) {
      // eslint-disable-next-line no-console
      console.log('Too soon to send another comment', { isSending, tic, toc });
      errorInfoValue.errorCode = 'too-soon';
      errorInfoValue.errorMessage = 'You tried to submit too soon. Please wait a few seconds.';
    } else if (!antiSpam.value) {
      errorInfoValue.errorCode = 'anti-spam';
      errorInfoValue.errorMessage = 'anti-spam is required';
    } else if (!emailValue || !emailValue.includes('@')) {
      errorInfoValue.errorCode = 'email';
      errorInfoValue.errorMessage = 'Email is required';
    } else if (!yourNameValue) {
      errorInfoValue.errorCode = 'yourname';
      errorInfoValue.errorMessage = 'Your name is required';
    } else if (!commentValue) {
      errorInfoValue.errorCode = 'comment';
      errorInfoValue.errorMessage = 'Comment is required';
    }

    tic = Date.now();

    if (errorInfoValue.errorCode) {
      setTimeout(() => {
        errorInfoValue.errorCode = '';
        errorInfoValue.errorMessage = '';
      }, 5 * 1000);
      isSending = false;
      return;
    }

    const contactInfo = new GeneralContact({
      name: yourNameValue,
      email: emailValue,
      comment: commentValue,
      currentPage,
      ua,
      ...when,
    });

    // eslint-disable-next-line no-console
    console.log(contactInfo);

    const db = modDb.getDatabase();
    const ref = modDb.ref(db, DbPath.newContact());
    await modDb
      .push(ref, { ...contactInfo, antiSpam: antiSpam.value.toLowerCase().trim() })
      .then(() => {
        isCommentSent.value = true;
        setTimeout(() => {
          if (thankYou.value) {
            thankYou.value.scrollIntoView({ behavior: 'smooth' });
          } else {
            // eslint-disable-next-line no-console
            console.error('no thank you');
          }
        }, 300);
      })
      .catch((e) => {
        errorInfoValue.errorCode = 'unknown';
        errorInfoValue.errorMessage = `${e} - message not sent - did you put in the correct anti-spam, first name only?`;
      })
      .finally(() => {
        isSending = false;
      });
  });
};
</script>
