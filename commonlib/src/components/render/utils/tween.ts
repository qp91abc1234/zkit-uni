import Entity from '@lib/components/render/entity/entity'

export default class Tween {
  private tweenMap: Map<Entity, zkit.TweenObj[][]> = new Map<
    Entity,
    zkit.TweenObj[][]
  >()

  add(
    entity: Entity,
    duration: number,
    propName: string,
    from: number,
    to: number,
    options?: zkit.TweenOptions
  ): zkit.TweenRet {
    if (!(propName in entity)) {
      console.error(`[tween.ts][tween] ${propName} not in entity`)
      return {} as zkit.TweenRet
    }

    entity[propName] = from
    options = options || {}
    options.addWay = options.addWay || 'parallel'
    options.succ = options.succ || function succ() {}
    options.fail = options.fail || function fail() {}

    const step = (to - from) / duration
    const tweenObj: zkit.TweenObj = {
      entity,
      duration,
      propName,
      from,
      to,
      step,
      pause: false,
      stop: false,
      succ: options.succ,
      fail: options.fail
    }

    if (!this.tweenMap.has(entity)) {
      this.tweenMap.set(entity, [])
    }
    const tweenArr = this.tweenMap.get(entity)!
    if (options.addWay === 'seq') {
      tweenArr.push([tweenObj])
    } else if (tweenArr.length === 0) {
      tweenArr.push([tweenObj])
    } else {
      tweenArr[tweenArr.length - 1].push(tweenObj)
    }

    return tweenObj
  }

  run(delta: number) {
    this.tweenMap.forEach((tweenArr) => {
      if (tweenArr.length <= 0) return
      const arr = tweenArr[0]
      const delIndex: number[] = []
      arr.forEach((val: zkit.TweenObj, index) => {
        if (val.pause) {
          return
        }
        if (val.stop || !val.entity.parent) {
          delIndex.push(index)
          val.fail()
          return
        }

        const s = delta * val.step
        if (
          (s > 0 && val.entity[val.propName] + s >= val.to) ||
          (s < 0 && val.entity[val.propName] + s <= val.to)
        ) {
          val.entity[val.propName] = val.to
          delIndex.push(index)
          val.succ()
        } else {
          val.entity[val.propName] += s
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
