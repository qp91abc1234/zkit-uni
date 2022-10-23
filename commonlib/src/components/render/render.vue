<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { LOAD_STATUS, useCanvas } from '@lib/common/utils/useCanvas'
import {
  RENDER_TYPE,
  IObj,
  IImgObj,
  IAnimObj
} from '@lib/common/types/render.d'

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
const defaultParams = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  zIndex: 0,
  visible: true,
  destroy: false
}

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

  Promise.resolve(canvas.preloadRes([imgObj.src])).then((ret) => {
    if (ret[0].loaded === LOAD_STATUS.SUCC) {
      queue.push(imgObj)
    } else {
      console.error('[render.vue][addImg] preloadRes Fail~')
    }
  })

  return imgObj
}

function addAnim(src: string[]) {
  const animObj: IAnimObj = {
    type: RENDER_TYPE.ANIM,
    src,
    cur: 0,
    total: src.length,
    count: -1,
    loopCb: () => {},
    ...defaultParams
  }

  Promise.resolve(canvas.preloadRes(animObj.src)).then((ret) => {
    const isSucc = ret.every((res) => {
      return res.loaded === LOAD_STATUS.SUCC
    })
    if (isSucc) {
      queue.push(animObj)
    } else {
      console.error('[render.vue][addAnim] preloadRes Fail~')
    }
  })

  return animObj
}

async function drawImg(val: IObj) {
  if (val.type !== RENDER_TYPE.IMG) return
  const item = val as IImgObj
  canvas.drawImg(item.src, item.x, item.y, item.w, item.h)
}

async function drawAnim(val: IObj) {
  if (val.type !== RENDER_TYPE.ANIM) return
  const item = val as IAnimObj
  if (item.cur === item.total) {
    item.count > 0 && item.count--
    if (item.count !== 0) {
      item.cur = 0
      canvas.drawImg(item.src[item.cur], item.x, item.y, item.w, item.h)
      typeof item.loopCb === 'function' && item.loopCb()
    } else {
      canvas.drawImg(item.src[item.total - 1], item.x, item.y, item.w, item.h)
    }
  } else {
    canvas.drawImg(item.src[item.cur++], item.x, item.y, item.w, item.h)
  }
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
    drawImg(queue[i])
    drawAnim(queue[i])
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
