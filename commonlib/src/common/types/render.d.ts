export enum RENDER_TYPE {
  IMG,
  ANIM
}

export interface IObj {
  type: RENDER_TYPE
  x: number
  y: number
  w: number
  h: number
  zIndex: number
  visible: boolean
  destroy: boolean
}

export interface IImgObj extends IObj {
  src: string
}

export interface IAnimObj extends IObj {
  src: string[]
  cur: number
  total: number
  count: number
  loopCb: () => void
}
