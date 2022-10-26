import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/creation-zone/static/': {
        target: 'https://cdn-s3-gjzc.my.99.com',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
