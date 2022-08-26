<script setup lang="ts">
import VideoPlayer from '@/components/videoPlayer/videoPlayer.vue'

const ready = () => {
  console.log('ready')
}

const pause = () => {
  console.log('pause')
}
</script>

<template>
  <div class="video-player-wrap">
    <VideoPlayer
      class="video-player"
      :autoplay="false"
      poster="https://cdn-s3-gjzc.my.99.com/pre-creation-zone/image/628739e18ac5bc002186acb0.png"
      path="https://cdn-s3-gjzc.my.99.com/pre-creation-zone/video/628739e18ac5bc002186acb1.mp4"
      blur-bg="https://cdn-s3-gjzc.my.99.com/pre-creation-zone/image/628739e18ac5bc002186acb0.png"
      :control-bar="{ fullscreenToggle: false }"
      aspect-ratio="9:16"
      :events="['pause']"
      @ready="ready"
      @pause="pause"
    >
      <div class="water-mask"></div>
    </VideoPlayer>
  </div>
</template>

<style scoped lang="scss">
.video-player-wrap {
  width: 100%;
  height: 100%;
  .video-player {
    width: 400px;
    height: 300px;
    .water-mask {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 100px;
      height: 50px;
      background: url('@/assets/mask.png');
      background-size: 100%;
    }
  }
}
</style>
