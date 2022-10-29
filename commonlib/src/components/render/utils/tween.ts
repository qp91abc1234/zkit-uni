import Entity from '@lib/components/render/entity/entity'

interface ITween {
  entity: Entity
  duration: number
  propName: string
  from: number
  to: number
  startT: number
  step: number
  destroy: boolean
  succ: () => void
  fail: () => void
  cancel: () => void
}

type ITweenFuncRet = {
  succ: () => void
  fail: () => void
  cancel: () => void
}

export type ITweenFunc = (
  entity: Entity,
  duration: number,
  propName: string,
  from: number,
  to: number,
  addWay?: 'seq' | 'parallel'
) => ITweenFuncRet

export default class Tween {
  private tweenMap: Map<Entity, ITween[][]> = new Map<Entity, ITween[][]>()

  tween(
    entity: Entity,
    duration: number,
    propName: string,
    from: number,
    to: number,
    addWay: 'seq' | 'parallel' = 'parallel'
  ): ITweenFuncRet {
    if (!(propName in entity)) {
      console.error(`[tween.ts][tween] ${propName} not in entity`)
      return {} as ITweenFuncRet
    }
    const step = (to - from) / duration
    const tweenObj: ITween = {
      entity,
      duration,
      propName,
      from,
      to,
      startT: -1,
      step,
      destroy: false,
      succ: () => {},
      fail: () => {},
      cancel: () => {
        tweenObj.destroy = true
      }
    }

    if (!this.tweenMap.has(entity)) {
      this.tweenMap.set(entity, [])
    }
    const tweenArr = this.tweenMap.get(entity)!
    if (addWay === 'seq') {
      tweenArr.push([tweenObj])
    } else if (tweenArr.length === 0) {
      tweenArr.push([tweenObj])
    } else {
      tweenArr[tweenArr.length - 1].push(tweenObj)
    }

    return tweenObj
  }

  runTween() {
    this.tweenMap.forEach((tweenArr) => {
      if (tweenArr.length <= 0) return
      const arr = tweenArr[0]
      const delIndex: number[] = []
      arr.forEach((val: ITween, index) => {
        if (val.destroy || val.entity.destroy) {
          delIndex.push(index)
          val.fail()
          return
        }
        const cur = new Date().getTime()
        if (val.startT < 0) {
          val.startT = cur
          val.entity[val.propName] = val.from
        }
        const t = cur - val.startT
        const s = t * val.step
        if (
          (s > 0 && val.entity[val.propName] + s >= val.to) ||
          (s < 0 && val.entity[val.propName] + s <= val.to)
        ) {
          val.entity[val.propName] = val.to
          delIndex.push(index)
          val.succ()
        } else {
          val.entity[val.propName] += s
          val.startT = cur
        }
      })
      for (let i = delIndex.length - 1; i >= 0; i--) {
        arr.splice(delIndex[i], 1)
        if (arr.length === 0) {
          tweenArr.shift()
        }
      }
      delIndex.length = 0
    })
  }
}
