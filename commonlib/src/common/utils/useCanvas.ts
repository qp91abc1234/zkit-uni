const resObj: {
  [key: string]: { img: any; w: number; h: number; loaded: boolean }
} = {}
const animObj: { [key: string]: { cur: number; total: number } } = {}
let loopId = 0

export const useCanvas = (id = 'canvas', frameNum = 40) => {
  const screenW = uni.getSystemInfoSync().screenWidth
  const dpr = uni.getSystemInfoSync().pixelRatio
  let canvasW: number
  let canvasH: number
  let canvas: any
  let ctx: any
  let t = 0

  function rpx2px(val: number) {
    return (screenW / 750) * val
  }

  function setup() {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select(`#${id}`)
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          canvasW = res[0].width
          canvasH = res[0].height
          canvas = res[0].node
          ctx = canvas.getContext('2d')
          canvas.width = canvasW * dpr
          canvas.height = canvasH * dpr
          ctx.scale(dpr, dpr)
          resolve(null)
        })
    })
  }

  function preloadRes(res: string[]) {
    const arr: any[] = []
    for (let i = 0; i < res.length; i++) {
      arr[i] = new Promise((resolve) => {
        const src = res[i]
        if (resObj[src]) {
          resolve(resObj[src])
          return
        }
        resObj[src] = {
          img: canvas.createImage(),
          w: 0,
          h: 0,
          loaded: false
        }
        resObj[src].img.onload = () => {
          resObj[src].w = resObj[src].img.width
          resObj[src].h = resObj[src].img.height
          resObj[src].loaded = true
          resolve(resObj[src])
        }
        resObj[src].img.onerror = () => {
          resObj[src].w = -1
          resObj[src].h = -1
          resObj[src].loaded = false
          resolve(resObj[src])
        }
        resObj[src].img.src = src
      })
    }
    return Promise.all(arr)
  }

  function render(renderCore?: () => void) {
    const renderLoop = () => {
      const timestamp = new Date().getTime()
      if (timestamp - t > 1000 / frameNum) {
        t = timestamp
        ctx.clearRect(0, 0, canvasW, canvasH)
        renderCore && renderCore()
      }
      loopId = canvas.requestAnimationFrame(renderLoop)
    }
    loopId = canvas.requestAnimationFrame(renderLoop)
  }

  async function drawImg(src: string, x: number, y: number, w = 0, h = 0) {
    if (!resObj[src] || !resObj[src].loaded) {
      await preloadRes([src])
    }
    const res = resObj[src]
    w = w === 0 ? res.w : w
    h = h === 0 ? res.h : h
    ctx.drawImage(res.img, rpx2px(x), rpx2px(y), rpx2px(w), rpx2px(h))
  }

  async function drawAnim(
    key: string,
    src: string[],
    x: number,
    y: number,
    w = 0,
    h = 0,
    cb: any = undefined
  ) {
    if (!animObj[key]) {
      animObj[key] = { cur: 0, total: src.length }
    }
    drawImg(src[animObj[key].cur++], x, y, w, h)
    if (animObj[key].cur === animObj[key].total) {
      cb && cb()
      animObj[key].cur = 0
    }
  }

  function destroy() {
    if (loopId) {
      canvas.cancelAnimationFrame(loopId)
      loopId = 0
    }
  }

  return {
    rpx2px,
    setup,
    preloadRes,
    render,
    drawImg,
    drawAnim,
    destroy
  }
}
