<template>
  <view class="page">
    <button @click="handleAddImg">添加图片</button>
    <button @click="handleRemoveImg">移除图片</button>
    <button @click="handleAddAnim">添加动画</button>
    <button @click="handleChangeAnim">切换动画</button>
    <button @click="handleRemoveAnim">移除动画</button>
    <Render class="render" @init="init"></Render>
  </view>
</template>

<script setup lang="ts">
import Render from '@lib/components/render/render.vue'
import { IImg, IAnim } from '@lib/common/types/render.d'

const anims = getAnims()
let addImg
let addAnim
let img: IImg
let anim: IAnim

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
  addImg = val.addImg
  addAnim = val.addAnim
}

const handleAddImg = () => {
  img = addImg(anims.bossIdleAnim.resArr[0])
  img.x = 150
  img.w = 200
  img.h = 200
}

const handleRemoveImg = () => {
  img.destroy()
}

const handleAddAnim = () => {
  anim = addAnim(anims.bossInjureAnim.resArr)
  anim.x = 400
  anim.w = 200
  anim.h = 200
  anim.count = 3
}

const handleChangeAnim = () => {
  anim.changeAnim(anims.bossDeadAnim.resArr)
}

const handleRemoveAnim = () => {
  anim.destroy()
}
</script>

<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
}
</style>
