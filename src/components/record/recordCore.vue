<template>
  <view
    id="record"
    @touchstart="touchStart"
    @touchmove="touchmove"
    @touchend="touchEnd"
    @touchcancel="touchCancel"
  >
    <slot :scope="status"></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import {
  getBoundingInfo,
  getAuthInfo,
  setAuthInfo
} from '@/common/utils/uniUtils'
import { useAudio } from '@/common/utils/useAudio'

const props = withDefaults(
  defineProps<{
    duration?: number
  }>(),
  {
    duration: 10000
  }
)

const emits = defineEmits<{
  (event: 'record-end', src: string): void
}>()

const options: any = {
  duration: 10000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3',
  frameSize: 50
}
const status = ref<'idle' | 'auth' | 'wakeup' | 'start' | 'stop' | 'cancel'>(
  'idle'
)
const instance = getCurrentInstance()
const recorderManager = uni.getRecorderManager()
const audioCtx = useAudio()

const touchStart = async () => {
  if (status.value !== 'idle') return

  status.value = 'auth'
  const authRet = await getAuthInfo('scope.record')
  if (authRet !== true) {
    setAuthInfo('scope.record')
    return
  }

  if (status.value === 'auth') {
    status.value = 'wakeup'
    audioCtx.stop()
    options.durantion = props.duration
    // 唤醒录音
    // 1、start 后一段延时唤醒录音设备
    // 2、唤醒录音设备后一段延时触发 onStart 回调
    recorderManager.start(options)
  } else {
    // 授权判断期间录音取消
    status.value = 'idle'
  }
}

const touchmove = async (e: TouchEvent) => {
  if (
    status.value === 'auth' ||
    status.value === 'wakeup' ||
    status.value === 'start'
  ) {
    const boundingInfo: any = await getBoundingInfo('record', instance)
    const offsetX = e.touches[0].clientX - boundingInfo.left
    const offsetY = e.touches[0].clientY - boundingInfo.top
    if (
      offsetX < 0 ||
      offsetX > boundingInfo.width ||
      offsetY < 0 ||
      offsetY > boundingInfo.height
    ) {
      touchCancel()
    }
  }
}

const touchEnd = () => {
  if (status.value === 'auth' || status.value === 'wakeup') {
    status.value = 'stop'
  }
  if (status.value === 'start') {
    status.value = 'stop'
    recorderManager.stop()
  }
}

const touchCancel = () => {
  if (status.value === 'auth' || status.value === 'wakeup') {
    status.value = 'cancel'
  }
  if (status.value === 'start') {
    status.value = 'cancel'
    recorderManager.stop()
  }
}

recorderManager.onStart(() => {
  if (status.value === 'wakeup') {
    status.value = 'start'
  } else {
    // 唤醒录音阶段取消录音
    status.value = 'cancel'
    recorderManager.stop()
  }
})

recorderManager.onStop((res) => {
  // status === stop: 松手后录音结束
  // status === start: 超时后录音结束
  if (status.value === 'stop' || status.value === 'start') {
    emits('record-end', res.tempFilePath)
  }
  status.value = 'idle'
})
</script>

<style scoped lang="scss"></style>
