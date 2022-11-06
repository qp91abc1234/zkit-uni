import { useLibStore } from '@lib/pinia/libStore'

export enum CANVAS_LOAD_STATUS {
  UNLOAD,
  LOADING,
  SUCC,
  FAIL
}

let loopId = 0
const resObj: ZKit.CanvasCacheData = {}

export const useCanvas = () => {
  const libStore = useLibStore()
  const canvasW: { value: number } = { value: 0 }
  const canvasH: { value: number } = { value: 0 }
  const canvas: { value: any } = { value: undefined }
  const context: { value: any } = { value: undefined }
  let t = 0

  function createImage() {
    let ret
    // #ifdef H5
    ret = new Image()
    // #endif
    // #ifdef MP-WEIXIN
    ret = canvas.value.createImage()
    // #endif
    return ret
  }

  function nextFrame(cb) {
    let ret
    // #ifdef H5
    ret = requestAnimationFrame(cb)
    // #endif
    // #ifdef MP-WEIXIN
    ret = canvas.value.requestAnimationFrame(cb)
    // #endif
    return ret
  }

  function cancelNextFrame(id) {
    // #ifdef H5
    cancelAnimationFrame(id)
    // #endif
    // #ifdef MP-WEIXIN
    canvas.value.cancelAnimationFrame(id)
    // #endif
  }

  function setup(id = 'canvas', inst: any = null) {
    return new Promise((resolve) => {
      // #ifdef H5
      canvas.value = document.getElementById(id)?.firstChild
      canvasW.value = canvas.value.clientWidth
      canvasH.value = canvas.value.clientHeight
      context.value = canvas.value.getContext('2d')
      canvas.value.width = `${canvasW.value * libStore.dpr}px`
      canvas.value.height = `${canvasH.value * libStore.dpr}px`
      context.value.scale(libStore.dpr, libStore.dpr)
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
          canvasW.value = res[0].width
          canvasH.value = res[0].height
          canvas.value = res[1].node
          context.value = canvas.value.getContext('2d')
          canvas.value.width = canvasW.value * libStore.dpr
          canvas.value.height = canvasH.value * libStore.dpr
          context.value.scale(libStore.dpr, libStore.dpr)
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
        resObj[src] = resObj[src] || {
          img: createImage(),
          w: 0,
          h: 0,
          loaded: CANVAS_LOAD_STATUS.UNLOAD
        }

        if (resObj[src].loaded === CANVAS_LOAD_STATUS.SUCC) {
          resolve(resObj[src])
          return
        }

        if (resObj[src].loaded === CANVAS_LOAD_STATUS.FAIL) {
          resObj[src].img = createImage()
        }

        if (!resObj[src].cb) {
          resObj[src].cb = []
        }
        resObj[src].cb.push(resolve)
        resObj[src].img.onload = () => {
          resObj[src].w = resObj[src].img.width
          resObj[src].h = resObj[src].img.height
          resObj[src].loaded = CANVAS_LOAD_STATUS.SUCC
          resObj[src].cb.forEach((val) => {
            val(resObj[src])
          })
          resObj[src].cb.length = 0
        }
        resObj[src].img.onerror = () => {
          resObj[src].w = -1
          resObj[src].h = -1
          resObj[src].loaded = CANVAS_LOAD_STATUS.FAIL
          resObj[src].cb.forEach((val) => {
            val(resObj[src])
          })
          resObj[src].cb.length = 0
        }
        resObj[src].img.src = src
        resObj[src].loaded = CANVAS_LOAD_STATUS.LOADING
      })
    }

    return Promise.resolve(Promise.all(arr)).then((ret) => {
      const isSucc = ret.every((item) => {
        return item.loaded === CANVAS_LOAD_STATUS.SUCC
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

  function render(
    renderCore?: (delta: number) => void,
    pause = { value: false },
    frameNum = 40
  ) {
    const renderLoop = () => {
      const timestamp = new Date().getTime()
      if (timestamp - t > 1000 / frameNum) {
        if (!pause.value) {
          context.value.clearRect(0, 0, canvasW.value, canvasH.value)
          renderCore && renderCore(timestamp - t)
        }
        t = timestamp
      }
      loopId = nextFrame(renderLoop)
    }
    loopId = nextFrame(renderLoop)
  }

  function drawImg(data: ZKit.ImgData) {
    context.value.translate(
      zkit.utils.rpx2px(data.x),
      zkit.utils.rpx2px(data.y)
    )
    context.value.rotate((data.rotate * Math.PI) / 180)
    context.value.scale(data.scale, data.scale)
    context.value.globalAlpha = data.alpha

    const res = resObj[data.src]
    data.w = data.w === 0 ? res.w : data.w
    data.h = data.h === 0 ? res.h : data.h
    context.value.drawImage(
      res.img,
      -zkit.utils.rpx2px(data.w * data.anchor.x),
      -zkit.utils.rpx2px(data.h * data.anchor.y),
      zkit.utils.rpx2px(data.w),
      zkit.utils.rpx2px(data.h)
    )
  }

  function destroy() {
    if (loopId) {
      cancelNextFrame(loopId)
      loopId = 0
    }
  }

  return {
    canvasW,
    canvasH,
    canvas,
    context,
    setup,
    preloadRes,
    clearRes,
    render,
    drawImg,
    destroy
  }
}
