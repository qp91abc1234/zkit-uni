import { useLibStore } from '@lib/pinia/libStore'
import { rpx2px } from '@lib/common/utils'

enum LOAD_STATUS {
  UNLOAD,
  LOADING,
  SUCC,
  FAIL
}

interface IImgData {
  src: string
  x: number
  y: number
  w: number
  h: number
  rotate: number
  alpha: number
  anchor: { x: number; y: number }
}

export type ICanvas = ReturnType<typeof useCanvas>

const resObj: {
  [key: string]: {
    img: any
    w: number
    h: number
    loaded: LOAD_STATUS
    cb: Function[]
  }
} = {}
let loopId = 0

export const useCanvas = () => {
  const libStore = useLibStore()
  let canvasW: number
  let canvasH: number
  let canvas: any
  let ctx: any
  let t = 0

  function createImage() {
    let ret
    // #ifdef H5
    ret = new Image()
    // #endif
    // #ifdef MP-WEIXIN
    ret = canvas.createImage()
    // #endif
    return ret
  }

  function nextFrame(cb) {
    let ret
    // #ifdef H5
    ret = requestAnimationFrame(cb)
    // #endif
    // #ifdef MP-WEIXIN
    ret = canvas.requestAnimationFrame(cb)
    // #endif
    return ret
  }

  function cancelNextFrame(id) {
    // #ifdef H5
    cancelAnimationFrame(id)
    // #endif
    // #ifdef MP-WEIXIN
    canvas.cancelAnimationFrame(id)
    // #endif
  }

  function setup(id = 'canvas', inst: any = null) {
    return new Promise((resolve) => {
      // #ifdef H5
      canvas = document.getElementById(id)?.firstChild
      canvasW = canvas.clientWidth
      canvasH = canvas.clientHeight
      ctx = canvas.getContext('2d')
      canvas.width = `${canvasW * libStore.dpr}px`
      canvas.height = `${canvasH * libStore.dpr}px`
      ctx.scale(libStore.dpr, libStore.dpr)
      resolve({ canvas, ctx, canvasW, canvasH })
      // #endif
      // #ifdef MP-WEIXIN
      let query = uni.createSelectorQuery()
      if (inst) {
        query = query.in(inst)
      }
      const node = query.select(`#${id}`)
      node.fields(
        {
          size: true
        },
        () => {}
      )
      node
        .node(() => {})
        .exec((res) => {
          canvasW = res[0].width
          canvasH = res[0].height
          canvas = res[1].node
          ctx = canvas.getContext('2d')
          canvas.width = canvasW * libStore.dpr
          canvas.height = canvasH * libStore.dpr
          ctx.scale(libStore.dpr, libStore.dpr)
          resolve({ canvas, ctx, canvasW, canvasH })
        })
      // #endif
    })
  }

  function preloadRes(res: string[]) {
    const arr: any[] = []
    for (let i = 0; i < res.length; i++) {
      arr[i] = new Promise((resolve) => {
        const src = res[i]
        resObj[src] = resObj[src] || {
          img: createImage(),
          w: 0,
          h: 0,
          loaded: LOAD_STATUS.UNLOAD
        }

        if (resObj[src].loaded === LOAD_STATUS.SUCC) {
          resolve(resObj[src])
          return
        }

        if (resObj[src].loaded === LOAD_STATUS.FAIL) {
          resObj[src].img = createImage()
        }

        if (!resObj[src].cb) {
          resObj[src].cb = []
        }
        resObj[src].cb.push(resolve)
        resObj[src].img.onload = () => {
          resObj[src].w = resObj[src].img.width
          resObj[src].h = resObj[src].img.height
          resObj[src].loaded = LOAD_STATUS.SUCC
          resObj[src].cb.forEach((val) => {
            val(resObj[src])
          })
          resObj[src].cb.length = 0
        }
        resObj[src].img.onerror = () => {
          resObj[src].w = -1
          resObj[src].h = -1
          resObj[src].loaded = LOAD_STATUS.FAIL
          resObj[src].cb.forEach((val) => {
            val(resObj[src])
          })
          resObj[src].cb.length = 0
        }
        resObj[src].img.src = src
        resObj[src].loaded = LOAD_STATUS.LOADING
      })
    }

    return Promise.resolve(Promise.all(arr)).then((ret) => {
      const isSucc = ret.every((item) => {
        return item.loaded === LOAD_STATUS.SUCC
      })
      if (!isSucc) {
        console.error('[render.vue][preloadRes] preloadRes Fail~')
      }
      return isSucc
    })
  }

  function clearRes(res: string[] = []) {
    const arr = res.length === 0 ? Object.keys(resObj) : res
    for (let i = 0; i < arr.length; i++) {
      const key = arr[i]
      if (resObj[key]) {
        delete resObj[key]
      }
    }
  }

  function render(renderCore?: () => void, frameNum = 40) {
    const renderLoop = () => {
      const timestamp = new Date().getTime()
      if (timestamp - t > 1000 / frameNum) {
        t = timestamp
        ctx.clearRect(0, 0, canvasW, canvasH)
        renderCore && renderCore()
      }
      loopId = nextFrame(renderLoop)
    }
    loopId = nextFrame(renderLoop)
  }

  function drawImg(data: IImgData) {
    ctx.save()
    ctx.translate(rpx2px(data.x), rpx2px(data.y))
    ctx.rotate((data.rotate * Math.PI) / 180)
    ctx.globalAlpha = data.alpha

    const res = resObj[data.src]
    data.w = data.w === 0 ? res.w : data.w
    data.h = data.h === 0 ? res.h : data.h
    ctx.drawImage(
      res.img,
      -rpx2px(data.w * data.anchor.x),
      -rpx2px(data.h * data.anchor.y),
      rpx2px(data.w),
      rpx2px(data.h)
    )
    ctx.restore()
  }

  function destroy() {
    if (loopId) {
      cancelNextFrame(loopId)
      loopId = 0
    }
  }

  return {
    rpx2px,
    setup,
    preloadRes,
    clearRes,
    render,
    drawImg,
    destroy
  }
}
