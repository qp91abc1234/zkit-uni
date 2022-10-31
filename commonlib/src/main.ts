import { createSSRApp } from 'vue'
import { setupGlobal } from '@lib/global'
import { setupPinia } from '@lib/pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  setupGlobal()
  setupPinia(app)
  return {
    app
  }
}
