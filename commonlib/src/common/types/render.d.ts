import IEntity from '@lib/components/render/entity/entity'
import IImg from '@lib/components/render/entity/img'
import IAnim from '@lib/components/render/entity/anim'

declare global {
  namespace ZKit {
    type Entity = IEntity
    type Img = IImg
    type Anim = IAnim
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
      addChild(val: Entity): Entity
      removeChild(val: Entity): Entity
      createImg(src: string): Img
      createAnim(src: string[]): Anim
    }
  }
}
