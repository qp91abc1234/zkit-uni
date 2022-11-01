<template>
  <canvas
    class="anim-canvas"
    id="anim-canvas"
    type="2d"
    @touchstart="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchmove="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchend="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchcancel="(payload: TouchEvent) => emits('touchEvent', payload)"
  ></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { useCanvas } from '@lib/common/utils/useCanvas'
import Schedule from '@lib/components/render/utils/schedule'
import Tween from '@lib/components/render/utils/tween'
import Entity from '@lib/components/render/entity/entity'
import Img from '@lib/components/render/entity/img'
import Anim from '@lib/components/render/entity/anim'
import { onHide, onShow } from '@dcloudio/uni-app'
import { IRender } from '@lib/common/types/render.d'

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
  (event: 'loop', delta: number): void
  (event: 'afterLoop', delta: number): void
  (event: 'touchEvent', val: TouchEvent): void
}>()

let pause = false
const inst = getCurrentInstance()
const canvas = useCanvas()
const root = new Entity(canvas)
const schedule = new Schedule()
const tween = new Tween()
const renderInst = {
  canvasW: 0,
  canvasH: 0,
  preloadRes: canvas.preloadRes,
  clearRes: canvas.clearRes,
  schedule: schedule.add.bind(schedule),
  tween: tween.add.bind(tween),
  addChild,
  removeChild,
  createImg,
  createAnim
}

onShow(() => {
  pause = false
})

onHide(() => {
  pause = true
})

onMounted(async () => {
  const ret: any = await canvas.setup('anim-canvas', inst)
  renderInst.canvasW = zkit.utils.px2rpx(ret.canvasW)
  renderInst.canvasH = zkit.utils.px2rpx(ret.canvasH)
  emits('init', renderInst)
  canvas.render(render, props.frameNum)
})

onBeforeUnmount(() => {
  canvas.destroy()
})

function addChild(child: Entity) {
  return root.addChild(child)
}

function removeChild(child: Entity) {
  return root.removeChild(child)
}

function createImg(src: string) {
  return new Img(canvas, src)
}

function createAnim(src: string[]) {
  return new Anim(canvas, src)
}

function render(delta: number) {
  if (pause) return
  emits('loop', delta)
  schedule.run(delta)
  tween.run(delta)
  root.draw()
  emits('afterLoop', delta)
}
</script>

<style lang="scss" scoped>
.anim-canvas {
  width: 100%;
  height: 100%;
}
</style>
