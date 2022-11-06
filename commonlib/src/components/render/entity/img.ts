import Entity from '@lib/components/render/entity/entity'

export default class Img extends Entity {
  private src: string = ''

  constructor(cvs, src: string) {
    super(cvs)
    this.src = src

    Promise.resolve(this.cvs.preloadRes([src])).then((val) => {
      this.ready = val
    })
  }

  draw(delta: number) {
    if (!this.ready || !this.visible) return
    this.context.save()
    this.cvs.drawImg({
      ...this.renderProps,
      src: this.src
    })
    super.draw(delta)
    this.context.restore()
  }
}
