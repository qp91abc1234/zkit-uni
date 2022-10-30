import { ICanvas } from '@lib/common/utils/useCanvas'

export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
}

export default class Entity {
  protected canvas: ICanvas
  protected cb = {}
  ready = false
  destroy = false
  private xVal = 0
  private yVal = 0
  w = 0
  h = 0
  private rotateVal = 0
  private alphaVal = 1
  anchor = { x: 0.5, y: 0.5 }
  private zIndexVal = 0
  visible = true
  parent: Entity | undefined
  children: Entity[][] = []

  constructor(canvas) {
    this.canvas = canvas
  }

  protected get renderProps() {
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

  get x() {
    let ret = this.xVal
    if (this.parent) {
      ret = this.parent.x + ret
    }
    return ret
  }

  set x(val: number) {
    this.xVal = val
  }

  get rotate() {
    let ret = this.rotateVal
    if (this.parent) {
      ret = this.parent.rotate + ret
    }
    return ret
  }

  set rotate(val: number) {
    this.rotateVal = val
  }

  get alpha() {
    let ret = this.alphaVal
    if (this.parent) {
      ret *= this.parent.alpha
    }
    return ret
  }

  set alpha(val: number) {
    this.alphaVal = val
  }

  get y() {
    let ret = this.yVal
    if (this.parent) {
      ret = this.parent.y + ret
    }
    return ret
  }

  set y(val: number) {
    this.yVal = val
  }

  get zIndex() {
    return this.zIndexVal
  }

  set zIndex(val) {
    const parent = this.parent
    parent && parent.removeChild(this)
    this.zIndexVal = val
    parent && parent.addChild(this)
  }

  draw() {
    let ret = true
    if (!this.visible) {
      ret = false
    }

    return ret
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

  addChild(child: Entity) {
    child.parent = this
    this.children[child.zIndexVal] = this.children[child.zIndexVal] || []
    this.children[child.zIndexVal].push(child)
  }

  removeChild(child: Entity) {
    child.parent = undefined
    this.children[child.zIndexVal] = this.children[child.zIndexVal] || []
    const index = this.children[child.zIndexVal].indexOf(child)
    this.children[child.zIndexVal].splice(index, 1)
  }
}
