<template>
  <div class="content flex flex-col items-center">
    <div class="flex w-full flex-col items-center bg-p-200">
      <h2 class="m-w-20 m-2 w-full rounded-md border bg-p-200 px-10 py-4 text-3xl font-bold">
        Contacts
      </h2>
    </div>

    <div class="grid grid-cols-12 hover:bg-violet-50">
      <template v-for="contact in contacts" :key="contact.id">
        <div class="col-span-12 bg-p-300 p-1" :title="`${contact.currentPage} - ${contact.ua}`">
          <p class="font-semibold">From: {{ contact.name }} - {{ contact.email }}</p>
        </div>

        <div class="col-span-2 mb-2 bg-p-200 p-1">
          <p :title="`${contact.prettyDateCreated} - ${contact.timestamp}`" class="text-sm">
            Their's: <br />
            {{ contact.prettyLocalDateCreated }} <br />
            Your's: <br />
            {{ contact.timestampLocal() }}
          </p>
        </div>
        <div class="col-span-10 mb-2 bg-p-300 p-1 pl-8 text-p-800">
          <p
            v-for="(message, ii) in contact.commentLines()"
            :key="ii"
            class="mb-1 max-w-[80ch] text-p-900">
            {{ message }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import GeneralContact from '~/model/message/GeneralContact';

const fb = useFirebase();
const user = fb.fbUser;
const protectedRoutes = useProtectedRoutes();

const contacts = ref<Array<GeneralContact>>([]);

onMounted(() => {
  console.log('Contacts page mounted');
  fb.inClient(({ modDb }) => {
    const isPermitted = protectedRoutes.watchPermission({
      permission: 'ADMIN_CONTACTS',
      user,
      beforeNavigate: async () => {
        // adminLinkButtons.value = [];
      },
    });
    if (!isPermitted) return;

    const db = modDb.getDatabase();
    const ref = modDb.ref(db, DbPath.newContact());
    modDb.onValue(ref, (snapshot) => {
      const data = Object.entries<GeneralContact>(snapshot.val() || {})
        .map(([, value]) => {
          return new GeneralContact({ ...value });
        })
        .sort((a, b) => a.compareTo(b));

      data.forEach((contact) => {
        if (!contacts.value.find((c) => c.id === contact.id)) {
          contacts.value.splice(0, 0, contact);
        }
      });
    });
  });
});
</script>
