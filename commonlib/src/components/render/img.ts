import Base from './base'

export default class Img extends Base {
  private src: string = ''

  constructor(src: string, canvas, queue) {
    super(canvas, queue)
    this.src = src

    Promise.resolve(this.canvas.preloadRes([src])).then((val) => {
      if (val) {
        this.queue.push(this)
      }
    })
  }

  draw() {
    this.canvas.drawImg(this.src, this.x, this.y, this.w, this.h)
  }
}
