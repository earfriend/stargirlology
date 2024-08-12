<template>
  <Disclosure :key="key" v-slot="{ open }" as="nav" class="bg-gradient-to-r from-p-400 to-p-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <ClientOnly>
            <DisclosureButton
              :class="{
                'relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset': true,
                'focus:ring-white': true,
                'border-p-500 bg-p-300 hover:bg-p-500': true,
              }">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </ClientOnly>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center"></div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <!-- Desktop Buttons -->
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  item.current ? 'bg-p-200 hover:bg-p-500' : 'border-p-500 bg-p-300 hover:bg-p-500',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</NuxtLink
              >
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <ClientOnly>
                <MenuButton
                  v-if="user.isLoggedIn()"
                  :class="{
                    'relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2': true,
                    'bg-p-300 focus:ring-white focus:ring-offset-gray-800': true,
                  }">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <UserCircleIcon
                    class="h-8 w-8 rounded-full bg-p-300 text-p-800"
                    aria-hidden="true" />
                </MenuButton>
              </ClientOnly>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                :class="{
                  'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-opacity-5 focus:outline-none': true,
                  'bg-white ring-black': true,
                }">
                <MenuItem v-slot="{ active }">
                  <NuxtLink
                    to="/auth/logout"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >Sign out</NuxtLink
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current ? 'bg-p-200 focus:bg-p-500' : 'border-p-500 bg-p-300 focus:bg-p-600',
            'block rounded-md px-3 py-2 text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import type SGUSer from '~/model/user/SGUser';

const fb = useFirebase();
const user = fb.fbUser;

const navigation = ref(new Array<{ name: string; href: string; current: boolean }>());
const key = ref(0);
const router = useRouter();

const setupUser = (newUser: SGUSer) => {
  if (newUser.isNotGuest()) {
    navigation.value = [
      { name: 'Stargirlology', href: '/', current: false },
      { name: 'Transcripts', href: '/transcripts', current: false },
      { name: 'Logout', href: '/auth/logout', current: false },
    ];
    if (newUser.acl.isPermitted('ADMIN_PAGE')) {
      navigation.value.push(
        { name: 'Admin', href: '/admin', current: false }
      );
    }

  } else {
    navigation.value = [
      { name: 'Stargirlology', href: '/', current: false },
      { name: 'Transcripts', href: '/transcripts', current: false },
      { name: 'Signup', href: '/auth/signup', current: false },
      { name: 'Login', href: '/auth/login', current: false },
    ];
  }
  navigation.value.forEach((item) => {
    item.current = item.href === router.currentRoute.value.path;
  });
};
router.afterEach(() => {
  navigation.value.forEach((item) => {
    item.current = item.href === router.currentRoute.value.path;
  });
});

watch(
  user,
  (newUser) => {
    key.value += 1;
    setupUser(newUser);
  },
  { immediate: true }
);
</script>
