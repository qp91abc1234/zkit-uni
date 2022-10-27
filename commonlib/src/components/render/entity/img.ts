import Entity from '@lib/components/render/entity/entity'

export default class Img extends Entity {
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
    if (!ret) return false
    this.canvas.drawImg({
      ...this.baseProps,
      src: this.src
    })
    return true
  }
}
