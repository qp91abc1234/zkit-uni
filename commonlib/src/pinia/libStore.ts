import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLibStore = defineStore('libStore', () => {
  const windowW = uni.getSystemInfoSync().windowWidth
  const windowH = uni.getSystemInfoSync().windowHeight
  const dpr = uni.getSystemInfoSync().pixelRatio
  const menuPos = wx.getMenuButtonBoundingClientRect()
  const menuTop = computed(() => zkit.utils.px2rpx(menuPos.top))
  const isMute = ref(false)

  return {
    windowW,
    windowH,
    dpr,
    menuPos,
    menuTop,
    isMute
  }
})
