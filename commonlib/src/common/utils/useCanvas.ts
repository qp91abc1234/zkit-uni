import { useLibStore } from '@lib/pinia/libStore'

export enum LOAD_STATUS {
  UNLOAD,
  LOADING,
  SUCC,
  FAIL
}

const resObj: {
  [key: string]: { img: any; w: number; h: number; loaded: LOAD_STATUS }
} = {}
let loopId = 0

export const useCanvas = () => {
  const libStore = useLibStore()
  let canvasW: number
  let canvasH: number
  let canvas: any
  let ctx: any
  let t = 0

  function rpx2px(val: number) {
    return (libStore.screenW / 750) * val
  }

  function setup(id = 'canvas', inst: any = null) {
    return new Promise((resolve) => {
      // #ifdef H5
      ctx = uni.createCanvasContext(id, inst)
      resolve(null)
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
          resolve(null)
        })
      // #endif
    })
  }

  function preloadRes(res: string[]) {
    const arr: any[] = []
    for (let i = 0; i < res.length; i++) {
      arr[i] = new Promise((resolve) => {
        const src = res[i]
        // #ifdef H5
        resObj[src] = resObj[src] || {
          img: new Image(),
          w: 0,
          h: 0,
          loaded: LOAD_STATUS.UNLOAD
        }
        // #endif
        // #ifdef MP-WEIXIN
        resObj[src] = resObj[src] || {
          img: canvas.createImage(),
          w: 0,
          h: 0,
          loaded: LOAD_STATUS.UNLOAD
        }
        // #endif

        if (
          resObj[src].loaded === LOAD_STATUS.LOADING ||
          resObj[src].loaded === LOAD_STATUS.SUCC
        ) {
          resolve(resObj[src])
          return
        }

        if (resObj[src].loaded === LOAD_STATUS.FAIL) {
          // #ifdef H5
          resObj[src].img = new Image()
          // #endif
          // #ifdef MP-WEIXIN
          resObj[src].img = canvas.createImage()
          // #endif
        }

        resObj[src].img.onload = () => {
          resObj[src].w = resObj[src].img.width
          resObj[src].h = resObj[src].img.height
          resObj[src].loaded = LOAD_STATUS.SUCC
          resolve(resObj[src])
        }
        resObj[src].img.onerror = () => {
          resObj[src].w = -1
          resObj[src].h = -1
          resObj[src].loaded = LOAD_STATUS.FAIL
          resolve(resObj[src])
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
      // #ifdef H5
      loopId = requestAnimationFrame(renderLoop)
      // #endif
      // #ifdef MP-WEIXIN
      loopId = canvas.requestAnimationFrame(renderLoop)
      // #endif
    }
    // #ifdef H5
    loopId = requestAnimationFrame(renderLoop)
    // #endif
    // #ifdef MP-WEIXIN
    loopId = canvas.requestAnimationFrame(renderLoop)
    // #endif
  }

  function drawImg(src: string, x: number, y: number, w = 0, h = 0) {
    const res = resObj[src]
    w = w === 0 ? res.w : w
    h = h === 0 ? res.h : h
    // #ifdef H5
    ctx.drawImage(src, rpx2px(x), rpx2px(y), rpx2px(w), rpx2px(h))
    // #endif
    // #ifdef MP-WEIXIN
    ctx.drawImage(res.img, rpx2px(x), rpx2px(y), rpx2px(w), rpx2px(h))
    // #endif
  }

  function destroy() {
    if (loopId) {
      // #ifdef H5
      cancelAnimationFrame(loopId)
      // #endif
      // #ifdef MP-WEIXIN
      canvas.cancelAnimationFrame(loopId)
      // #endif
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
