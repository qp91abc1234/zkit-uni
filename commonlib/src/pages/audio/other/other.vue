<template>
  <view class="page">
    <button @click="click">navigateTo</button>
    <Audio :bg-music="bgMusic"></Audio>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Audio from '@lib/components/audio/audio.vue'

const bgMusic = ref(
  'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6337decb12157eb5bfd558a3.mp3'
)

const click = () => {
  uni.navigateTo({
    url: '/pages/audio/other/other2'
  })
}
</script>

<style scoped lang="scss"></style>
