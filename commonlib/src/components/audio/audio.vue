<template>
  <view class="audio">
    <view
      v-if="libStore.isMute"
      class="btn mute"
      @click="changeStatus(true)"
    ></view>
    <view v-else class="btn play" @click="changeStatus(false)"></view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { useLibStore } from '@lib/pinia/libStore'
import { MUSIC_STATUS, useMusic, useEffect } from '@lib/common/utils/useAudio'

const props = withDefaults(
  defineProps<{
    bgMusic: string
    isStop?: boolean
    isLoop?: boolean
    clickEffect?: string
  }>(),
  {
    bgMusic: '',
    isStop: true,
    isLoop: true,
    clickEffect:
      'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6337dfda19d6b9f2a3aef001.mp3'
  }
)

const libStore = useLibStore()
const music = useMusic()
const effect = useEffect()

const changeStatus = (isPlay) => {
  libStore.isMute = !isPlay
  if (!isPlay) {
    effect.play(props.clickEffect, () => {
      effect.mute(!isPlay)
    })
    music.pause()
  } else {
    effect.mute(!isPlay)
    effect.play(props.clickEffect)
    if (music.getStatus() === MUSIC_STATUS.STOP) {
      // b 页面静音，返回 a 页面取消静音的情况
      music.play(props.bgMusic, props.isLoop)
    }
    if (music.getStatus() === MUSIC_STATUS.PAUSE) {
      music.resume()
    }
  }
}

onShow(() => {
  if (libStore.isMute) return
  if (music.getStatus() === MUSIC_STATUS.STOP) {
    // b 页面返回 a 页面的情况
    music.play(props.bgMusic, props.isLoop)
  }
  if (music.getStatus() === MUSIC_STATUS.PAUSE) {
    music.resume()
  }
})

onHide(() => {
  if (libStore.isMute) return
  music.pause()
  effect.stop()
})

onBeforeUnmount(() => {
  if (!props.isStop) return
  music.stop()
  effect.stop()
})

const init = () => {
  effect.mute(libStore.isMute)
  if (!libStore.isMute) {
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
