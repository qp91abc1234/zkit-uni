<template>
  <view class="page">
    <button @click="click">return</button>
    <Audio :bg-music="bgMusic"></Audio>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Audio from '@lib/components/audio/audio.vue'

const bgMusic = ref(
  'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6337df967bf88fb5d916fa96.mp3'
)

const click = () => {
  uni.navigateBack()
}
</script>

<style scoped lang="scss"></style>
