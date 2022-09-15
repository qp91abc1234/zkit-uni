<template>
  <view class="audio">
    <view
      class="item"
      v-for="item in btnCfg"
      :key="item.title"
      @click="item.cb"
      >{{ item.title }}</view
    >
  </view>
</template>

<script setup lang="ts">
import { useAudio } from '@lib/common/utils/useAudio'
import { ref } from 'vue'

const audioCtx = useAudio()
const btnCfg = ref([
  {
    title: '播放音乐',
    cb: () => {
      audioCtx.playMusic(
        'https://cdn-s3-gjzc.my.99.com/creation-zone/world_view/62bbfea62d2d2eedeaeae709.mp3'
      )
    }
  },
  {
    title: '暂停音乐',
    cb: () => {
      audioCtx.pauseMusic()
    }
  },
  {
    title: '恢复音乐',
    cb: () => {
      audioCtx.resumeMusic()
    }
  },
  {
    title: '播放音效',
    cb: () => {
      audioCtx.playEffect(
        'https://cdn-s3-gjzc.my.99.com/creation-zone/world_view/62bbfea62d2d2eedeaeae709.mp3'
      )
    }
  },
  {
    title: '暂停音效',
    cb: () => {
      audioCtx.pauseAllEffect()
    }
  },
  {
    title: '恢复音效',
    cb: () => {
      audioCtx.resumeAllEffect()
    }
  }
])
</script>

<style scoped lang="scss">
.audio {
  position: absolute;
  display: flex;
  align-items: center;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .item {
    margin: 30rpx 0;
    width: 200rpx;
    height: 100rpx;
    font-size: 30rpx;
    border-radius: 13rpx;
    text-align: center;
    color: #ffffff;
    background-color: purple;
    line-height: 100rpx;
  }
}
</style>
