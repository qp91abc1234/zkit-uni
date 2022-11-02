import { createSSRApp } from 'vue'
import { setupPinia } from '@/pinia'
import App from './App.vue'
import '@lib/init'

export function createApp() {
  const app = createSSRApp(App)
  setupPinia(app)
  return {
    app
  }
}
