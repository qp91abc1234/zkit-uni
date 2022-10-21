import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLibStore = defineStore('lib', () => {
  const isMute = ref(false)
  const screenW = uni.getSystemInfoSync().screenWidth
  const screenH = uni.getSystemInfoSync().screenHeight
  const dpr = uni.getSystemInfoSync().pixelRatio

  return {
    isMute,
    screenW,
    screenH,
    dpr
  }
})
