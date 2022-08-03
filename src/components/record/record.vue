<template>
  <view class="record">
    <view class="record-btn" @touchstart="recordStart" @touchend="recordEnd">
      <view class="center" :class="{ 'is-record': status === 'start' }">
        record
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
const recorderManager = wx.getRecorderManager()
let audioContext: WechatMiniprogram.InnerAudioContext | null =
  wx.createInnerAudioContext()
const status = ref<'idle' | 'start' | 'stop' | 'cancel'>('idle')

recorderManager.onStop((res) => {
  if (status.value === 'stop') {
    setTimeout(() => {
      play(res.tempFilePath)
    }, 1000)
  }

  status.value = 'idle'
})

const recordStart = () => {
  status.value = 'start'
  setTimeout(() => {
    options.durantion = props.duration
    recorderManager.start(options)
  }, 100)
}

const recordCancel = () => {
  status.value = 'cancel'
  setTimeout(() => {
    recorderManager.stop()
  }, 100)
}

const recordEnd = () => {
  status.value = 'stop'
  setTimeout(() => {
    recorderManager.stop()
  }, 100)
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
