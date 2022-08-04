<template>
  <view class="record">
    <view
      id="record-btn"
      class="record-btn"
      @touchstart="recordStart"
      @touchmove="recordCancel"
      @touchend="recordEnd"
    >
      <view class="center" :class="{ 'is-record': status === 'start' }">
        record
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getBoundingInfo, getWxAuth, setWxAuth } from '@/common/utils/index'

const props = withDefaults(
  defineProps<{
    duration?: number
  }>(),
  {
    duration: 10000
  }
)

const options: any = {
  duration: 10000,
  format: 'mp3'
}
const status = ref<'idle' | 'start' | 'stop' | 'cancel'>('idle')
const opeDelay = 100
const instance = getCurrentInstance()
const recorderManager = wx.getRecorderManager()
let audioContext: WechatMiniprogram.InnerAudioContext | null =
  wx.createInnerAudioContext()

recorderManager.onStop((res) => {
  if (status.value === 'stop') {
    setTimeout(() => {
      play(res.tempFilePath)
    }, 1000)
  }

  status.value = 'idle'
})

const recordStart = async () => {
  const authRet = await getWxAuth('scope.record')
  if (authRet !== true) {
    setWxAuth('scope.record')
    return
  }

  status.value = 'start'
  setTimeout(() => {
    options.durantion = props.duration
    recorderManager.start(options)
  }, opeDelay)
}

const recordCancel = async (e: TouchEvent) => {
  if (status.value !== 'start') return
  const boundingInfo: any = await getBoundingInfo('record-btn', instance)
  const offsetX = e.touches[0].clientX - boundingInfo.left
  const offsetY = e.touches[0].clientY - boundingInfo.top

  if (
    offsetX < 0 ||
    offsetX > boundingInfo.width ||
    offsetY < 0 ||
    offsetY > boundingInfo.height
  ) {
    status.value = 'cancel'
    setTimeout(() => {
      recorderManager.stop()
    }, opeDelay)
  }
}

const recordEnd = () => {
  if (status.value !== 'start') return
  status.value = 'stop'
  setTimeout(() => {
    recorderManager.stop()
  }, opeDelay)
}

const play = (path) => {
  audioContext = audioContext || wx.createInnerAudioContext()
  audioContext.onStop(() => {
    audioContext!.destroy()
    audioContext = null
  })
  audioContext.onEnded(() => {
    audioContext!.destroy()
    audioContext = null
  })
  audioContext.src = path
  if (audioContext.paused) {
    audioContext.play()
  } else {
    audioContext.stop()
  }
}
</script>

<style scoped lang="scss">
.record {
  display: flex;
  .record-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 170rpx;
    height: 170rpx;
    border-radius: 50%;
    background-color: rgb(238 175 175);
    .center {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      text-align: center;
      color: antiquewhite;
      background-color: palevioletred;
      line-height: 150rpx;
      &.is-record {
        background-color: purple;
      }
    }
  }
}
</style>
