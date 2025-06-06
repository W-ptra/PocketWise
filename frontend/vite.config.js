import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~components': path.resolve(__dirname, './src/components'),
      '~pages': path.resolve(__dirname, './src/pages'),
      '~utils': path.resolve(__dirname, './src/utils'),
      '~assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    fs: {
      strict: false
    },
    cors: true,
    proxy: {
      '/googleusercontent': {
        target: 'https://lh3.googleusercontent.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/googleusercontent/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      }
    }
  }
})
