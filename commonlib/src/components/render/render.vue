<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useCanvas } from '@lib/common/utils/useCanvas'
import { RENDER_TYPE, IImgObj, IAnimObj } from '@lib/common/types/render.d'

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
const defaultParams = { x: 0, y: 0, w: 0, h: 0, zIndex: 0 }

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
  const imgObj: IImgObj = {
    type: RENDER_TYPE.IMG,
    src,
    ...defaultParams
  }

  queue.push(imgObj)
  return imgObj
}

function addAnim(key: string, src: string[]) {
  const animObj: IAnimObj = {
    type: RENDER_TYPE.ANIM,
    key,
    src,
    ...defaultParams
  }

  queue.push(animObj)
  return animObj
}

function render() {
  queue.sort((a, b) => {
    return a.zIndex - b.zIndex
  })

  for (let i = 0; i < queue.length; i++) {
    if (queue[i].type === RENDER_TYPE.IMG) {
      const item = queue[i] as IImgObj
      canvas.drawImg(item.src, item.x, item.y, item.w, item.h)
    }
    if (queue[i].type === RENDER_TYPE.ANIM) {
      const item = queue[i] as IAnimObj
      canvas.drawAnim(
        item.key,
        item.src,
        item.x,
        item.y,
        item.w,
        item.h,
        () => {}
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.anim-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
