<template>
  <div class="page">
    <Audio v-model:is-mute="isMute" :bg-music="bgMusic"></Audio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Audio from '@lib/components/audio/audio.vue'

const isMute = ref(false)
const bgMusic = ref(
  'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6337decb12157eb5bfd558a3.mp3'
)
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
