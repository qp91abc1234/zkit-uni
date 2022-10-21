<template>
  <view class="page">
    <Render class="render" @init="init" @render="render"></Render>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Render from '@lib/components/render/render.vue'

const bossStatus = ref('bossIdleAnim')
const anims = getAnims()

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
    resArr: getResWebpArr('boss-idle', 26),
    load: false
  }

  const bossInjureAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-injure', 25),
    load: false
  }

  const bossDeadAnim = {
    width: 350,
    height: 543,
    resArr: getResWebpArr('boss-dead', 26),
    load: false
  }

  return { bossIdleAnim, bossInjureAnim, bossDeadAnim }
}

const init = async (val) => {
  const { preloadRes } = val
  await preloadRes(anims.bossIdleAnim.resArr)
  anims.bossIdleAnim.load = true
  await preloadRes(anims.bossInjureAnim.resArr)
  anims.bossInjureAnim.load = true
  await preloadRes(anims.bossDeadAnim.resArr)
  anims.bossDeadAnim.load = true
}

const render = (val) => {
  const { drawAnim } = val
  anims[bossStatus.value].load &&
    drawAnim(
      `${bossStatus.value}`,
      anims[bossStatus.value].resArr,
      0,
      0,
      anims[bossStatus.value].width,
      anims[bossStatus.value].height,
      () => {
        if (bossStatus.value === 'bossIdleAnim') {
          bossStatus.value = 'bossInjureAnim'
        } else if (bossStatus.value === 'bossInjureAnim') {
          bossStatus.value = 'bossDeadAnim'
        } else if (bossStatus.value === 'bossDeadAnim') {
          bossStatus.value = 'bossIdleAnim'
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
