import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),VitePWA({

  registerType: 'autoUpdate',

  manifest: {

    name: 'Reseñas de Películas',

    short_name: 'Reseñas',

    description:
      'Aplicación de reseñas de películas desarrollada con Vue y Supabase',

    theme_color: '#3f51b5',

    background_color: '#ffffff',

    display: 'standalone',

    start_url: '/',

    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]

  }

})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
