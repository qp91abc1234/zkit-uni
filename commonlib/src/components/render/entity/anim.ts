import Entity, { CB_TYPE } from '@lib/components/render/entity/entity'

export default class Anim extends Entity {
  private src: string[] = []
  cur = 0
  total = 0
  count = -1
  pause = false

  constructor(canvas, queue, src: string[]) {
    super(canvas, queue)
    this.src = src
    this.total = src.length

    Promise.resolve(this.canvas.preloadRes(src)).then((val) => {
      if (val) {
        this.queue.push(this)
      }
    })
  }

  private resetAnim(src: string[] = []) {
    this.src = src.length > 0 ? src : this.src
    this.cur = 0
    this.total = this.src.length
    this.count = -1
    this.pause = false
  }

  changeAnim(newSrc: string[]) {
    Promise.resolve(this.canvas.preloadRes(newSrc)).then((val) => {
      this.resetAnim(newSrc)
      this.cb[CB_TYPE.CHANGE_ANIM] &&
        this.cb[CB_TYPE.CHANGE_ANIM].forEach((cb) => {
          cb(this)
        })
    })
  }

  draw() {
    const ret = super.draw()
    if (!ret) return false
    const cur = this.cur
    const count = this.count

    if (this.cur === this.total) {
      this.count > 0 && this.count--
      if (this.count !== 0) {
        this.cur = 0
        this.canvas.drawImg({
          ...this.baseProps,
          src: this.src[this.cur]
        })
        this.cb[CB_TYPE.LOOP] &&
          this.cb[CB_TYPE.LOOP].forEach((cb) => {
            cb(this)
          })
      } else {
        this.canvas.drawImg({
          ...this.baseProps,
          src: this.src[this.total - 1]
        })
      }
    } else {
      this.canvas.drawImg({
        ...this.baseProps,
        src: this.src[this.cur++]
      })
    }

    if (this.pause) {
      this.cur = cur
      this.count = count
    }

    return true
  }
}
