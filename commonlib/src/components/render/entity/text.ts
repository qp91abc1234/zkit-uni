import Entity from '@lib/components/render/entity/entity'

export default class Text extends Entity {
  content = ''
  size = 20
  color = 'white'
  font = 'serif'
  constructor(canvas, val: string) {
    super(canvas)
    this.content = val
  }

  draw(delta: number) {
    if (!this.visible) return
    this.context.save()
    this.cvs.drawText({
      ...this.renderProps,
      content: this.content,
      color: this.color,
      font: this.font,
      size: this.size
    })
    super.draw(delta)
    this.context.restore()
  }
}
