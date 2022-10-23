export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
}

export default class Base {
  protected canvas: any
  protected queue: any[] = []
  protected cb = {}
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

  draw() {
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
}
