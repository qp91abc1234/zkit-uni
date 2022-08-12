<template>
  <view
    id="record"
    @click="click"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
    @touchcancel="touchCancel"
  >
    <slot :scope="status"></slot>
  </view>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useAuthStore } from '@/pinia/authStore'
import { getBoundingInfo } from '@/common/utils/uniUtils'
import { useAudio } from '@/common/utils/useAudio'
import { RECORD_STATUS, ERR_MSG } from './recordConstant'

const props = withDefaults(
  defineProps<{
    mode?: 'click' | 'touch'
    minTime?: number
    duration?: number
  }>(),
  {
    mode: 'touch',
    minTime: 1000,
    duration: 10000
  }
)

const emits = defineEmits<{
  (event: 'record-end', src: string): void
  (event: 'error', msg, err?): void
}>()

const options: any = {
  duration: 10000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3',
  frameSize: 50
}
const status = ref<RECORD_STATUS>(RECORD_STATUS.IDLE)
const instance = getCurrentInstance()
const recorderManager = uni.getRecorderManager()
const authStore = useAuthStore()
const audioCtx = useAudio()

const click = () => {
  if (props.mode !== 'click') return
  if (status.value === RECORD_STATUS.IDLE) {
    recordStart()
  } else {
    recordEnd()
  }
}

const touchStart = async (e: TouchEvent) => {
  if (props.mode !== 'touch') return
  recordStart()
}

const touchMove = async (e: TouchEvent) => {
  if (props.mode !== 'touch') return
  if (
    status.value === RECORD_STATUS.READY ||
    status.value === RECORD_STATUS.RECORD
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
      recordCancel()
    }
  }
}

const touchEnd = async (e: TouchEvent) => {
  if (props.mode !== 'touch') return
  recordEnd()
}

const touchCancel = () => {
  if (props.mode !== 'touch') return
  recordCancel()
}

const recordStart = async () => {
  if (status.value !== RECORD_STATUS.IDLE) return

  status.value = RECORD_STATUS.READY

  // 停止音频，否则会延时录音设备唤醒
  audioCtx.stop()
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, 100)
  })

  let authRet: any = await authStore.getAuthInfo('scope.record')
  if (authRet !== true) {
    if (authRet === undefined) {
      // 未进行授权判断
      authRet = await authStore.setAuthInfo('scope.record')
    } else {
      // 授权被拒绝
      emits('error', ERR_MSG.AUTH_DENY, authRet)
    }
    status.value = RECORD_STATUS.IDLE
    return
  }

  if (status.value === RECORD_STATUS.READY) {
    status.value = RECORD_STATUS.RECORD
    options.durantion = props.duration
    // 唤醒录音
    // 1、start 后一段延时唤醒录音设备
    // 2、唤醒录音设备后一段延时触发 onStart 回调
    recorderManager.start(options)
  }
}

const recordEnd = () => {
  if (status.value === RECORD_STATUS.READY) {
    status.value = RECORD_STATUS.IDLE
  }
  if (status.value === RECORD_STATUS.RECORD) {
    status.value = RECORD_STATUS.STOP
    recorderManager.stop()
  }
}

const recordCancel = () => {
  if (status.value === RECORD_STATUS.READY) {
    status.value = RECORD_STATUS.IDLE
  }
  if (status.value === RECORD_STATUS.RECORD) {
    status.value = RECORD_STATUS.CANCEL
    recorderManager.stop()
  }
}

recorderManager.onStart(() => {
  if (status.value !== RECORD_STATUS.RECORD) {
    // 唤醒录音阶段取消录音
    recorderManager.stop()
  }
})

recorderManager.onStop((res) => {
  if (res.duration <= props.minTime) {
    emits('error', ERR_MSG.TIME_NOT_ENOUGH)
  } else if (
    status.value === RECORD_STATUS.STOP ||
    status.value === RECORD_STATUS.RECORD
  ) {
    // status === stop: 松手后录音结束
    // status === record: 超时后录音结束
    emits('record-end', res.tempFilePath)
  }
  status.value = RECORD_STATUS.IDLE
})
</script>

<style scoped lang="scss"></style>
