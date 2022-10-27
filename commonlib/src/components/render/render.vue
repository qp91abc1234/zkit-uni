<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
import { CB_TYPE as cb_type } from '@lib/components/render/base'
import Img from '@lib/components/render/img'
import Anim from '@lib/components/render/anim'

export type CB_TYPE = cb_type
export type IImg = Img
export type IAnim = Anim
export interface IRender {
  preloadRes: (res: string[]) => Promise<boolean>
  clearRes: (res?: string[]) => void
  addImg(src: string): Img
  addAnim(src: string[]): Anim
}

const props = withDefaults(
  defineProps<{
    frameNum?: number
  }>(),
  {
    frameNum: 20
  }
)

const emits = defineEmits<{
  (event: 'init', val: IRender): void
  (event: 'loop', val: IRender): void
  (event: 'afterLoop', val: IRender): void
}>()

const inst = getCurrentInstance()
const canvas = useCanvas()
const queue: any[] = []
const renderInst = {
  preloadRes: canvas.preloadRes,
  clearRes: canvas.clearRes,
  addImg,
  addAnim
}

onMounted(async () => {
  await canvas.setup('anim-canvas', inst)
  emits('init', renderInst)
  canvas.render(render, props.frameNum)
})

onBeforeUnmount(() => {
  canvas.destroy()
})

function addImg(src: string) {
  return new Img(canvas, queue, src)
}

function addAnim(src: string[]) {
  return new Anim(canvas, queue, src)
}

function render() {
  emits('loop', renderInst)
  queue.sort((a, b) => {
    return a.zIndex - b.zIndex
  })

  for (let i = 0; i < queue.length; i++) {
    queue[i].draw && queue[i].draw()
  }
  emits('afterLoop', renderInst)
}
</script>

<style lang="scss" scoped>
.anim-canvas {
  width: 100%;
  height: 100%;
}
</style>
