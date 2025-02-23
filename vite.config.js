import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '^/api': {
        target: process.env.VITE_APP_API_BASE,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 80,
    host: '0.0.0.0',
  },
})
