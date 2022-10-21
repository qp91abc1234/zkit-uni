import { createSSRApp } from 'vue'
import { setupPinia } from '@/pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  setupPinia(app)
  return {
    app
  }
}
