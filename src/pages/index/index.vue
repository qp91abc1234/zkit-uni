<template>
  <view class="content">
    <RecordBtn
      class="record-btn"
      @record-end="recordEnd"
      @error="handleError"
    ></RecordBtn>
    <view class="play-btn" @click="click">play</view>
  </view>
</template>

<script setup lang="ts">
import RecordBtn from '@/components/record/recordBtn.vue'
import { useAudio } from '@/common/utils/useAudio'
import { ERR_MSG } from '@/components/record/recordConstant'

const audioCtx = useAudio()
let path = ''

const recordEnd = (src: string) => {
  path = src
}

const handleError = (msg, e) => {
  if (msg === ERR_MSG.AUTH_DENY) {
    uni.showModal({
      title: '提示',
      content: '请通过右上角胶囊按钮，进入设置开启授权~',
      showCancel: false
    })
  }
  if (msg === ERR_MSG.TIME_NOT_ENOUGH) {
    uni.showToast({ title: '时长太短' })
  }
}

const click = () => {
  // 语音播放结束需调用 stop，否则下次录音会卡
  // 录音样式修改
  audioCtx.play(path)
}
</script>

<style scoped lang="scss">
.content {
  .record-btn {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
  .play-btn {
    position: absolute;
    top: 100px;
    left: 50%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    color: azure;
    background-color: aqua;
    line-height: 50px;
    transform: translate(-50%);
  }
}
</style>
