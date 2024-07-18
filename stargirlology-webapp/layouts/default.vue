<template>
  <div class="common-layout" @click="onClickOut">
    <el-container>
      <el-header>
        <el-row justify="space-between">
          <el-col :span="6">
            <el-menu
              ref="topMenu"
              ellipsis
              class="el-menu-popper"
              mode="horizontal"
              menu-trigger="click"
              :unique-opened="true"
              :popper-offset="16"
              @open="onOpen"
              @close="onClose"
              >

              <el-menu-item index="1">
                <NuxtLink to="/">Stargirlology</NuxtLink>
              </el-menu-item>

              <el-menu-item v-if="user.isGuest()" index="2">
                <NuxtLink  to="/auth/signup">Signup</NuxtLink>
              </el-menu-item>

              <el-menu-item v-if="user.isGuest()" index="3">
                <NuxtLink  to="/auth/login">Login</NuxtLink>
              </el-menu-item>

              <el-menu-item v-if="user.isNotGuest()" index="4">
                <NuxtLink to="/admin" >Admin</NuxtLink>
              </el-menu-item>

              <el-menu-item v-if="user.isNotGuest()" index="5">
                <NuxtLink to="/auth/logout">Logout</NuxtLink>
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="4">
            <el-row justify="end">
              <div class="pt-6">
                <span>{{ user.isNotGuest() ? user.displayName : 'Guest' }}</span>&nbsp;
                <span v-if="user.isNotGuest()">(<NuxtLink  to="/auth/logout">Logout</NuxtLink>)</span>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <slot />
      </el-main>
      <el-footer>
        <footer>

        <el-menu
          ref="bottomMenu"
          ellipsis
          class="el-menu-popper pb-8"
          mode="horizontal"
          menu-trigger="click"
          :popper-offset="16"
          :unique-opened="true"
          @open="onOpen"
          @close="onClose"
          >


          <el-menu-item index="6">
            <a href="https://www.patreon.com/STARGIRLpod/posts" target="_blank">Patreon (Official)</a>
          </el-menu-item>

          <el-menu-item index="7">
            <a href="https://www.instagram.com/emmaglennbaker/" target="_blank">Emma's Instagram (Official)</a>
          </el-menu-item>

          <el-menu-item index="8">
            <a href="https://www.reddit.com/r/STARGIRLpod/" target="_blank">STARGIRL Reddit (Fan page)</a>
          </el-menu-item>

          <el-menu-item index="9">
            <a href="/legal/tos" target="_blank">Terms of service</a>
          </el-menu-item>
          <el-menu-item index="10">
            <a href="/legal/privacy" target="_blank">Privacy Policy</a>
          </el-menu-item>
        </el-menu>
        </footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus'

const fb = useFirebase();
const user = fb.fbUser;
const route = useRouter();
const bottomMenu = ref<typeof ElMenu | null>(null);
const topMenu = ref<typeof ElMenu | null>(null);

watch(user, (newUser) => {
  if (route.currentRoute.value.path === '/auth/login' || route.currentRoute.value.path === '/auth/signup') {
    return;
  }
  if (newUser.isGuest()) {
    navigateTo('/auth/login');
  }
});

const enableClickout = ref(false);

const onClickOut = (evt: MouseEvent) => {
  if (!evt.target) return;
  if (!(evt.target instanceof HTMLElement)) return;
  // if the evt.target has a parent that is a el-popover ignore
  if (evt.target.closest('.el-popover')) {
    return;
  }

  if (!enableClickout.value) return;
  enableClickout.value = false;


  if (bottomMenu.value) {
    bottomMenu.value.close('sub-menu-more');
  }

  if (topMenu.value) {
    topMenu.value.close('sub-menu-more');
  }

}

const onOpen = () => {
  enableClickout.value = true;
}

const onClose = () => {
  enableClickout.value = false;
}
</script>

<style lang="scss" scoped>
.el-main {
  min-height: 80vh;
}
</style>
