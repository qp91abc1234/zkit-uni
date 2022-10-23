export enum RENDER_TYPE {
  IMG,
  ANIM
}

interface IObj {
  type: RENDER_TYPE
  x: number
  y: number
  w: number
  h: number
  zIndex: number
}

export interface IImgObj extends IObj {
  src: string
}

export interface IAnimObj extends IObj {
  key: string
  src: string[]
}
