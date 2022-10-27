<template>
  <view class="page">
    <Lottie class="lottie" :path="path" :autoplay="false" @init="init"></Lottie>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Lottie, { ILottieAnim } from '@lib/components/lottie/lottie.vue'

const path = ref(
  'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/wly/data.json'
)

const init = (val: ILottieAnim) => {
  val.play()
}
</script>

<style scoped lang="scss">
.lottie {
  width: 270rpx;
  height: 310rpx;
}
</style>
