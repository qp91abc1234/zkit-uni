import {
  IScheduleFunc,
  IScheduleRet as ScheduleRet
} from '@lib/components/render/utils/schedule'
import {
  ITweenFunc,
  ITweenRet as TweenRet
} from '@lib/components/render/utils/tween'
import IEntity, {
  CB_TYPE as cb_type
} from '@lib/components/render/entity/entity'
import IImg from '@lib/components/render/entity/img'
import IAnim from '@lib/components/render/entity/anim'

declare global {
  type Entity = IEntity
  type CB_TYPE = cb_type
  type IScheduleRet = ScheduleRet
  type ITweenRet = TweenRet
  type Img = IImg
  type Anim = IAnim
  interface IRender {
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
}
