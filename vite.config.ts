/// <reference types="vitest/config" />
import pkg from './package.json' assert { type: 'json' }
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  define: {
    APP_NAME: JSON.stringify(pkg.name),
    APP_VERSION: JSON.stringify(pkg.version)
  },
  plugins: [
    tailwindcss({
      optimize: true
    }),
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.ts', '.json']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://ledrive-backend.test',
      '/sanctum': 'http://ledrive-backend.test',
    }
  },
  test: {
    environment: 'happy-dom'
  }
})
