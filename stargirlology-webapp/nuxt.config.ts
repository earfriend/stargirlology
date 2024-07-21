// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',

    // '@nuxtjs/stylelint-module',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon' as never, href: '/favicon-sg.ico' },
        { rel: 'stylesheet', href:'https://rsms.me/inter/inter.css' },
      ],
    },
  },
})