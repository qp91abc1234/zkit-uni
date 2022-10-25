<template>
  <view class="page">
    <Lottie class="lottie" :path="path" :autoplay="false" @init="init"></Lottie>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Lottie from '@lib/components/lottie/lottie.vue'
import { ILottieAnim } from '@lib/common/types/lottie.d'

const path = ref(
  'https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/wly/data.json'
)

const init = (val: ILottieAnim) => {
  val.play()
}
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  .lottie {
    position: absolute;
    width: 270rpx;
    height: 310rpx;
  }
}
</style>
