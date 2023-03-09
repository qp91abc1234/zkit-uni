<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/use-canvas'
import { useLibStore } from '@lib/pinia/libStore'
import Schedule from '@lib/components/render/utils/schedule'
import Tween from '@lib/components/render/utils/tween'
import Entity from '@lib/components/render/entity/entity'
import Text from '@lib/components/render/entity/text'
import Img from '@lib/components/render/entity/img'
import Anim from '@lib/components/render/entity/anim'
import Spine from '@lib/components/render/entity/spine'

const props = withDefaults(
  defineProps<{
    mode?: 'normal' | 'poster'
    frameNum?: number
  }>(),
  {
    mode: 'normal',
    frameNum: 20
  }
)

const emits = defineEmits<{
  (event: 'init', val: ZKit.Render): void
  (event: 'loop', delta: number): void
  (event: 'afterLoop', delta: number): void
  (event: 'touchEvent', val: TouchEvent): void
}>()

const libStore = useLibStore()
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
  drawPoster,
  addChild,
  removeChild,
  createText,
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
  if (props.mode === 'normal') {
    cvs.render(render, pause, props.frameNum)
  }
})

onBeforeUnmount(() => {
  cvs.destroy()
})

function drawPoster(cb: () => void): Promise<any> {
  cvs.clearScreen()
  cb()
  root.draw(0.016)
  return zkit.utils.toPromiseStyle(wx.canvasToTempFilePath, {
    x: 0,
    y: 0,
    width: cvs.canvasW.value,
    height: cvs.canvasH.value,
    destWidth: cvs.canvasW.value * (libStore.dpr || 1),
    destHeight: cvs.canvasH.value * (libStore.dpr || 1),
    canvas: cvs.canvas.value
  })
}

function addChild(child: Entity) {
  return root.addChild(child)
}

function removeChild(child: Entity) {
  return root.removeChild(child)
}

function createText(val: string) {
  return new Text(cvs, val)
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

<template>
  <canvas
    id="anim-canvas"
    class="anim-canvas"
    type="2d"
    @touchstart="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchmove="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchend="(payload: TouchEvent) => emits('touchEvent', payload)"
    @touchcancel="(payload: TouchEvent) => emits('touchEvent', payload)"
  ></canvas>
</template>

<style lang="scss" scoped>
.anim-canvas {
  width: 100%;
  height: 100%;
}
</style>
