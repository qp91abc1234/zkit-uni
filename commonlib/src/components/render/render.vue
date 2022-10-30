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
import { px2rpx } from '@lib/common/utils'
import Schedule from '@lib/components/render/utils/schedule'
import Tween from '@lib/components/render/utils/tween'
import Img from '@lib/components/render/entity/img'
import Anim from '@lib/components/render/entity/anim'
import { onHide, onShow } from '@dcloudio/uni-app'
import { IRender, IEntity } from '@lib/common/types/render.d'

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
  (event: 'touchEvent', val: TouchEvent): void
}>()

const inst = getCurrentInstance()
const queue: IEntity[] = []
const canvas = useCanvas()
const schedule = new Schedule()
const tween = new Tween()
const renderInst = {
  canvasW: 0,
  canvasH: 0,
  preloadRes: canvas.preloadRes,
  clearRes: canvas.clearRes,
  schedule: schedule.add.bind(schedule),
  tween: tween.add.bind(tween),
  addImg,
  addAnim
}

onShow(() => {
  schedule.pause = false
  tween.pause = false
})

onHide(() => {
  schedule.pause = true
  tween.pause = true
})

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
  const item = new Img(canvas, src)
  queue.push(item)
  return item
}

function addAnim(src: string[]) {
  const item = new Anim(canvas, src)
  queue.push(item)
  return item
}

function render(delta: number) {
  emits('loop', renderInst)
  schedule.run(delta)
  tween.run(delta)

  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].destroy) {
      queue.splice(i, 1)
    }
  }

  queue.sort((a, b) => {
    return a.zIndex - b.zIndex
  })

  for (let i = 0; i < queue.length; i++) {
    queue[i].ready && queue[i].draw && queue[i].draw()
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
