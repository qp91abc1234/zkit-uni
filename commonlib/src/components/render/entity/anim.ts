import Entity, { RENDER_CB_TYPE } from '@lib/components/render/entity/entity'

export default class Anim extends Entity {
  private src: string[] = []
  cur = 0
  total = 0
  count = -1
  pause = false

  constructor(canvas, src: string[]) {
    super(canvas)
    this.src = src
    this.total = src.length

    Promise.resolve(this.cvs.preloadRes(src)).then((val) => {
      this.ready = val
    })
  }

  private resetAnim(src: string[] = []) {
    this.src = src.length > 0 ? src : this.src
    this.cur = 0
    this.total = this.src.length
    this.count = -1
    this.pause = false
  }

  private drawAnim() {
    const cur = this.cur
    const count = this.count

    if (this.cur === this.total) {
      if (this.count > 0 || this.count === -1) {
        this.count > 0 && this.count--
        this.triggerCb(RENDER_CB_TYPE.ANIM_END)
      }
      if (this.count !== 0) {
        this.cur = 0
        this.cvs.drawImg({
          ...this.renderProps,
          src: this.src[this.cur]
        })
      } else {
        this.cvs.drawImg({
          ...this.renderProps,
          src: this.src[this.total - 1]
        })
      }
    } else {
      this.cvs.drawImg({
        ...this.renderProps,
        src: this.src[this.cur++]
      })
    }

    if (this.pause) {
      this.cur = cur
      this.count = count
    }
  }

  changeAnim(newSrc: string[]) {
    Promise.resolve(this.cvs.preloadRes(newSrc)).then(() => {
      this.resetAnim(newSrc)
      this.triggerCb(RENDER_CB_TYPE.CHANGE_ANIM)
    })
  }

  draw(delta: number) {
    if (!this.ready || !this.visible) return
    this.context.save()
    this.drawAnim()
    super.draw(delta)
    this.context.restore()
  }
}
