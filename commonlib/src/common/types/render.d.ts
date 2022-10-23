export enum RENDER_TYPE {
  IMG,
  ANIM
}

export enum CB_TYPE {
  CHANGE_ANIM,
  LOOP
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
  pause: boolean
  cb: { [key: string]: Function[] }
  changeAnim: (newSrc: string[]) => void
  addCb: (key: CB_TYPE, val: Function) => void
  removeCb: (key: CB_TYPE, val: Function) => void
}
