<template>
  <view class="audio">
    <view v-if="isMute" class="btn mute" @click="changeStatus(true)"></view>
    <view v-else class="btn play" @click="changeStatus(false)"></view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { MUSIC_STATUS, useMusic, useEffect } from './useAudio'

const props = withDefaults(
  defineProps<{
    isMute: boolean
    bgMusic: string
    isDestroy?: boolean
    isLoop?: boolean
    clickEffect?: string
  }>(),
  {
    isMute: false,
    bgMusic: '',
    isDestroy: true,
    isLoop: true,
    clickEffect:
      'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6337dfda19d6b9f2a3aef001.mp3'
  }
)

const emits = defineEmits<{
  (event: 'update:isMute', val: boolean): void
}>()

const music = useMusic()
const effect = useEffect()

const changeStatus = (isPlay) => {
  emits('update:isMute', !isPlay)
  if (!isPlay) {
    effect.play(props.clickEffect, () => {
      effect.mute(!isPlay)
    })
    music.pause()
  } else {
    effect.mute(!isPlay)
    effect.play(props.clickEffect)
    if (music.getStatus() === MUSIC_STATUS.STOP) {
      music.play(props.bgMusic, props.isLoop)
    }
    if (music.getStatus() === MUSIC_STATUS.PAUSE) {
      music.resume()
    }
  }
}

onShow(() => {
  if (props.isMute) return
  if (music.getStatus() === MUSIC_STATUS.STOP) {
    music.play(props.bgMusic, props.isLoop)
  }
  if (music.getStatus() === MUSIC_STATUS.PAUSE) {
    music.resume()
  }
})

onHide(() => {
  if (props.isMute) return
  music.pause()
  effect.stop()
})

onBeforeUnmount(() => {
  if (!props.isDestroy) return
  music.stop()
  effect.stop()
})

const init = () => {
  effect.mute(props.isMute)
  if (!props.isMute) {
    music.play(props.bgMusic, props.isLoop)
  }
}

init()
</script>

<style lang="scss" scoped>
.audio {
  .btn {
    width: 105rpx;
    height: 105rpx;
    background-size: 100%;
    &.play {
      background-image: url('@lib/assets/play.png');
    }
    &.mute {
      background-image: url('@lib/assets/mute.png');
    }
  }
}
</style>
