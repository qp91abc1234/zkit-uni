<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
import { px2rpx } from '@lib/common/utils'
import Tween, { ITweenFunc } from '@lib/components/render/utils/tween'
import { CB_TYPE as cb_type } from '@lib/components/render/entity/entity'
import Img from '@lib/components/render/entity/img'
import Anim from '@lib/components/render/entity/anim'

export type CB_TYPE = cb_type
export type IImg = Img
export type IAnim = Anim
export interface IRender {
  canvasW: number
  canvasH: number
  preloadRes: (res: string[]) => Promise<boolean>
  clearRes: (res?: string[]) => void
  tween: ITweenFunc
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
const queue: any[] = []
const canvas = useCanvas()
const tween = new Tween()
const renderInst = {
  canvasW: 0,
  canvasH: 0,
  preloadRes: canvas.preloadRes,
  clearRes: canvas.clearRes,
  tween: tween.tween.bind(tween),
  addImg,
  addAnim
}

onMounted(async () => {
  const ret: any = await canvas.setup('anim-canvas', inst)
  renderInst.canvasW = px2rpx(ret.canvasW)
  renderInst.canvasH = px2rpx(ret.canvasH)
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
  tween.runTween()
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
