const ownModuleKeys = ['firebase/analytics', 'firebase/database', 'firebase/auth', 'papaparse'];

const isDebugModulesList = false;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  sourcemap: {
    server: true,
    client: true,
  },
  devtools: { enabled: true },
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon' as never, href: '/favicon-sg.ico' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
      ],
    },
  },
  vite: {
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const seprateModule = ownModuleKeys.find((module) => id.includes(module));
            if (!seprateModule) return;

            if (isDebugModulesList) {
              // eslint-disable-next-line no-console
              console.log({ seprateModule, id });
            }
            return seprateModule;
          },
        },
      },
    },
  },
  nitro: {
    hooks: {
      'prerender:done'() {
        // defined in use-firebase, used to close the db after prerendering
        (globalThis as any).setDbToOffline(); // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    },
  },
});
