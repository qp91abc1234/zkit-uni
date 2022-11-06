<template>
  <view class="page">
    <view class="top">
      <button @click="handleAddImg">添加图片</button>
      <button @click="handleRemoveImg">移除图片</button>
      <button @click="handleAddAnim">添加动画</button>
      <button @click="handleChangeAnim">切换动画</button>
      <button @click="handleRemoveAnim">移除动画</button>
      <button @click="handleTweenAnim">缓动动画</button>
      <button @click="handleAddSpine">添加骨骼</button>
      <button @click="handleRemoveSpine">移除骨骼</button>
      <button @click="handleDemo">demo</button>
    </view>
    <Render class="render" @init="init"></Render>
  </view>
</template>

<script setup lang="ts">
import Render from '@lib/components/render/render.vue'

const anims = getAnims()
let renderInst: ZKit.Render
let img: ZKit.Img
let anim: ZKit.Anim
let spine: ZKit.Spine

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

const init = (val: ZKit.Render) => {
  renderInst = val
}

const handleAddImg = () => {
  img = renderInst.createImg(anims.bossIdleAnim.resArr[0])
  renderInst.addChild(img)
  img.x = 375
  img.y = 200
  img.w = 200
  img.h = 200
  img.rotate = 180
  img.alpha = 0.5
}

const handleRemoveImg = () => {
  img.removeFromParent()
}

const handleAddAnim = () => {
  anim = renderInst.createAnim(anims.bossInjureAnim.resArr)
  renderInst.addChild(anim)
  anim.x = 375
  anim.y = 200
  anim.w = 200
  anim.h = 200
  anim.count = 3
  anim.alpha = 0.5
  anim.scale = 0.5
  const child = anim.addChild(
    renderInst.createImg(anims.bossDeadAnim.resArr[10])
  )
  child.y = -100
  child.w = 100
  child.h = 100
  child.anchor = { x: 0.5, y: 1 }
}

const handleChangeAnim = () => {
  anim.changeAnim(anims.bossDeadAnim.resArr)
}

const handleRemoveAnim = () => {
  anim.removeFromParent()
}

const handleTweenAnim = () => {
  renderInst.tween(anim, 2000, 'y', 200, 300)
  renderInst.tween(anim, 2000, 'rotate', 0, 180)
}

const handleAddSpine = () => {
  spine = renderInst.createSpine(
    'https://md-pic-lib.oss-cn-hangzhou.aliyuncs.com/spine/spineboy'
  )
  spine.x = 375
  spine.y = 200
  spine.scale = 0.3
  spine.play('walk')
  renderInst.addChild(spine)
}

const handleRemoveSpine = () => {
  spine.removeFromParent()
}

const handleDemo = () => {
  uni.navigateTo({
    url: '/pages/render/demo/demo'
  })
}
</script>

<style scoped lang="scss">
.top {
  align-items: flex-start;
  overflow-y: scroll;
  height: 400rpx;
  flex-direction: row;
  flex-wrap: wrap;
  button {
    margin: 20rpx;
  }
}
.render {
  width: 100%;
  height: 100%;
}
</style>
