<template>
  <view class="page">
    <Render class="render" @init="init"></Render>
  </view>
</template>

<script setup lang="ts">
import Render, { IRender, IAnim } from '@lib/components/render/render.vue'

const anims = getAnims()
let renderInst: IRender
let hero: IAnim

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

  return { bossIdleAnim, bossInjureAnim, bossDeadAnim }
}

const init = (val: IRender) => {
  renderInst = val
  addHero()
}

const addHero = () => {
  hero = renderInst.addAnim(anims.bossIdleAnim.resArr)
  hero.x = renderInst.canvasW / 2
  hero.y = renderInst.canvasH
  hero.anchor = { x: 0.5, y: 1 }
  hero.w = 200
  hero.h = 200
}
</script>

<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
}
</style>
