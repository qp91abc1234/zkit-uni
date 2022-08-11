<template>
  <view class="content">
    <RecordView @record-end="recordEnd"></RecordView>
    <view class="btn" @click="click">play</view>
  </view>
</template>

<script setup lang="ts">
import RecordView from '@/components/record/recordView.vue'
import { useAudio } from '@/common/utils/useAudio'

const audioCtx = useAudio()
let path = ''

const recordEnd = (src: string) => {
  path = src
}

const click = () => {
  // 语音播放结束需调用 stop，否则下次录音会卡
  // 录音授权逻辑调整
  // 录音样式修改
  audioCtx.play(path)
}
</script>

<style scoped lang="scss">
.btn {
  position: absolute;
  z-index: 100086;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  color: azure;
  background-color: aqua;
  line-height: 50px;
}
</style>
