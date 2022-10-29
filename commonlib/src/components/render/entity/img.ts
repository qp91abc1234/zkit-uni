import Entity from '@lib/components/render/entity/entity'

export default class Img extends Entity {
  private src: string = ''

  constructor(canvas, src: string) {
    super(canvas)
    this.src = src

    Promise.resolve(this.canvas.preloadRes([src])).then((val) => {
      this.readyFlag = val
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
