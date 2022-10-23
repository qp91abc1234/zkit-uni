export default class Base {
  protected canvas: any
  protected queue: any[] = []
  x = 0
  y = 0
  w = 0
  h = 0
  zIndex = 0
  visible = true
  destroy = false

  constructor(canvas, queue) {
    this.canvas = canvas
    this.queue = queue
  }
}
