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

const changeStatus = (isPlay) => {
  libStore.isMute = !isPlay
  if (isPlay) {
    uni.effect.mute(!isPlay)
    uni.effect.play(props.clickEffect)
  } else {
    uni.effect.play(props.clickEffect, () => {
      uni.effect.mute(!isPlay)
    })
  }
  uni.music.mute(libStore.isMute, props.bgMusic, props.isLoop)
}

onShow(() => {
  uni.music.play(props.bgMusic, props.isLoop)
})

onHide(() => {
  uni.effect.stop()
  uni.music.pause()
})

onBeforeUnmount(() => {
  if (!props.isStop) return
  uni.effect.stop()
  uni.music.stop()
})

const init = () => {
  uni.effect.mute(libStore.isMute)
  uni.music.mute(libStore.isMute, props.bgMusic, props.isLoop)
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
