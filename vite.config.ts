import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      dts: true
    }),
    Components({
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/tokens.scss";`
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  },
  // Always use the repository name as the base path so that assets
  // resolve correctly when deployed to GitHub Pages. Using a
  // conditional here caused wrong asset URLs in some environments
  // which resulted in errors like:
  // "Failed to fetch dynamically imported module".
  base: '/GazNetCadLanding/'
})