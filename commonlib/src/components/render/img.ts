import Base from '@lib/components/render/base'

export default class Img extends Base {
  private src: string = ''

  constructor(canvas, queue, src: string) {
    super(canvas, queue)
    this.src = src

    Promise.resolve(this.canvas.preloadRes([src])).then((val) => {
      if (val) {
        this.queue.push(this)
      }
    })
  }

  draw() {
    const ret = super.draw()
    if (ret) return false
    this.canvas.drawImg(this.src, this.x, this.y, this.w, this.h)
    return true
  }
}
