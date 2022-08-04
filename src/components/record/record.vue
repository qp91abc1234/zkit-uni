<template>
  <view
    id="record"
    @touchstart="recordStart"
    @touchmove="touchmove"
    @touchend="recordEnd"
  >
    <slot :scope="status"></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getBoundingInfo, getWxAuth, setWxAuth } from '@/common/utils/index'
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
  (event: 'record-end', src: string, emptyTime: number): void
}>()

const options: any = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
const status = ref<'idle' | 'record' | 'start' | 'stop' | 'cancel'>('idle')
const instance = getCurrentInstance()
const recorderManager = wx.getRecorderManager()
const audioCtx = useAudio()
let emptyTime = 0

const touchmove = async (e: TouchEvent) => {
  const boundingInfo: any = await getBoundingInfo('record', instance)
  const offsetX = e.touches[0].clientX - boundingInfo.left
  const offsetY = e.touches[0].clientY - boundingInfo.top

  if (
    offsetX < 0 ||
    offsetX > boundingInfo.width ||
    offsetY < 0 ||
    offsetY > boundingInfo.height
  ) {
    recordCancel()
  }
}

const recordStart = async () => {
  const authRet = await getWxAuth('scope.record')
  if (authRet !== true) {
    setWxAuth('scope.record')
    return
  }

  status.value = 'record'
  audioCtx.stop()
  emptyTime = new Date().getTime()
  options.durantion = props.duration
  setTimeout(() => {
    // 录音开启会卡线程，因此做延时处理，让渲染先执行
    recorderManager.start(options)
  }, 500)
}

const recordEnd = () => {
  if (status.value !== 'start') return
  status.value = 'stop'
  recorderManager.stop()
}

const recordCancel = () => {
  if (status.value !== 'start') return
  status.value = 'cancel'
  recorderManager.stop()
}

recorderManager.onStart(() => {
  // 从开始录音到录音开启有一段延时
  status.value = 'start'
  emptyTime = new Date().getTime() - emptyTime
})

recorderManager.onStop((res) => {
  if (status.value === 'stop') {
    emits('record-end', res.tempFilePath, emptyTime)
  }

  status.value = 'idle'
})

recorderManager.onInterruptionEnd(recordCancel)
</script>

<style scoped lang="scss"></style>
