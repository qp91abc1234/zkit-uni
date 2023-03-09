import IEntity from '@lib/components/render/entity/entity'
import IText from '@lib/components/render/entity/text'
import IImg from '@lib/components/render/entity/img'
import IAnim from '@lib/components/render/entity/anim'
import ISpine from '@lib/components/render/entity/spine'

declare global {
  namespace ZKit {
    type Entity = IEntity
    type Text = IText
    type Img = IImg
    type Anim = IAnim
    type Spine = ISpine
  }
}

declare global {
  namespace ZKit {
    type ScheduleObj = {
      cb: (val: number) => void
      interval: number
      loop: number
      pause: boolean
      stop: boolean
      startT: number
      curT: number
    }

    type ScheduleRet = {
      pause: boolean
      stop: boolean
    }

    type ScheduleAdd = (
      cb: (val: number) => void,
      interval: number,
      loop: number
    ) => ScheduleRet
  }
}

declare global {
  namespace ZKit {
    interface TweenObj {
      entity: Entity
      duration: number
      propName: string
      from: number
      to: number
      step: number
      pause: boolean
      stop: boolean
      succ: () => void
      fail: () => void
    }

    type TweenOptions = {
      addWay?: 'seq' | 'parallel'
      succ?: () => void
      fail?: () => void
    }

    type TweenRet = {
      pause: boolean
      stop: boolean
    }

    type TweenFunc = (
      entity: Entity,
      duration: number,
      propName: string,
      from: number,
      to: number,
      options?: TweenOptions
    ) => TweenRet
  }
}

declare global {
  namespace ZKit {
    interface Render {
      canvasW: number
      canvasH: number
      preloadRes: (res: string[]) => Promise<boolean>
      clearRes: (res?: string[]) => void
      schedule: ScheduleAdd
      tween: TweenFunc
      drawPoster(cb: () => void): Promise<any>
      addChild(val: Entity): Entity
      removeChild(val: Entity): Entity
      createText(val: string): Text
      createImg(src: string): Img
      createAnim(src: string[]): Anim
      createSpine(src: string): Spine
    }
  }
}
