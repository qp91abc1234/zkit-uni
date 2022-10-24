import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLibStore = defineStore('lib', () => {
  const isMute = ref(false)
  const windowW = uni.getSystemInfoSync().windowWidth
  const windowH = uni.getSystemInfoSync().windowHeight
  const dpr = uni.getSystemInfoSync().pixelRatio

  return {
    isMute,
    windowW,
    windowH,
    dpr
  }
})
