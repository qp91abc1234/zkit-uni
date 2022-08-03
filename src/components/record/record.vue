<template>
  <view class="record">
    <view class="record-btn" @click="record"> record </view>
    <view class="play-btn" @click="play"> play </view>
  </view>
</template>

<script setup lang="ts">
const options: any = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
const recorderManager = wx.getRecorderManager()
const audioContext = wx.createInnerAudioContext()

recorderManager.onStop((res) => {
  console.log('recorder stop', res)
  const { tempFilePath } = res
  audioContext.src = tempFilePath
})

const record = () => {
  recorderManager.start(options)
}

const play = () => {
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
}
</style>
