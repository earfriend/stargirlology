<template>
  <TitledLinkButtons :title="title" :links="adminLinkButtons" />
</template>

<script setup lang="ts">
import type { TitledLinkButton } from '~/components/TitledLinkButtons.vue';

const protectedRoutes = useProtectedRoutes();
const fb = useFirebase();
const user = fb.fbUser;
const title = 'Admin';
const adminLinkButtons: Ref<Array<TitledLinkButton>> = ref([]);

useSeoMeta({
  title: 'Admin',
  description: 'Admin page',
});

onMounted(() => {
  fb.inClient(() => {
    protectedRoutes.watchPermission({
      permission: 'ADMIN_PAGE',
      user,
      beforeNavigate: async () => {
        adminLinkButtons.value = [];
      },
    });

    adminLinkButtons.value.push({ title: 'Upload Transcript', to: '/admin/upload-transcript' });
    if (user.value.acl.isPermitted('ADMIN_CONTACTS')) {
      adminLinkButtons.value.push({ title: 'Contacts', to: '/admin/contacts' });
    }
  });
});
</script>
