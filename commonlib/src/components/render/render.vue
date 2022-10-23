<template>
  <canvas class="anim-canvas" id="anim-canvas" type="2d"></canvas>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { LOAD_STATUS, useCanvas } from '@lib/common/utils/useCanvas'
import {
  RENDER_TYPE,
  CB_TYPE,
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

function preloadRes(src: string[], cb: () => void) {
  Promise.resolve(canvas.preloadRes(src)).then((ret) => {
    const isSucc = ret.every((res) => {
      return res.loaded === LOAD_STATUS.SUCC
    })
    if (isSucc) {
      cb()
    } else {
      console.error('[render.vue][preloadRes] preloadRes Fail~')
    }
  })
}

function addImg(src: string) {
  const imgObj: IImgObj = {
    type: RENDER_TYPE.IMG,
    src,
    ...defaultParams
  }

  preloadRes([imgObj.src], () => {
    queue.push(imgObj)
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
    pause: false,
    cb: {},
    changeAnim: (newSrc: string[]) => {
      preloadRes(newSrc, () => {
        animObj.src = newSrc
        animObj.cur = 0
        animObj.total = newSrc.length
        animObj.count = -1
        animObj.pause = false
        animObj.cb[CB_TYPE.CHANGE_ANIM] &&
          animObj.cb[CB_TYPE.CHANGE_ANIM].forEach((cb) => {
            cb(animObj)
          })
      })
    },
    addCb: (key: CB_TYPE, val: Function) => {
      animObj.cb[key] = animObj.cb[key] || []
      animObj.cb[key].push(val)
    },
    removeCb: (key: CB_TYPE, val: Function) => {
      if (animObj.cb[key]) {
        const index = animObj.cb[key].indexOf(val)
        if (index > 0) {
          animObj.cb[key].splice(index, 1)
        }
      }
    },
    ...defaultParams
  }

  preloadRes(animObj.src, () => {
    queue.push(animObj)
  })

  return animObj
}

function drawImg(val: IObj) {
  if (val.type !== RENDER_TYPE.IMG) return
  const item = val as IImgObj
  canvas.drawImg(item.src, item.x, item.y, item.w, item.h)
}

function drawAnim(val: IObj) {
  if (val.type !== RENDER_TYPE.ANIM) return
  const item = val as IAnimObj
  const cur = item.cur
  const count = item.count

  if (item.cur === item.total) {
    item.count > 0 && item.count--
    if (item.count !== 0) {
      item.cur = 0
      canvas.drawImg(item.src[item.cur], item.x, item.y, item.w, item.h)
      item.cb[CB_TYPE.LOOP] &&
        item.cb[CB_TYPE.LOOP].forEach((cb) => {
          cb(item)
        })
    } else {
      canvas.drawImg(item.src[item.total - 1], item.x, item.y, item.w, item.h)
    }
  } else {
    canvas.drawImg(item.src[item.cur++], item.x, item.y, item.w, item.h)
  }

  if (item.pause) {
    item.cur = cur
    item.count = count
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
