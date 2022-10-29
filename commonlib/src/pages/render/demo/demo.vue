<template>
  <view class="page">
    <Render class="render" @init="init" @touch-event="handleTouch"></Render>
  </view>
</template>

<script setup lang="ts">
import { px2rpx } from '@lib/common/utils'
import Render, { IRender, IAnim } from '@lib/components/render/render.vue'

const anims = getAnims()
let renderInst: IRender
let hero: IAnim
let touchStart = 0

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

const init = async (val: IRender) => {
  renderInst = val
  await renderInst.preloadRes(anims.bossIdleAnim.resArr)
  await renderInst.preloadRes(anims.bossInjureAnim.resArr)
  addHero()
  addPresent()
}

const addHero = () => {
  hero = renderInst.addAnim(anims.bossIdleAnim.resArr)
  hero.x = renderInst.canvasW / 2
  hero.y = renderInst.canvasH
  hero.anchor = { x: 0.5, y: 1 }
  hero.w = 200
  hero.h = 200
}

const addPresent = () => {
  const presentSize = 100
  const start = 25
  let randomCnt = Math.floor(Math.random() * 3) + 2
  randomCnt = randomCnt === 5 ? 4 : randomCnt
  const posArr: any = []
  posArr[2] = [2, 4]
  posArr[3] = [1, 3, 5]
  posArr[4] = [0, 2, 4, 6]

  for (let i = 0; i < randomCnt; i++) {
    const present = renderInst.addAnim(anims.bossInjureAnim.resArr)
    present.x = start + posArr[randomCnt][i] * presentSize
    present.y = 0
    present.anchor = { x: 0, y: 0.5 }
    present.w = presentSize
    present.h = presentSize
  }
}

const handleTouch = (payload: TouchEvent) => {
  const { type, touches } = payload

  if (type === 'touchstart') {
    const { x, y } = touches[0] as any
    touchStart = px2rpx(x)
  }

  if (type === 'touchmove') {
    const { x, y } = touches[0] as any
    hero.x += px2rpx(x) - touchStart
    touchStart = px2rpx(x)
  }
}
</script>

<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
}
</style>
