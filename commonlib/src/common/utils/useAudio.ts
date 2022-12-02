const musicContext: UniApp.InnerAudioContext = uni.createInnerAudioContext()
let isMusicMute = false
export const useMusic = () => {
  const play = (path: string = '', loop: boolean = true) => {
    if (isMusicMute) return
    if (path !== musicContext.src) {
      // 兼容 android 机，避免 onShow 时重新播放
      musicContext.src = path
      musicContext.loop = loop
    }
    musicContext.play()
  }

  const pause = () => {
    musicContext.pause()
  }

  const stop = () => {
    musicContext.stop()
  }

  const mute = (val: boolean, path?: string, loop?: boolean) => {
    isMusicMute = val
    if (val) {
      pause()
    } else {
      play(path, loop)
    }
  }

  return {
    play,
    pause,
    stop,
    mute
  }
}

let effectContext: { [name: string]: UniApp.InnerAudioContext } = {}
let effectPool: { [name: string]: UniApp.InnerAudioContext[][] } = {}
let isEffectMute = false
let noCacheSuffix = 0
export const useEffect = () => {
  const createPool = (path: string, count = 10) => {
    const createEle = () => {
      const ctx = uni.createInnerAudioContext()
      ctx.src = path
      ctx.onEnded(() => {
        const index = effectPool[path][1].indexOf(ctx)
        effectPool[path][1].splice(index, 1)
        effectPool[path][0].push(ctx)
      })
      return ctx
    }

    if (!effectPool[path]) {
      effectPool[path] = [[], []]
      for (let i = 0; i < count; i++) {
        effectPool[path][0].push(createEle())
      }
    }

    return () => {
      if (isEffectMute) return
      const ctx = effectPool[path][0].pop() || createEle()
      effectPool[path][1].push(ctx)
      ctx.play()
    }
  }

  const stopPool = () => {
    const keys = Object.keys(effectPool)
    for (let i = 0; i < keys.length; i++) {
      effectPool[keys[i]][1].forEach((item) => {
        item.stop()
      })
    }
  }

  const destroyPool = () => {
    const keys = Object.keys(effectPool)
    for (let i = 0; i < keys.length; i++) {
      effectPool[keys[i]][0].forEach((item) => {
        item.destroy()
      })
      effectPool[keys[i]][1].forEach((item) => {
        item.destroy()
      })
    }
    effectPool = {}
  }

  const play = (path: string, cb: any = null, cache = true) => {
    if (isEffectMute) {
      cb && cb()
      return
    }

    const key = cache ? path : path + noCacheSuffix++
    if (!effectContext[key] || !cache) {
      effectContext[key] = uni.createInnerAudioContext()
      effectContext[key].src = path
    }

    if (cb) {
      const cbFunc = () => {
        effectContext[key].offEnded(cbFunc)
        if (!cache) {
          effectContext[key].destroy()
          delete effectContext[key]
        }
        cb()
      }
      effectContext[key].onEnded(cbFunc)
    }

    effectContext[key].play()
  }

  const stop = () => {
    const keys = Object.keys(effectContext)
    for (let i = 0; i < keys.length; i++) {
      effectContext[keys[i]].stop()
    }
  }

  const destroy = () => {
    const keys = Object.keys(effectContext)
    for (let i = 0; i < keys.length; i++) {
      effectContext[keys[i]].destroy()
    }
    effectContext = {}
  }

  const mute = (val) => {
    isEffectMute = val
    if (val) {
      stopPool()
      stop()
    }
  }

  return {
    createPool,
    stopPool,
    destroyPool,
    play,
    stop,
    destroy,
    mute
  }
}
