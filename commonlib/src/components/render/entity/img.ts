import Entity from '@lib/components/render/entity/entity'

export default class Img extends Entity {
  private src: string = ''

  constructor(canvas, src: string) {
    super(canvas)
    this.src = src

    Promise.resolve(this.canvas.preloadRes([src])).then((val) => {
      this.ready = val
    })
  }

  draw() {
    if (!this.ready || !this.visible) return
    this.canvas.save()
    this.canvas.drawImg({
      ...this.renderProps,
      src: this.src
    })
    super.draw()
    this.canvas.restore()
  }
}
