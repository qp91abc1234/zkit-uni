export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
}

interface ITWEEN {
  duration: number
  propName: string
  from: number
  to: number
  start: number
  step: number
  cb: () => void
}

export default class Base {
  protected canvas: any
  protected queue: any[] = []
  protected cb = {}
  private tweenArr: ITWEEN[][] = []
  x = 0
  y = 0
  w = 0
  h = 0
  zIndex = 0
  visible = true

  constructor(canvas, queue) {
    this.canvas = canvas
    this.queue = queue
  }

  draw() {
    this.runTween()
    let ret = true
    if (!this.visible) {
      ret = false
    }

    return ret
  }

  destroy() {
    const index = this.queue.indexOf(this)
    this.queue.splice(index, 1)
  }

  addCb(key: CB_TYPE, val: Function) {
    this.cb[key] = this.cb[key] || []
    this.cb[key].push(val)
  }

  removeCb(key: CB_TYPE, val: Function) {
    if (this.cb[key]) {
      const index = this.cb[key].indexOf(val)
      if (index > 0) {
        this.cb[key].splice(index, 1)
      }
    }
  }

  tween(
    duration,
    propName: 'x' | 'y' | 'w' | 'h',
    from,
    to,
    addWay: 'seq' | 'parallel' = 'seq',
    cb: () => void = () => {}
  ) {
    const step = (to - from) / duration
    const obj = {
      duration,
      propName,
      from,
      to,
      start: -1,
      step,
      cb
    }
    if (addWay === 'seq') {
      this.tweenArr.push([obj])
    } else if (this.tweenArr.length === 0) {
      this.tweenArr.push([obj])
    } else {
      this.tweenArr[this.tweenArr.length - 1].push(obj)
    }

    return this
  }

  private runTween() {
    if (this.tweenArr.length <= 0) return
    const arr = this.tweenArr[0]
    const delIndex: number[] = []
    arr.forEach((val: ITWEEN, index) => {
      const cur = new Date().getTime()
      val.start = val.start < 0 ? cur : val.start
      const t = cur - val.start
      const s = t * val.step
      if (
        (s > 0 && this[val.propName] + s >= val.to) ||
        (s < 0 && this[val.propName] + s <= val.to)
      ) {
        this[val.propName] = val.to
        delIndex.push(index)
        val.cb()
      } else {
        this[val.propName] += s
        val.start = cur
      }
    })
    delIndex.forEach((val) => {
      arr.splice(val, 1)
      if (arr.length === 0) {
        this.tweenArr.shift()
      }
    })
    delIndex.length = 0
  }
}
