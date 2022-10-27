import Entity from '@lib/components/render/entity/entity'

interface ITween {
  entity: Entity
  duration: number
  propName: string
  from: number
  to: number
  startT: number
  step: number
  cb?: () => void
}

export type ITweenFunc = (
  entity: Entity,
  duration: number,
  propName: string,
  from: number,
  to: number,
  addWay?: 'seq' | 'parallel',
  cb?: () => void
) => Tween

export default class Tween {
  private tweenMap: Map<Entity, ITween[][]> = new Map<Entity, ITween[][]>()

  tween(
    entity: Entity,
    duration: number,
    propName: string,
    from: number,
    to: number,
    addWay: 'seq' | 'parallel' = 'seq',
    cb: () => void = () => {}
  ) {
    if (!(propName in entity)) {
      console.error(`[tween.ts][tween] ${propName} not in entity`)
      return this
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
      cb
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

    return this
  }

  runTween() {
    this.tweenMap.forEach((tweenArr) => {
      if (tweenArr.length <= 0) return
      const arr = tweenArr[0]
      const delIndex: number[] = []
      arr.forEach((val: ITween, index) => {
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
          val.cb && val.cb()
        } else {
          val.entity[val.propName] += s
          val.startT = cur
        }
      })
      delIndex.forEach((val) => {
        arr.splice(val, 1)
        if (arr.length === 0) {
          tweenArr.shift()
        }
      })
      delIndex.length = 0
    })
  }
}
