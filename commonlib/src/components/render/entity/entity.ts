export enum RENDER_CB_TYPE {
  CHANGE_ANIM,
  ANIM_END
}

export default class Entity {
  protected cvs: ZKit.Canvas
  protected canvas: any
  protected context: any
  protected cb = {}
  ready = false
  x = 0
  y = 0
  rotate = 0
  scale = 1
  w = 0
  h = 0
  private alphaVal = 1
  anchor = { x: 0.5, y: 0.5 }
  private zIndexVal = 0
  visible = true
  parent: Entity | undefined
  children: Entity[][] = []
  extraData: any

  constructor(cvs) {
    this.cvs = cvs
    this.canvas = this.cvs.canvas.value
    this.context = this.cvs.context.value
  }

  protected get renderProps() {
    return {
      x: this.x,
      y: this.y,
      rotate: this.rotate,
      scale: this.scale,
      w: this.w,
      h: this.h,
      alpha: this.alpha,
      anchor: this.anchor
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

  draw(delta: number) {
    if (this.children) {
      const keys = Object.keys(this.children)
      for (let i = 0; i < keys.length; i++) {
        this.children[keys[i]].forEach((ele: Entity) => {
          ele.draw(delta)
        })
      }
    }
  }

  addCb(key: RENDER_CB_TYPE, val: Function) {
    this.cb[key] = this.cb[key] || []
    this.cb[key].push(val)
  }

  removeCb(key: RENDER_CB_TYPE, val: Function) {
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
    if (index >= 0) {
      this.children[child.zIndexVal].splice(index, 1)
    }
    return child
  }

  removeFromParent() {
    this.parent && this.parent.removeChild(this)
    return this
  }
}
