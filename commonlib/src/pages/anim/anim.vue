<template>
  <div class="anim">
    <canvas id="canvas" canvas-id="canvas" type="2d" class="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'

const bossStatus = ref(0)
const canvas = useCanvas('canvas', 20)

const getAnims = () => {
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

onLoad(async () => {
  const animArr = getAnims()
  await canvas.setup()
  await canvas.preloadRes([
    ...animArr[0].resArr,
    ...animArr[1].resArr,
    ...animArr[2].resArr
  ])
  canvas.render(() => {
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
  })
})

onUnload(() => {
  canvas.destroy()
})
</script>

<style scoped lang="scss">
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
