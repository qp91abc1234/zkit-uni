<template>
  <view class="page">
    <canvas
      id="canvas"
      canvas-id="canvas"
      type="2d"
      class="load-canvas"
    ></canvas>
    <Load
      :res-img="resImg"
      :res-canvas="resCanvas"
      @progress="progress"
      @end="end"
    ></Load>
    {{ progressVal }}
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Load from '@lib/components/load/load.vue'

const progressVal = ref('')
const resImg = ref([
  `https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/6335011625e56ff2bd2bdb6b.jpg`
])
const resCanvas = ref(getResWebpArr('boss-idle', 26))

function getResWebpArr(name, num) {
  const ret: string[] = []
  for (let i = 0; i < num; i++) {
    ret.push(
      `https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/wly-webp/${name}/${name}${i}.webp`
    )
  }
  return ret
}

const progress = (val) => {
  progressVal.value = `${val}%`
}

const end = () => {
  progressVal.value = `100%`
}
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  .load-canvas {
    position: absolute;
    height: 0;
  }
}
</style>
