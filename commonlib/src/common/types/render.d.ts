import {
  IScheduleFunc,
  IScheduleRet as ScheduleRet
} from '@lib/components/render/utils/schedule'
import {
  ITweenFunc,
  ITweenRet as TweenRet
} from '@lib/components/render/utils/tween'
import Entity, {
  CB_TYPE as cb_type
} from '@lib/components/render/entity/entity'
import Img from '@lib/components/render/entity/img'
import Anim from '@lib/components/render/entity/anim'

export type IEntity = Entity
export type CB_TYPE = cb_type
export type IScheduleRet = ScheduleRet
export type ITweenRet = TweenRet
export type IImg = Img
export type IAnim = Anim
export interface IRender {
  canvasW: number
  canvasH: number
  preloadRes: (res: string[]) => Promise<boolean>
  clearRes: (res?: string[]) => void
  schedule: IScheduleFunc
  tween: ITweenFunc
  addChild(val: Entity): Entity
  removeChild(val: Entity): Entity
  createImg(src: string): Img
  createAnim(src: string[]): Anim
}
