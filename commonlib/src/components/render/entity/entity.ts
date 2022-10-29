import { ICanvas } from '@lib/common/utils/useCanvas'

export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
}

export default class Entity {
  protected canvas: ICanvas
  protected cb = {}
  readyFlag = false
  destroyFlag = false
  x = 0
  y = 0
  w = 0
  h = 0
  rotate = 0
  alpha = 1
  anchor = { x: 0.5, y: 0.5 }
  zIndex = 0
  visible = true

  constructor(canvas) {
    this.canvas = canvas
  }

  protected get baseProps() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      rotate: this.rotate,
      alpha: this.alpha,
      anchor: this.anchor,
      zIndex: this.zIndex,
      visible: this.visible
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
    this.destroyFlag = true
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
}
