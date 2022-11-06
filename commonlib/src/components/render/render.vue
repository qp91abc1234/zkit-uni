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
import Spine from '@lib/components/render/entity/spine'
import { onHide, onShow } from '@dcloudio/uni-app'

const props = withDefaults(
  defineProps<{
    frameNum?: number
  }>(),
  {
    frameNum: 30
  }
)

const emits = defineEmits<{
  (event: 'init', val: ZKit.Render): void
  (event: 'loop', delta: number): void
  (event: 'afterLoop', delta: number): void
  (event: 'touchEvent', val: TouchEvent): void
}>()

const pause = { value: false }
const inst = getCurrentInstance()
const cvs = useCanvas()
const root = new Entity(cvs)
const schedule = new Schedule()
const tween = new Tween()
const renderInst = {
  canvasW: 0,
  canvasH: 0,
  preloadRes: cvs.preloadRes,
  clearRes: cvs.clearRes,
  schedule: schedule.add.bind(schedule),
  tween: tween.add.bind(tween),
  addChild,
  removeChild,
  createImg,
  createAnim,
  createSpine
}

onShow(() => {
  pause.value = false
})

onHide(() => {
  pause.value = true
})

onMounted(async () => {
  await cvs.setup('anim-canvas', inst)
  renderInst.canvasW = zkit.utils.px2rpx(cvs.canvasW.value)
  renderInst.canvasH = zkit.utils.px2rpx(cvs.canvasH.value)
  emits('init', renderInst)
  cvs.render(render, pause, props.frameNum)
})

onBeforeUnmount(() => {
  cvs.destroy()
})

function addChild(child: Entity) {
  return root.addChild(child)
}

function removeChild(child: Entity) {
  return root.removeChild(child)
}

function createImg(src: string) {
  return new Img(cvs, src)
}

function createAnim(src: string[]) {
  return new Anim(cvs, src)
}

function createSpine(src: string) {
  return new Spine(cvs, src)
}

function render(delta: number) {
  emits('loop', delta)
  schedule.run(delta)
  tween.run(delta)
  root.draw(delta)
  emits('afterLoop', delta)
}
</script>

<style lang="scss" scoped>
.anim-canvas {
  width: 100%;
  height: 100%;
}
</style>
