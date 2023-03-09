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
    zkit.effect.mute(!isPlay)
    zkit.effect.play(props.clickEffect)
  } else {
    zkit.effect.play(props.clickEffect, () => {
      zkit.effect.mute(!isPlay)
    })
  }
  zkit.music.mute(libStore.isMute, props.bgMusic, props.isLoop)
}

onShow(() => {
  zkit.music.play(props.bgMusic, props.isLoop)
})

onHide(() => {
  zkit.effect.stopPool()
  zkit.effect.stop()
  zkit.music.pause()
})

onBeforeUnmount(() => {
  if (!props.isStop) return
  zkit.effect.stopPool()
  zkit.effect.stop()
  zkit.music.stop()
})

const init = () => {
  zkit.effect.mute(libStore.isMute)
  zkit.music.mute(libStore.isMute, props.bgMusic, props.isLoop)
}

init()
</script>

<style lang="scss" scoped>
.audio {
  width: 100%;
  height: 100%;
  .btn {
    width: 100%;
    height: 100%;
    background-size: 100%;
    &.play {
      background-image: url('@/assets/play.png');
    }
    &.mute {
      background-image: url('@/assets/mute.png');
    }
  }
}
</style>
