<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'
import Img from '@lib/components/render/img'
import Anim from '@lib/components/render/anim'

const props = withDefaults(
  defineProps<{
    frameNum?: number
  }>(),
  {
    frameNum: 20
  }
)

const emits = defineEmits<{
  (
    event: 'init',
    val: {
      preloadRes: typeof canvas.preloadRes
      clearRes: typeof canvas.clearRes
      addImg: typeof addImg
      addAnim: typeof addAnim
    }
  ): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()
const queue: any[] = []

onLoad(async () => {
  await canvas.setup('anim-canvas', inst)
  emits('init', {
    preloadRes: canvas.preloadRes,
    clearRes: canvas.clearRes,
    addImg,
    addAnim
  })
  canvas.render(render, props.frameNum)
})

onUnload(() => {
  canvas.destroy()
})

function addImg(src: string) {
  return new Img(src, canvas, queue)
}

function addAnim(src: string[]) {
  return new Anim(src, canvas, queue)
}

function render() {
  queue.sort((a, b) => {
    return a.zIndex - b.zIndex
  })

  const delIndex: number[] = []
  for (let i = 0; i < queue.length; i++) {
    if (!queue[i].visible) {
      continue
    }
    if (queue[i].destroy) {
      delIndex.push(i)
      continue
    }
    queue[i].draw && queue[i].draw()
  }

  delIndex.forEach((val) => {
    queue.splice(val, 1)
  })
}
</script>

<style lang="scss" scoped>
.anim-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
