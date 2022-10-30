import { ICanvas } from '@lib/common/utils/useCanvas'

export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
}

export default class Entity {
  protected canvas: ICanvas
  protected cb = {}
  ready = false
  x = 0
  y = 0
  w = 0
  h = 0
  rotate = 0
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
    if (this.children) {
      const keys = Object.keys(this.children)
      for (let i = 0; i < keys.length; i++) {
        this.children[keys[i]].forEach((ele: Entity) => {
          ele.draw()
        })
      }
    }
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
    return child
  }

  removeChild(child: Entity) {
    child.parent = undefined
    this.children[child.zIndexVal] = this.children[child.zIndexVal] || []
    const index = this.children[child.zIndexVal].indexOf(child)
    if (index > 0) {
      this.children[child.zIndexVal].splice(index, 1)
    }
    return child
  }

  removeFromParent() {
    this.parent && this.parent.removeChild(this)
    return this
  }
}
