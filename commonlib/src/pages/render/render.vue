<template>
  <view class="page">
    <Render class="render" :res="res" @render="render"></Render>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Render from '@lib/components/render/render.vue'

const bossStatus = ref(0)
const animArr = getAnims()
const res = ref([
  ...animArr[0].resArr,
  ...animArr[1].resArr,
  ...animArr[2].resArr
])

function getAnims() {
  function getResWebpArr(name, num) {
    const ret: string[] = []
    for (let i = 0; i < num; i++) {
      ret.push(
        `https://cdn-s3-gjzc.my.99.com/creation-zone/static/v1/activity/wly-webp/${name}/${name}${i}.webp`
      )
    }
    return ret
  }

  const bossIdleAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-idle', 26)
  }

  const bossInjureAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-injure', 25)
  }

  const bossDeadAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-dead', 26)
  }

  return [bossIdleAnim, bossInjureAnim, bossDeadAnim]
}

const render = (canvas) => {
  canvas.drawAnim(
    `${bossStatus.value}`,
    animArr[bossStatus.value].resArr,
    0,
    0,
    animArr[bossStatus.value].width,
    animArr[bossStatus.value].height,
    () => {
      bossStatus.value++
      if (bossStatus.value === animArr.length) {
        bossStatus.value = 0
      }
    }
  )
}
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  .render {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
