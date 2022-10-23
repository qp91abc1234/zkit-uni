<template>
  <view class="page">
    <Render class="render" @init="init"></Render>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Render from '@lib/components/render/render.vue'
import Img from '@lib/components/render/img'
import Anim, { CB_TYPE } from '@lib/components/render/anim'

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

const init = (val) => {
  const { preloadRes, clearRes, addImg, addAnim } = val

  const img: Img = addImg(anims.bossIdleAnim.resArr[0])
  img.x = 100
  img.w = 200
  img.h = 200
  img.zIndex = 1

  const anim: Anim = addAnim(anims.bossInjureAnim.resArr)
  anim.x = 100
  anim.w = 300
  anim.h = 200
  anim.count = 3
  anim.addCb(CB_TYPE.CHANGE_ANIM, () => {
    console.log('changeAnim')
  })
  anim.addCb(CB_TYPE.LOOP, () => {
    console.log('loop')
  })
  setTimeout(() => {
    anim.changeAnim(anims.bossDeadAnim.resArr)
  }, 1000)
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
