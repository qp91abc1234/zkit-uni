<template>
  <view class="page">
    <Render
      class="render"
      @init="init"
      @loop="loop"
      @touch-event="handleTouch"
    ></Render>
  </view>
</template>

<script setup lang="ts">
import { px2rpx } from '@lib/common/utils'
import Render, { IRender, IAnim } from '@lib/components/render/render.vue'

const anims = getAnims()
let renderInst: IRender
let hero: IAnim
let touchStart = 0
const presentObj: any = { index: 0 }

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

const loop = () => {
  const keys = Object.keys(presentObj)
  keys.forEach((val) => {
    if (val === 'index') return
    if (
      Math.abs(presentObj[val].x - hero.x) <
        presentObj[val].w / 2 + hero.w / 2 &&
      Math.abs(presentObj[val].y - hero.y) < presentObj[val].h / 2 + hero.h / 2
    ) {
      presentObj[val].destroy = true
      delete presentObj[val]
    }
  })
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

const addHero = () => {
  hero = renderInst.addAnim(anims.bossIdleAnim.resArr)
  hero.x = renderInst.canvasW / 2
  hero.y = renderInst.canvasH - 100
  hero.w = 200
  hero.h = 200
}

const addPresent = () => {
  const presentSize = 100
  const start = 25
  let randomCnt = Math.floor(Math.random() * 3) + 2
  randomCnt = 3 // randomCnt === 5 ? 4 : randomCnt
  const posArr: any = []
  posArr[2] = [2, 4]
  posArr[3] = [1, 3, 5]
  posArr[4] = [0, 2, 4, 6]

  for (let i = 0; i < randomCnt; i++) {
    const present = renderInst.addAnim(anims.bossInjureAnim.resArr)
    present.x = start + posArr[randomCnt][i] * presentSize + presentSize / 2
    present.y = -presentSize / 2
    present.w = presentSize
    present.h = presentSize
    const tween = renderInst.tween(
      present,
      10000,
      'y',
      0,
      renderInst.canvasH + presentSize
    )
    tween.succ = () => {
      present.destroy = true
    }
    presentObj[presentObj.index++] = present
  }
}
</script>

<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
}
</style>
